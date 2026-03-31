import * as jose from 'jose';
import trials from '../../data/wander-trials.json' assert { type: 'json' };

// Simple in-memory cache for the access token
let accessTokenCache = {
  token: null,
  expiresAt: null,
};

async function getSignedJwt(serviceAccount) {
  const privateKey = await jose.importPKCS8(
    serviceAccount.private_key,
    'RS256',
  );

  const jwt = await new jose.SignJWT({
    scope: 'https://www.googleapis.com/auth/datastore',
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(serviceAccount.client_email)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  return jwt;
}

/**
 * Gets a Google Cloud access token, using a cache to avoid re-fetching.
 * @param {object} serviceAccount The Google Cloud service account JSON.
 * @returns {Promise<string>} The access token.
 */
async function getAccessToken(serviceAccount) {
  if (
    accessTokenCache.token &&
    accessTokenCache.expiresAt &&
    accessTokenCache.expiresAt > Date.now()
  ) {
    return accessTokenCache.token;
  }

  const jwt = await getSignedJwt(serviceAccount);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  accessTokenCache = {
    token: data.access_token,
    // Set expiration to 5 minutes before it actually expires
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return accessTokenCache.token;
}

/**
 * A generic fetch wrapper for the Firestore REST API.
 * @param {string} path The Firestore document or collection path.
 * @param {object} options The standard fetch options.
 * @param {object} env The Cloudflare environment variables.
 * @returns {Promise<Response>}
 */
async function firestoreFetch(path, options = {}, env) {
  const serviceAccount = JSON.parse(env.FIRESTORE_SA_JSON);
  const projectId = serviceAccount.project_id;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`;
  const accessToken = await getAccessToken(serviceAccount);
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const finalOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  return fetch(url, finalOptions);
}

// --- Firestore Document Parsing Utilities ---
export function parseValue(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.doubleValue !== undefined) return parseFloat(value.doubleValue);
  if (value.arrayValue !== undefined)
    return value.arrayValue.values
      ? value.arrayValue.values.map(parseValue)
      : [];
  if (value.mapValue !== undefined)
    return parseFirestoreDocument(value.mapValue);
  if (value.timestampValue !== undefined) return new Date(value.timestampValue);
  // Handle other types as needed
  return undefined;
}

export function parseFirestoreDocument(document) {
  if (!document || !document.fields) return null; // Handle null or empty documents

  const parsed = {};
  for (const key in document.fields) {
    parsed[key] = parseValue(document.fields[key]);
  }
  return parsed;
}

// --- Firestore Document Serialization Utilities ---
export function serializeValue(value) {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number' && Number.isInteger(value))
    return { integerValue: value.toString() }; // Firestore integers are strings
  if (typeof value === 'number') return { doubleValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value))
    return { arrayValue: { values: value.map(serializeValue) } };
  if (typeof value === 'object' && value !== null)
    return { mapValue: { fields: serializeFirestoreDocumentFields(value) } };
  return {}; // Or handle null/undefined, or throw an error for unsupported types
}

export function serializeFirestoreDocumentFields(obj) {
  const fields = {};
  for (const constkey in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, constkey)) {
      fields[constkey] = serializeValue(obj[constkey]);
    }
  }
  return fields;
}

export function serializeFirestoreDocument(obj) {
  return { fields: serializeFirestoreDocumentFields(obj) };
}

// --- Public Functions ---

/**
 * For the MVP, this reads from the local JSON file.
 * In the future, this could fetch from a 'wanderTrials' collection in Firestore.
 * @param {string} name The human-readable name of the trial.
 * @returns {Promise<object|null>}
 */
export async function getWanderTrialByName(name) {
  const trial = trials.find((t) => t.name.toLowerCase() === name.toLowerCase());
  return trial || null;
}

/**
 * Gets a user's progress from the discordUsers collection.
 * @param {string} discordId The user's Discord ID.
 * @param {object} env The Cloudflare environment variables.
 * @returns {Promise<object|null>}
 */
export async function getDiscordUser(discordId, env) {
  try {
    const response = await firestoreFetch(`discordUsers/${discordId}`, {}, env);
    if (response.status === 404) {
      return null; // User doesn't exist yet
    }
    if (!response.ok) {
      console.error(
        `Error fetching user: ${response.status} ${response.statusText}`,
      );
      const error = await response.text();
      throw new Error(`Failed to get user: ${error}`);
    }
    const rawDoc = await response.json();
    return parseFirestoreDocument(rawDoc); // Parse the raw Firestore document
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Creates or updates a user's progress in the discordUsers collection.
 * @param {string} discordId The user's Discord ID.
 * @param {object} data The data to write to the document.
 * @param {object} env The Cloudflare environment variables.
 * @returns {Promise<object>}
 */
export async function updateDiscordUser(discordId, data, env) {
  // Firestore REST API uses POST for create and PATCH for update.
  // For simplicity, we can use PATCH with a document path to create or update.
  const response = await firestoreFetch(
    `discordUsers/${discordId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    env,
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update user: ${error}`);
  }

  return response.json();
}

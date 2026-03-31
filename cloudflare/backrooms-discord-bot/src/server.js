/**
 * The core server that runs on a Cloudflare worker.
 */

import { AutoRouter } from 'itty-router';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
  InteractionResponseFlags,
  MessageComponentTypes,
} from 'discord-interactions';
import Fuse from 'fuse.js';
import {
  DECK_RANDOM_COMMAND,
  INVITE_COMMAND,
  COMPLETE_TRIAL_COMMAND,
  PROFILE_COMMAND,
  LIST_SCENARIOS_COMMAND,
  SCENARIO_CHALLENGES_COMMAND,
} from './commands.js';
import {
  generateDeck,
  isMixedDeck,
  formatCardList,
  getDeckbuilderUrl,
} from './lib/randomizer.js';
import {
  getWanderTrialByName,
  getDiscordUser,
  updateDiscordUser,
  serializeFirestoreDocument,
} from './lib/firestore.js';
import {
  calculateTrialResults,
  createTrialResponseEmbed,
} from './lib/gamification.js';
import { createProfileEmbed } from './lib/profile.js';
import trials from '../data/wander-trials.json' assert { type: 'json' };
import { getDiscordUserId, getDiscordUserName } from './lib/discord.js';

// Create a service object for Firestore operations to enable easier mocking
const firestoreService = {
  getWanderTrialByName,
  getDiscordUser,
  updateDiscordUser,
  serializeFirestoreDocument,
};

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    };
    super(jsonBody, init);
  }
}

const router = AutoRouter();

// Helper to get command options by name
const getOption = (options, name) => {
  const option = options.find((o) => o.name === name);
  return option ? option.value : null;
};

/**
 * A simple :wave: hello page to verify the worker is working.
 */
router.get('/', (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

/**
 * Main route for all requests sent from Discord.
 */
router.post('/', async (request, env) => {
  const { isValid, interaction } = await server.verifyDiscordRequest(
    request,
    env,
  );
  if (!isValid || !interaction) {
    console.error('Bad request signature.');
    return new Response('Bad request signature.', { status: 401 });
  }
  //console.log('Incoming interaction:', JSON.stringify(interaction, null, 2));
  console.log('Incoming interaction:', interaction.type);

  if (interaction.type === InteractionType.PING) {
    console.log('Handling PING request.');
    return new JsonResponse({ type: InteractionResponseType.PONG });
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
    // console.log('Incoming AUTOCOMPLETE interaction:', JSON.stringify(interaction, null, 2));
    console.log('Handling AUTOCOMPLETE request.');
    try {
      const { name, options } = interaction.data;
      const focusedOption = options.find((option) => option.focused);

      if (!focusedOption) {
        console.error('No focused option found in autocomplete interaction.');
        return new JsonResponse({ type: InteractionResponseType.PONG });
      }

      if (name === SCENARIO_CHALLENGES_COMMAND.name && focusedOption.name === 'scenario-name') {
        const searchValue = focusedOption.value.toLowerCase();
        const filteredTrials = trials.filter((trial) =>
          trial.name.toLowerCase().includes(searchValue)
        );
        const choices = filteredTrials.map((trial) => ({
          name: trial.name,
          value: trial.name,
        })).slice(0, 25); // Limit to 25 choices

        return new JsonResponse({
          type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
          data: { choices },
        });
      }
    } catch (error) {
      console.error('Error during autocomplete:', error);
      return new JsonResponse({
        type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
        data: { choices: [] }, // Return empty choices on error
      });
    }
  }

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(
      `Handling APPLICATION_COMMAND: ${interaction.data.name.toLowerCase()}`,
    );
    switch (interaction.data.name.toLowerCase()) {
      case INVITE_COMMAND.name.toLowerCase(): {
        const applicationId = env.DISCORD_APPLICATION_ID;
        const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${applicationId}&scope=applications.commands`;
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: INVITE_URL,
            flags: InteractionResponseFlags.EPHEMERAL,
          },
        });
      }
      case DECK_RANDOM_COMMAND.name.toLowerCase(): {
        const mode = getOption(interaction.data.options, 'mode');
        const deck = generateDeck(mode);

        const cardList = formatCardList(deck.cards);
        const deckUrl = getDeckbuilderUrl(deck);

        let title;
        let description;
        if (isMixedDeck(deck)) {
          title = 'Mixed Deck';
          description =
            `Rooms: ${deck.archetypeNames.rooms}\n` +
            `Items: ${deck.archetypeNames.items}\n` +
            `Entities: ${deck.archetypeNames.entities}\n` +
            `Outcomes: ${deck.archetypeNames.outcomes}\n\n` +
            cardList;
        } else {
          title = 'Simple Deck';
          description = `Archetype: ${deck.archetypeName}\n\n` + cardList;
        }

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [{ title, description, color: 0xfeb737 }],
            components: [
              {
                type: 1, // Action Row
                components: [
                  {
                    type: 2, // Button
                    style: 5, // Link
                    label: 'Open in Deckbuilder',
                    url: deckUrl,
                  },
                ],
              },
            ],
          },
        });
      }
      case COMPLETE_TRIAL_COMMAND.name.toLowerCase(): {
        const trialName = getOption(interaction.data.options, 'trial-name');

        const fuseOptions = {
          keys: ['name'],
          threshold: 0.4,
          minMatchCharLength: 3,
          includeScore: true,
        };

        // Fuzzy search for the trial
        const trialFuse = new Fuse(trials, fuseOptions);
        const trialResults = trialFuse.search(trialName);

        if (!trialResults.length) {
          return new JsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Trial "${trialName}" not found.`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        }
        const trial = trialResults[0].item;

        // Construct and return the interactive message for challenge selection
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Found trial: **${trial.name}**. Please select the challenges you completed.`,
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [
              {
                type: MessageComponentTypes.ACTION_ROW, // type 1 for ActionRow
                components: [
                  {
                    type: MessageComponentTypes.STRING_SELECT, // type 3 for SelectMenu (string-based)
                    custom_id: `select_challenges_${trial.id}`, // Unique ID for this select menu
                    placeholder: 'Select completed challenges...',
                    min_values: 1,
                    max_values: trial.challenges.length,
                    options: trial.challenges.map(challenge => ({
                      label: challenge.name,
                      value: challenge.id,
                      description: `Grants ${challenge.xp} XP`
                    }))
                  }
                ]
              }
            ],
          },
        });
      }
      case PROFILE_COMMAND.name.toLowerCase(): {
        const discordId = getDiscordUserId(interaction);
        console.log(`attempting to connect to firestore for user id: ${discordId}`);
        const discordUser = await firestoreService.getDiscordUser(discordId, env);

        if (!discordUser) {
          console.log('no discord user found in firestore');
          return new JsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: 'You have not completed any trials yet.',
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        }
        console.log('recieved discord user from firestore');

        const embed = createProfileEmbed(discordUser);
        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [embed],
          },
        });
      }
      case LIST_SCENARIOS_COMMAND.name.toLowerCase(): {
        const scenarioNames = trials.map((trial) => trial.name);
        const description = scenarioNames.join('\n');

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [{ title: 'Available Wander Trials', description, color: 0xfeb737 }],
          },
        });
      }

      case SCENARIO_CHALLENGES_COMMAND.name.toLowerCase(): {
        const scenarioName = getOption(interaction.data.options, 'scenario-name');

        const scenario = trials.find(
          (t) => t.name.toLowerCase() === scenarioName.toLowerCase(),
        );

        if (!scenario) {
          return new JsonResponse({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Scenario "${scenarioName}" not found.`,
              flags: InteractionResponseFlags.EPHEMERAL,
            },
          });
        }

        const discordId = getDiscordUserId(interaction);
        console.log(`attempting to connect to firestore for user id: ${discordId}`);
        const discordUser = await firestoreService.getDiscordUser(discordId, env);
        console.log('recieved discord user from firestore');

        const completedChallengeIds = discordUser?.trials?.[scenario.id]?.completedChallenges || [];

        const fields = scenario.challenges.map((challenge) => {
          const isCompleted = completedChallengeIds.includes(challenge.id);
          const status = isCompleted ? '✅ Completed' : '❌ Not Completed';
          return {
            name: challenge.name,
            value: status,
            inline: true,
          };
        });

        const embed = {
          title: `${scenario.name} Challenges`,
          color: 0xfeb737,
          fields: fields,
        };

        console.log('created embed for scenario challenges');

        return new JsonResponse({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [embed],
          },
        });
      }
      default:
        console.error(`Unknown command: ${interaction.data.name}`);
        return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
    }
  } else if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
    const componentId = interaction.data.custom_id;
    console.log(`Handling MESSAGE_COMPONENT: ${componentId}`);
    if (componentId.startsWith('select_challenges_')) {
      const trialId = componentId.replace('select_challenges_', '');
      const selectedChallengeIds = interaction.data.values;
      console.log(
        `Trial ${trialId} completed with challenges: ${selectedChallengeIds.join(', ')}`,
      );

      const trial = trials.find(t => t.id === trialId);

      if (!trial) {
        console.error(`Could not find trial with ID: ${trialId}`);
        return new JsonResponse({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: {
            content: 'Error: Could not find the selected trial.',
            flags: InteractionResponseFlags.EPHEMERAL,
            components: [], // Remove components
          },
        });
      }

      const completedChallenges = trial.challenges.filter(challenge =>
        selectedChallengeIds.includes(challenge.id)
      );

      const discordId = getDiscordUserId(interaction);
      console.log(`attempting to connect to firestore for user id: ${discordId}`);
      const discordUser = await firestoreService.getDiscordUser(discordId, env);
      console.log('recieved discord user from firestore');
      
      const results = calculateTrialResults(
        discordUser,
        trial,
        completedChallenges,
        getDiscordUserName(interaction),
      );
      // console.log('Trial results:', JSON.stringify(results, null, 2));
      console.log('recieved trial results');

      const serializedUser = firestoreService.serializeFirestoreDocument(results.updatedUser);
      await firestoreService.updateDiscordUser(discordId, serializedUser, env);
      const embed = createTrialResponseEmbed(results);

      return new JsonResponse({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          embeds: [embed],
          components: [], // Remove components after selection
        },
      });
    }
  }

  console.error('Unknown Type', {
    interaction: JSON.stringify(interaction, null, 2),
  });
  return new JsonResponse({ error: 'Unknown Type' }, { status: 400 });
});
router.all('*', () => new Response('Not Found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');
  const body = await request.text();
  const isValidRequest =
    signature &&
    timestamp &&
    (await verifyKey(body, signature, timestamp, env.DISCORD_PUBLIC_KEY));
  if (!isValidRequest) {
    return { isValid: false };
  }

  return { interaction: JSON.parse(body), isValid: true };
}

const server = {
  verifyDiscordRequest,
  fetch: router.fetch,
  firestoreService, // Expose firestoreService for testing
};

export default server;

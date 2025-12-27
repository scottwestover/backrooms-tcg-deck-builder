import archetypesData from '../../data/archetypes.json' assert { type: 'json' };
import cardsData from '../../data/cards.json' assert { type: 'json' };

// Create a map of cards for easy lookup
const cardsMap = new Map(cardsData.map((card) => [card.id, card]));

/**
 * Processes the raw archetype data, mapping 'qty' to 'count'.
 * @returns {Archetype[]} Processed archetype data.
 */
function getArchetypes() {
  return archetypesData.map((archetype) => ({
    id: archetype.id,
    name: archetype.name,
    rooms: archetype.rooms.map((c) => ({ id: c.id, count: c.qty })),
    items: archetype.items.map((c) => ({ id: c.id, count: c.qty })),
    outcomes: archetype.outcomes.map((c) => ({ id: c.id, count: c.qty })),
    entities: archetype.entities.map((c) => ({ id: c.id, count: c.qty })),
  }));
}

/**
 * Generates a deck from a single random archetype.
 * @param {Archetype[]} archetypes - The list of all possible archetypes.
 * @returns {GeneratedDeck} The generated deck.
 */
function generateSimpleDeck(archetypes) {
  if (archetypes.length === 0) {
    return { archetypeName: 'Unknown Archetype', cards: [] };
  }
  const randomIndex = Math.floor(Math.random() * archetypes.length);
  const archetype = archetypes[randomIndex];

  const cards = [
    ...archetype.rooms,
    ...archetype.items,
    ...archetype.outcomes,
    ...archetype.entities,
  ];

  return {
    archetypeName: archetype.name,
    cards: cards,
  };
}

/**
 * Generates a deck from a mix of random archetypes for each card type.
 * @param {Archetype[]} archetypes - The list of all possible archetypes.
 * @returns {GeneratedMixedDeck} The generated deck.
 */
function generateMixedDeck(archetypes) {
  if (archetypes.length === 0) {
    return {
      archetypeNames: {
        rooms: 'Unknown Archetype',
        items: 'Unknown Archetype',
        outcomes: 'Unknown Archetype',
        entities: 'Unknown Archetype',
      },
      cards: [],
    };
  }

  const getRandomArchetype = () =>
    archetypes[Math.floor(Math.random() * archetypes.length)];

  const roomsArchetype = getRandomArchetype();
  const itemsArchetype = getRandomArchetype();
  const outcomesArchetype = getRandomArchetype();
  const entitiesArchetype = getRandomArchetype();

  const cards = [
    ...roomsArchetype.rooms,
    ...itemsArchetype.items,
    ...outcomesArchetype.outcomes,
    ...entitiesArchetype.entities,
  ];

  return {
    archetypeNames: {
      rooms: roomsArchetype.name,
      items: itemsArchetype.name,
      outcomes: outcomesArchetype.name,
      entities: entitiesArchetype.name,
    },
    cards: cards,
  };
}

/**
 * Type guard to check if a deck is a GeneratedMixedDeck.
 * @param {GeneratedDeck | GeneratedMixedDeck} deck - The deck to check.
 * @returns {boolean} True if the deck is a mixed deck.
 */
export function isMixedDeck(deck) {
  return 'archetypeNames' in deck;
}

/**
 * Finds the ID of an archetype by its name.
 * @param {string} name - The name of the archetype.
 * @param {Archetype[]} archetypes - The list of all archetypes.
 * @returns {string | null} The archetype ID as a string, or null if not found.
 */
export function findArchetypeKeyByName(name, archetypes) {
  const archetype = archetypes.find((a) => a.name === name);
  return archetype ? archetype.id.toString() : null;
}

/**
 * Main function to generate a deck based on the specified mode.
 * @param {'simple' | 'mixed'} generationMode - The mode for deck generation.
 * @returns {(GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] }} The generated deck.
 */
export function generateDeck(generationMode) {
  const archetypes = getArchetypes();
  if (generationMode === 'simple') {
    return generateSimpleDeck(archetypes);
  } else if (generationMode === 'mixed') {
    return generateMixedDeck(archetypes);
  }
  // Default return for unrecognized modes
  return {
    archetypeName: 'Unknown Archetype',
    cards: [],
  };
}

/**
 * Formats the card list of a generated deck into a string.
 * @param {ICountCard[]} cards - The list of cards in the deck.
 * @returns {string} A formatted string of the card list.
 */
export function formatCardList(cards) {
  if (!cards || cards.length === 0) {
    return 'No cards in this deck.';
  }

  const cardCounts = {};
  cards.forEach((card) => {
    cardCounts[card.id] = (cardCounts[card.id] || 0) + card.count;
  });

  const groupedCards = {
    Entities: [],
    Outcomes: [],
    Rooms: [],
    Items: [],
  };

  for (const id in cardCounts) {
    const cardInfo = cardsMap.get(id);
    if (cardInfo) {
      const list = groupedCards[cardInfo.cardType + 's'];
      if (list) {
        list.push(`${cardCounts[id]}x ${cardInfo.name.english} (${cardInfo.id})`);
      }
    }
  }

  let list = '**Card List**\n---\n';
  for (const type in groupedCards) {
    if (groupedCards[type].length > 0) {
      list += `**${type}**:\n`;
      list += groupedCards[type].join('\n') + '\n\n';
    }
  }

  return list.trim();
}

/**
 * Constructs a URL to open the generated deck in the deckbuilder.
 * @param {(GeneratedDeck | GeneratedMixedDeck)} deck - The generated deck.
 * @returns {string} The URL for the deckbuilder.
 */
export function getDeckbuilderUrl(deck) {
  const baseUrl = 'https://backrooms-tcg-deckbuilder.web.app/randomizer';
  const archetypes = getArchetypes();
  let params;

  if (isMixedDeck(deck)) {
    params = {
      rooms: findArchetypeKeyByName(deck.archetypeNames.rooms, archetypes),
      items: findArchetypeKeyByName(deck.archetypeNames.items, archetypes),
      entities: findArchetypeKeyByName(
        deck.archetypeNames.entities,
        archetypes,
      ),
      outcomes: findArchetypeKeyByName(
        deck.archetypeNames.outcomes,
        archetypes,
      ),
    };
  } else {
    const key = findArchetypeKeyByName(deck.archetypeName, archetypes);
    params = { rooms: key, items: key, entities: key, outcomes: key };
  }

  const query = new URLSearchParams(
    Object.entries(params).filter(([, val]) => val !== null),
  ).toString();
  return `${baseUrl}?${query}`;
}

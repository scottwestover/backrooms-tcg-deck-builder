import { ICountCard, IDeckCard } from '../../models';
import { BackroomsCardStore } from '../store/backrooms-card.store';

export interface DeckAsList {
  id: string;
  name: string;
  count: number;
}

export interface TransformedDeckViews {
  generatedCards: {
    rooms: IDeckCard[];
    items: IDeckCard[];
    entities: IDeckCard[];
    outcomes: IDeckCard[];
  } | null;
  generatedDeckAsList: {
    rooms: DeckAsList[];
    items: DeckAsList[];
    entities: DeckAsList[];
    outcomes: DeckAsList[];
  } | null;
}

export function transformDeckViews(
  cards: ICountCard[] | null,
  cardStore: InstanceType<typeof BackroomsCardStore>,
): TransformedDeckViews {
  if (!cards) {
    return {
      generatedCards: null,
      generatedDeckAsList: null,
    };
  }

  const cardMap = cardStore.cardsMap();
  const rooms: IDeckCard[] = [];
  const items: IDeckCard[] = [];
  const entities: IDeckCard[] = [];
  const outcomes: IDeckCard[] = [];
  const listRooms: DeckAsList[] = [];
  const listItems: DeckAsList[] = [];
  const listEntities: DeckAsList[] = [];
  const listOutcomes: DeckAsList[] = [];

  for (const countCard of cards) {
    const card = cardMap.get(countCard.id);

    if (card) {
      const deckCard: IDeckCard = { ...card, count: countCard.count };
      const deckAsListCard = {
        id: card.id,
        name: card.name.english,
        count: countCard.count,
      };

      if (card.cardType.toLowerCase() === 'room') {
        rooms.push(deckCard);
        listRooms.push(deckAsListCard);
      } else if (card.cardType.toLowerCase() === 'item') {
        items.push(deckCard);
        listItems.push(deckAsListCard);
      } else if (card.cardType.toLowerCase() === 'entity') {
        entities.push(deckCard);
        listEntities.push(deckAsListCard);
      } else if (card.cardType.toLowerCase() === 'outcome') {
        outcomes.push(deckCard);
        listOutcomes.push(deckAsListCard);
      }
    }
  }

  return {
    generatedCards: { rooms, items, entities, outcomes },
    generatedDeckAsList: {
      rooms: listRooms,
      items: listItems,
      entities: listEntities,
      outcomes: listOutcomes,
    },
  };
}

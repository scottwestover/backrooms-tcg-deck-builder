import { createDeckFromGenerated } from './deck-factory.function';
import {
  GeneratedDeck,
  GeneratedMixedDeck,
} from '../services/randomizer.service';
import { ICountCard } from '../../models';
import * as uuid from 'uuid';

describe('createDeckFromGenerated', () => {
  const mockDate = new Date('2023-01-01T00:00:00.000Z');

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create a deck from a simple GeneratedDeck', () => {
    const generatedDeck: GeneratedDeck & { cards: ICountCard[] } = {
      archetypeName: 'Test Archetype',
      cards: [{ id: 'C01', count: 2 }],
    };

    const result = createDeckFromGenerated(generatedDeck);

    expect(result.id).toEqual(jasmine.any(String));
    expect(result.title).toBe('Test Archetype');
    expect(result.description).toBe('A randomly generated deck.');
    expect(result.cards).toEqual([{ id: 'C01', count: 2 }]);
    expect(result.date).toEqual(mockDate.toISOString());
    expect(result.imageCardId).toBe('C01');
  });

  it('should create a deck from a GeneratedMixedDeck', () => {
    const generatedDeck: GeneratedMixedDeck & { cards: ICountCard[] } = {
      archetypeNames: {
        rooms: 'Room Archetype',
        items: 'Item Archetype',
        entities: 'Entity Archetype',
        outcomes: 'Outcome Archetype',
      },
      cards: [{ id: 'C02', count: 1 }],
    };

    const result = createDeckFromGenerated(generatedDeck);

    expect(result.id).toEqual(jasmine.any(String));
    expect(result.title).toBe('Mixed Random Deck');
    expect(result.description).toBe('A randomly generated deck.');
    expect(result.cards).toEqual([{ id: 'C02', count: 1 }]);
    expect(result.date).toEqual(mockDate.toISOString());
    expect(result.imageCardId).toBe('C02');
  });

  it('should use a fallback imageCardId if the deck has no cards', () => {
    const generatedDeck: GeneratedDeck & { cards: ICountCard[] } = {
      archetypeName: 'Empty Archetype',
      cards: [],
    };

    const result = createDeckFromGenerated(generatedDeck);

    expect(result.imageCardId).toBe('LL-001');
  });
});

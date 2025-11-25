import { transformDeckViews } from './deck-view-transformer.function';
import { BackroomsCardStore } from '../store/backrooms-card.store';
import { ICountCard, IDeckCard } from '../../models';

describe('transformDeckViews', () => {
  let cardStoreMock: jasmine.SpyObj<InstanceType<typeof BackroomsCardStore>>;
  const mockCardsMap = new Map<string, IDeckCard>([
    [
      'R01',
      { id: 'R01', name: { english: 'Room 1' }, cardType: 'Room' } as IDeckCard,
    ],
    [
      'I01',
      { id: 'I01', name: { english: 'Item 1' }, cardType: 'Item' } as IDeckCard,
    ],
    [
      'E01',
      {
        id: 'E01',
        name: { english: 'Entity 1' },
        cardType: 'Entity',
      } as IDeckCard,
    ],
    [
      'O01',
      {
        id: 'O01',
        name: { english: 'Outcome 1' },
        cardType: 'Outcome',
      } as IDeckCard,
    ],
  ]);

  beforeEach(() => {
    const cardStoreSpy = jasmine.createSpyObj('BackroomsCardStore', [
      'cardsMap',
    ]);
    cardStoreSpy.cardsMap.and.returnValue(mockCardsMap);
    cardStoreMock = cardStoreSpy;
  });

  it('should return null views if input cards are null', () => {
    const result = transformDeckViews(null, cardStoreMock);
    expect(result.generatedCards).toBeNull();
    expect(result.generatedDeckAsList).toBeNull();
  });

  it('should return empty views if input cards are empty', () => {
    const result = transformDeckViews([], cardStoreMock);
    expect(result.generatedCards).toEqual({
      rooms: [],
      items: [],
      entities: [],
      outcomes: [],
    });
    expect(result.generatedDeckAsList).toEqual({
      rooms: [],
      items: [],
      entities: [],
      outcomes: [],
    });
  });

  it('should correctly transform and categorize a list of cards', () => {
    const inputCards: ICountCard[] = [
      { id: 'R01', count: 2 },
      { id: 'I01', count: 1 },
      { id: 'E01', count: 3 },
      { id: 'O01', count: 1 },
      { id: 'UNKNOWN', count: 1 }, // Card not in map
    ];

    const result = transformDeckViews(inputCards, cardStoreMock);

    // Check generatedCards (image view)
    expect(result.generatedCards?.rooms.length).toBe(1);
    expect(result.generatedCards?.rooms[0]).toEqual({
      ...mockCardsMap.get('R01')!,
      count: 2,
    });

    expect(result.generatedCards?.items.length).toBe(1);
    expect(result.generatedCards?.items[0]).toEqual({
      ...mockCardsMap.get('I01')!,
      count: 1,
    });

    expect(result.generatedCards?.entities.length).toBe(1);
    expect(result.generatedCards?.entities[0]).toEqual({
      ...mockCardsMap.get('E01')!,
      count: 3,
    });

    expect(result.generatedCards?.outcomes.length).toBe(1);
    expect(result.generatedCards?.outcomes[0]).toEqual({
      ...mockCardsMap.get('O01')!,
      count: 1,
    });

    // Check generatedDeckAsList (list view)
    expect(result.generatedDeckAsList?.rooms.length).toBe(1);
    expect(result.generatedDeckAsList?.rooms[0]).toEqual({
      id: 'R01',
      name: 'Room 1',
      count: 2,
    });

    expect(result.generatedDeckAsList?.items.length).toBe(1);
    expect(result.generatedDeckAsList?.items[0]).toEqual({
      id: 'I01',
      name: 'Item 1',
      count: 1,
    });

    expect(result.generatedDeckAsList?.entities.length).toBe(1);
    expect(result.generatedDeckAsList?.entities[0]).toEqual({
      id: 'E01',
      name: 'Entity 1',
      count: 3,
    });

    expect(result.generatedDeckAsList?.outcomes.length).toBe(1);
    expect(result.generatedDeckAsList?.outcomes[0]).toEqual({
      id: 'O01',
      name: 'Outcome 1',
      count: 1,
    });
  });

  it('should handle case-insensitivity for card types', () => {
    const mixedCaseMap = new Map<string, IDeckCard>([
      [
        'R01',
        {
          id: 'R01',
          name: { english: 'Room 1' },
          cardType: 'Room',
        } as IDeckCard,
      ],
      [
        'I01',
        {
          id: 'I01',
          name: { english: 'Item 1' },
          cardType: 'item',
        } as IDeckCard,
      ],
    ]);
    cardStoreMock.cardsMap.and.returnValue(mixedCaseMap);

    const inputCards: ICountCard[] = [
      { id: 'R01', count: 1 },
      { id: 'I01', count: 1 },
    ];

    const result = transformDeckViews(inputCards, cardStoreMock);

    expect(result.generatedCards?.rooms.length).toBe(1);
    expect(result.generatedCards?.items.length).toBe(1);
  });
});

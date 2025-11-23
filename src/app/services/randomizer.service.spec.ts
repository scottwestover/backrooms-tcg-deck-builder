import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RandomizerService } from './randomizer.service';
import { BackroomsCardStore } from '../store/backrooms-card.store';
import { WebsiteStore } from '../store/website.store';
import { BackroomsCard, ICountCard } from '../../models';

describe('RandomizerService', () => {
  let service: RandomizerService;
  let httpTestingController: HttpTestingController;
  let mockBackroomsCardStore: Partial<InstanceType<typeof BackroomsCardStore>>;
  let mockWebsiteStore: Partial<InstanceType<typeof WebsiteStore>>;

  const mockRawArchetypes = {
    archetype1: {
      name: 'Archetype One',
      rooms: [{ id: 'R1', qty: 1 }],
      items: [{ id: 'I1', qty: 1 }],
      entities: [{ id: 'E1', qty: 1 }],
      outcomes: [{ id: 'O1', qty: 1 }],
    },
    archetype2: {
      name: 'Archetype Two',
      rooms: [{ id: 'R2', qty: 1 }],
      items: [{ id: 'I2', qty: 1 }],
      entities: [{ id: 'E2', qty: 1 }],
      outcomes: [{ id: 'O2', qty: 1 }],
    },
  };

  const mockProcessedArchetypes = {
    archetype1: {
      name: 'Archetype One',
      rooms: [{ id: 'R1', count: 1 }] as ICountCard[],
      items: [{ id: 'I1', count: 1 }] as ICountCard[],
      entities: [{ id: 'E1', count: 1 }] as ICountCard[],
      outcomes: [{ id: 'O1', count: 1 }] as ICountCard[],
    },
    archetype2: {
      name: 'Archetype Two',
      rooms: [{ id: 'R2', count: 1 }] as ICountCard[],
      items: [{ id: 'I2', count: 1 }] as ICountCard[],
      entities: [{ id: 'E2', count: 1 }] as ICountCard[],
      outcomes: [{ id: 'O2', count: 1 }] as ICountCard[],
    },
  };

  const mockCardsMap = new Map<string, BackroomsCard>();
  mockCardsMap.set('R1', { id: 'R1', cardType: 'Room' } as BackroomsCard);
  mockCardsMap.set('I1', { id: 'I1', cardType: 'Item' } as BackroomsCard);
  mockCardsMap.set('E1', { id: 'E1', cardType: 'Entity' } as BackroomsCard);
  mockCardsMap.set('O1', { id: 'O1', cardType: 'Outcome' } as BackroomsCard);
  mockCardsMap.set('R2', { id: 'R2', cardType: 'Room' } as BackroomsCard);
  mockCardsMap.set('I2', { id: 'I2', cardType: 'Item' } as BackroomsCard);
  mockCardsMap.set('E2', { id: 'E2', cardType: 'Entity' } as BackroomsCard);
  mockCardsMap.set('O2', { id: 'O2', cardType: 'Outcome' } as BackroomsCard);

  beforeEach(() => {
    mockBackroomsCardStore = {
      cardsMap: signal(mockCardsMap),
    };
    mockWebsiteStore = {
      updateDeck: jasmine.createSpy('updateDeck'),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RandomizerService,
        { provide: BackroomsCardStore, useValue: mockBackroomsCardStore },
        { provide: WebsiteStore, useValue: mockWebsiteStore },
      ],
    });

    service = TestBed.inject(RandomizerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getArchetypes', () => {
    it('should retrieve archetypes from the JSON file', () => {
      service.getArchetypes().subscribe((archetypes) => {
        expect(archetypes).toEqual(mockProcessedArchetypes);
      });

      const req = httpTestingController.expectOne(
        '/assets/randomizer/archetypes.json',
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockRawArchetypes);
    });
  });

  describe('generateSimpleDeck', () => {
    it('should generate a simple deck with cards from one archetype', () => {
      const generatedDeck = service.generateSimpleDeck(mockProcessedArchetypes);

      expect(generatedDeck).toBeTruthy();
      expect(generatedDeck.archetypeName).toMatch(
        /Archetype One|Archetype Two/,
      );
      expect(generatedDeck.cards.length).toBeGreaterThan(0);

      const selectedArchetypeKey = Object.keys(mockProcessedArchetypes).find(
        (key) =>
          mockProcessedArchetypes[key as keyof typeof mockProcessedArchetypes]
            .name === generatedDeck.archetypeName,
      )!;
      const selectedArchetype =
        mockProcessedArchetypes[
          selectedArchetypeKey as keyof typeof mockProcessedArchetypes
        ];

      expect(generatedDeck.cards).toEqual(
        jasmine.arrayContaining([
          ...selectedArchetype.rooms,
          ...selectedArchetype.items,
          ...selectedArchetype.entities,
          ...selectedArchetype.outcomes,
        ]),
      );
    });

    it('should return an empty deck if no archetypes are provided', () => {
      const generatedDeck = service.generateSimpleDeck({});
      expect(generatedDeck.archetypeName).toBe('Unknown Archetype');
      expect(generatedDeck.cards.length).toBe(0);
    });
  });

  describe('generateMixedDeck', () => {
    it('should generate a mixed deck with cards from different archetypes', () => {
      const generatedDeck = service.generateMixedDeck(mockProcessedArchetypes);

      expect(generatedDeck).toBeTruthy();
      expect(generatedDeck.archetypeNames).toBeTruthy();
      expect(generatedDeck.archetypeNames.rooms).toMatch(
        /Archetype One|Archetype Two/,
      );
      expect(generatedDeck.archetypeNames.items).toMatch(
        /Archetype One|Archetype Two/,
      );
      expect(generatedDeck.archetypeNames.entities).toMatch(
        /Archetype One|Archetype Two/,
      );
      expect(generatedDeck.archetypeNames.outcomes).toMatch(
        /Archetype One|Archetype Two/,
      );
      expect(generatedDeck.cards.length).toBeGreaterThan(0);

      // Verify that cards from different archetypes are present
      const roomCardIds = generatedDeck.cards
        .filter((c) => mockCardsMap.get(c.id)?.cardType === 'Room')
        .map((c) => c.id);
      const itemCardIds = generatedDeck.cards
        .filter((c) => mockCardsMap.get(c.id)?.cardType === 'Item')
        .map((c) => c.id);
      const entityCardIds = generatedDeck.cards
        .filter((c) => mockCardsMap.get(c.id)?.cardType === 'Entity')
        .map((c) => c.id);
      const outcomeCardIds = generatedDeck.cards
        .filter((c) => mockCardsMap.get(c.id)?.cardType === 'Outcome')
        .map((c) => c.id);

      expect(roomCardIds.length).toBeGreaterThan(0);
      expect(itemCardIds.length).toBeGreaterThan(0);
      expect(entityCardIds.length).toBeGreaterThan(0);
      expect(outcomeCardIds.length).toBeGreaterThan(0);
    });

    it('should return an empty deck if no archetypes are provided for mixed deck', () => {
      const generatedDeck = service.generateMixedDeck({});
      expect(generatedDeck.archetypeNames.rooms).toBe('Unknown Archetype');
      expect(generatedDeck.cards.length).toBe(0);
    });
  });
});

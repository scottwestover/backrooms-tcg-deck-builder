import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RandomizerPageComponent } from './randomizer-page.component';
import { RandomizerService } from '../../services/randomizer.service';
import { BackroomsCardStore } from '../../store/backrooms-card.store';
import { WebsiteStore } from '../../store/website.store';
import { DialogStore } from '../../store/dialog.store';
import { Meta, Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IDeckCard } from '../../../models';

describe('RandomizerPageComponent', () => {
  let component: RandomizerPageComponent;
  let fixture: ComponentFixture<RandomizerPageComponent>;
  let router: jasmine.SpyObj<Router>;
  let randomizerService: jasmine.SpyObj<RandomizerService>;
  let cardStore: jasmine.SpyObj<InstanceType<typeof BackroomsCardStore>>;
  let websiteStore: jasmine.SpyObj<InstanceType<typeof WebsiteStore>>;
  let dialogStore: jasmine.SpyObj<InstanceType<typeof DialogStore>>;
  let meta: jasmine.SpyObj<Meta>;
  let title: jasmine.SpyObj<Title>;

  const mockArchetypes = {
    alpha: {
      name: 'Alpha',
      rooms: [{ id: 'R01', count: 1 }],
      items: [],
      entities: [],
      outcomes: [],
    },
    beta: {
      name: 'Beta',
      rooms: [],
      items: [{ id: 'I01', count: 1 }],
      entities: [],
      outcomes: [],
    },
  };

  const mockCardsMap = new Map<string, IDeckCard>([
    [
      'R01',
      {
        id: 'R01',
        name: { english: 'Room 1' },
        cardType: 'Room',
        count: 1,
      } as IDeckCard,
    ],
    [
      'I01',
      {
        id: 'I01',
        name: { english: 'Item 1' },
        cardType: 'Item',
        count: 1,
      } as IDeckCard,
    ],
  ]);

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const randomizerServiceSpy = jasmine.createSpyObj('RandomizerService', [
      'getArchetypes',
      'generateSimpleDeck',
      'generateMixedDeck',
    ]);
    const cardStoreSpy = jasmine.createSpyObj('BackroomsCardStore', [
      'updateCards',
      'cardsMap',
    ]);
    const websiteStoreSpy = jasmine.createSpyObj('WebsiteStore', [
      'updateDeck',
    ]);
    const dialogStoreSpy = jasmine.createSpyObj('DialogStore', [
      'updateExportDeckDialog',
    ]);
    const metaSpy = jasmine.createSpyObj('Meta', ['addTags']);
    const titleSpy = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [RandomizerPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RandomizerService, useValue: randomizerServiceSpy },
        { provide: BackroomsCardStore, useValue: cardStoreSpy },
        { provide: WebsiteStore, useValue: websiteStoreSpy },
        { provide: DialogStore, useValue: dialogStoreSpy },
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomizerPageComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    randomizerService = TestBed.inject(
      RandomizerService,
    ) as jasmine.SpyObj<RandomizerService>;
    cardStore = TestBed.inject(BackroomsCardStore) as jasmine.SpyObj<
      InstanceType<typeof BackroomsCardStore>
    >;
    websiteStore = TestBed.inject(WebsiteStore) as jasmine.SpyObj<
      InstanceType<typeof WebsiteStore>
    >;
    dialogStore = TestBed.inject(DialogStore) as jasmine.SpyObj<
      InstanceType<typeof DialogStore>
    >;
    meta = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    title = TestBed.inject(Title) as jasmine.SpyObj<Title>;

    randomizerService.getArchetypes.and.returnValue(of(mockArchetypes));
    (cardStore.cardsMap as jasmine.Spy).and.returnValue(mockCardsMap);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly on ngOnInit', () => {
    component.ngOnInit();
    expect(title.setTitle).toHaveBeenCalledWith(
      'Backrooms TCG - Deck Randomizer',
    );
    expect(meta.addTags).toHaveBeenCalled();
    expect(cardStore.updateCards).toHaveBeenCalled();
    expect(randomizerService.getArchetypes).toHaveBeenCalled();
    expect(component.archetypes).toEqual(mockArchetypes);
    expect(component.archetypeKeys).toEqual(['alpha', 'beta']);
  });

  it('should set generation mode', () => {
    component.setGenerationMode('mixed');
    expect(component.generationMode).toBe('mixed');
  });

  it('should generate a simple deck', () => {
    const simpleDeck = {
      archetypeName: 'Alpha',
      cards: [{ id: 'R01', count: 1 }],
    };
    randomizerService.generateSimpleDeck.and.returnValue(simpleDeck);
    component.generationMode = 'simple';
    component.generate();
    expect(randomizerService.generateSimpleDeck).toHaveBeenCalled();
    expect(component.generatedDeck).toEqual(simpleDeck);
    expect(component.lastRandomDeck).toEqual(simpleDeck);
  });

  it('should generate a mixed deck', () => {
    const mixedDeck = {
      archetypeNames: {
        rooms: 'alpha',
        items: 'beta',
        entities: 'alpha',
        outcomes: 'beta',
      },
      cards: [{ id: 'R01', count: 1 }],
    };
    randomizerService.generateMixedDeck.and.returnValue(mixedDeck);
    component.generationMode = 'mixed';
    component.generate();
    expect(randomizerService.generateMixedDeck).toHaveBeenCalled();
    expect(component.generatedDeck).toEqual(mixedDeck);
  });

  it('should handle manual selection change', () => {
    component.archetypes = mockArchetypes;
    component.manualSelections = {
      rooms: 'alpha',
      items: 'beta',
      entities: 'alpha',
      outcomes: 'beta',
    };
    component.onManualSelectionChange();
    expect(component.generatedDeck).toBeTruthy();
    expect(component.generatedDeck?.cards.length).toBe(2);
  });

  it('should update deck views when a deck is generated', () => {
    const simpleDeck = {
      archetypeName: 'Alpha',
      cards: [{ id: 'R01', count: 2 }],
    };
    randomizerService.generateSimpleDeck.and.returnValue(simpleDeck);
    component.generationMode = 'simple';

    component.generate();

    expect(component.generatedCards?.rooms.length).toBe(1);
    expect(component.generatedCards?.rooms[0].count).toBe(2);
    expect(component.generatedDeckAsList?.rooms.length).toBe(1);
    expect(component.generatedDeckAsList?.rooms[0].count).toBe(2);
  });

  it('should add to deckbuilder', () => {
    component.generatedDeck = {
      archetypeName: 'Alpha',
      cards: [{ id: 'R01', count: 1 }],
    };
    component.addToDeckbuilder();
    expect(websiteStore.updateDeck).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('should open export deck dialog', () => {
    component.generatedDeck = {
      archetypeName: 'Alpha',
      cards: [{ id: 'R01', count: 1 }],
    };
    component.openExportDeckDialog();
    expect(dialogStore.updateExportDeckDialog).toHaveBeenCalled();
  });

  it('should update manual selections when overall selection changes', () => {
    component.ngOnInit();
    component.onOverallSelectionChange('beta');
    expect(component.overallSelection).toBe('beta');
    expect(component.manualSelections).toEqual({
      rooms: 'beta',
      items: 'beta',
      entities: 'beta',
      outcomes: 'beta',
    });
  });

  it('should set overall selection to null when manual selections are mixed', () => {
    component.ngOnInit();
    component.manualSelections = {
      rooms: 'alpha',
      items: 'beta',
      entities: 'alpha',
      outcomes: 'beta',
    };
    component.onManualSelectionChange();
    expect(component.overallSelection).toBeNull();
  });

  it('should set default overall selection when switching to manual mode', () => {
    component.ngOnInit();
    component.manualSelections = {
      rooms: null,
      items: null,
      entities: null,
      outcomes: null,
    };
    component.setGenerationMode('manual');
    expect(component.overallSelection).toBe('alpha');
  });

  describe('Mode Switching and State Persistence', () => {
    beforeEach(() => {
      // ngOnInit is needed to populate archetypes
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should pre-fill manual selections when switching from a simple deck', () => {
      const simpleDeck = {
        archetypeName: 'Alpha',
        cards: [{ id: 'R01', count: 1 }],
      };
      component.generatedDeck = simpleDeck;

      component.setGenerationMode('manual');

      expect(component.manualSelections).toEqual({
        rooms: 'alpha',
        items: 'alpha',
        entities: 'alpha',
        outcomes: 'alpha',
      });
      expect(component.overallSelection).toBe('alpha');
      expect(component.generatedDeck).toBeTruthy();
    });

    it('should pre-fill manual selections when switching from a mixed deck', () => {
      const mixedDeck = {
        archetypeNames: {
          rooms: 'Alpha',
          items: 'Beta',
          entities: 'Alpha',
          outcomes: 'Beta',
        },
        cards: [
          { id: 'R01', count: 1 },
          { id: 'I01', count: 1 },
        ],
      };
      component.generatedDeck = mixedDeck;

      component.setGenerationMode('manual');

      expect(component.manualSelections).toEqual({
        rooms: 'alpha',
        items: 'beta',
        entities: 'alpha',
        outcomes: 'beta',
      });
      expect(component.overallSelection).toBeNull();
      expect(component.generatedDeck).toBeTruthy();
    });

    it('should make a manually modified deck "sticky" when switching modes', () => {
      // 1. Start with a simple deck
      const simpleDeck = {
        archetypeName: 'Alpha',
        cards: [{ id: 'R01', count: 1 }],
      };
      randomizerService.generateSimpleDeck.and.returnValue(simpleDeck);
      component.generate(); // isManualDeck is now false

      // 2. Switch to manual and modify
      component.setGenerationMode('manual');
      component.manualSelections.items = 'beta';
      component.onManualSelectionChange(); // isManualDeck is now true

      const manualDeck = component.generatedDeck;
      expect(manualDeck).toBeTruthy();
      expect((manualDeck as any).archetypeNames).toBeDefined(); // It's a mixed deck

      // 3. Switch to simple mode - deck should be sticky
      component.setGenerationMode('simple');
      expect(component.generatedDeck).toBe(manualDeck);

      // 4. Switch to mixed mode - deck should still be sticky
      component.setGenerationMode('mixed');
      expect(component.generatedDeck).toBe(manualDeck);

      // 5. Generate a new deck - stickiness should be removed
      const newSimpleDeck = {
        archetypeName: 'Beta',
        cards: [{ id: 'I01', count: 1 }],
      };
      randomizerService.generateSimpleDeck.and.returnValue(newSimpleDeck);
      component.generationMode = 'simple'; // Set mode to match the mocked service
      component.generate();
      expect(component.generatedDeck).toBe(newSimpleDeck);
      expect(component.isManualDeck).toBe(false);
    });

    it('should create a simple deck type from manual when all selections are the same', () => {
      component.setGenerationMode('manual');
      component.manualSelections = {
        rooms: 'alpha',
        items: 'alpha',
        entities: 'alpha',
        outcomes: 'alpha',
      };

      component.onManualSelectionChange();

      expect(component.generatedDeck).toBeTruthy();
      expect((component.generatedDeck as any).archetypeName).toBe('Alpha');
      expect((component.generatedDeck as any).archetypeNames).toBeUndefined();
    });

    it('should create a mixed deck type from manual when selections are different', () => {
      component.setGenerationMode('manual');
      component.manualSelections = {
        rooms: 'alpha',
        items: 'beta',
        entities: 'alpha',
        outcomes: 'alpha',
      };

      component.onManualSelectionChange();

      expect(component.generatedDeck).toBeTruthy();
      expect((component.generatedDeck as any).archetypeNames).toBeDefined();
      expect((component.generatedDeck as any).archetypeName).toBeUndefined();
    });
  });
});

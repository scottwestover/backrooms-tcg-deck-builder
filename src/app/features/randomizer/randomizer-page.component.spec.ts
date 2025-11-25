import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { RandomizerPageComponent } from './randomizer-page.component';
import { RandomizerService } from '../../services/randomizer.service';
import { BackroomsCardStore } from '../../store/backrooms-card.store';
import { WebsiteStore } from '../../store/website.store';
import { DialogStore } from '../../store/dialog.store';
import { Meta, Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IDeckCard } from '../../../models';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { UrlSyncService } from '../../services/url-sync.service';

const authServiceMock = {
  userData: null,
  authChange: new Subject<boolean>(),
  get isLoggedIn() {
    return !!this.userData;
  },
  GoogleAuth: jasmine.createSpy('GoogleAuth'),
  AuthLogin: jasmine.createSpy('AuthLogin'),
  LogOut: jasmine.createSpy('LogOut'),
  createUserData: jasmine.createSpy('createUserData'),
  SetUserData: jasmine.createSpy('SetUserData'),
  loadSave: jasmine.createSpy('loadSave').and.returnValue(of(null)),
  userInLocalStorage: jasmine
    .createSpy('userInLocalStorage')
    .and.returnValue(false),
};

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
  let urlSyncService: jasmine.SpyObj<UrlSyncService>;

  const mockArchetypes = [
    {
      id: 1,
      name: 'Alpha',
      rooms: [{ id: 'R01', count: 1 }],
      items: [],
      entities: [],
      outcomes: [],
    },
    {
      id: 2,
      name: 'Beta',
      rooms: [],
      items: [{ id: 'I01', count: 1 }],
      entities: [],
      outcomes: [],
    },
  ];

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
      'generateDeck',
      'isMixedDeck',
      'findArchetypeKeyByName',
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
    const urlSyncServiceSpy = jasmine.createSpyObj('UrlSyncService', [
      'getQueryParams',
      'updateUrlWithSelections',
    ]);

    await TestBed.configureTestingModule({
      imports: [RandomizerPageComponent, ToastrModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RandomizerService, useValue: randomizerServiceSpy },
        { provide: BackroomsCardStore, useValue: cardStoreSpy },
        { provide: WebsiteStore, useValue: websiteStoreSpy },
        { provide: DialogStore, useValue: dialogStoreSpy },
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj('MessageService', ['add']),
        },
        { provide: UrlSyncService, useValue: urlSyncServiceSpy },
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
    urlSyncService = TestBed.inject(
      UrlSyncService,
    ) as jasmine.SpyObj<UrlSyncService>;

    urlSyncService.getQueryParams.and.returnValue(of({}));
    randomizerService.getArchetypes.and.returnValue(of(mockArchetypes));
    (cardStore.cardsMap as jasmine.Spy).and.returnValue(mockCardsMap);

    // Mock generateDeck for any manual generation triggered by default
    const dummyDeck = { cards: [] };
    randomizerService.generateDeck.and.returnValue(dummyDeck as any);

    fixture.detectChanges(); // ngOnInit is called here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly on ngOnInit without query params', () => {
    expect(title.setTitle).toHaveBeenCalledWith(
      'Backrooms TCG - Deck Randomizer',
    );
    expect(meta.addTags).toHaveBeenCalled();
    expect(cardStore.updateCards).toHaveBeenCalled();
    expect(randomizerService.getArchetypes).toHaveBeenCalled();
    expect(component.archetypes).toEqual(mockArchetypes);
    expect(component.archetypeKeys).toEqual(['1', '2']);
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
    randomizerService.generateDeck.and.returnValue(simpleDeck as any);
    randomizerService.isMixedDeck.and.returnValue(false);
    randomizerService.findArchetypeKeyByName.and.returnValue('1');

    component.generationMode = 'simple';
    component.generate();

    expect(randomizerService.generateDeck).toHaveBeenCalledWith(
      'simple',
      mockArchetypes,
    );
    expect(component.generatedDeck).toEqual(simpleDeck as any);
    expect(component.lastRandomDeck).toEqual(simpleDeck as any);
  });

  it('should generate a mixed deck', () => {
    const mixedDeck = {
      archetypeNames: {
        rooms: 'Alpha',
        items: 'Beta',
        entities: 'Alpha',
        outcomes: 'Beta',
      },
      cards: [{ id: 'R01', count: 1 }],
    };
    randomizerService.generateDeck.and.returnValue(mixedDeck as any);
    randomizerService.isMixedDeck.and.returnValue(true);
    randomizerService.findArchetypeKeyByName.and.callFake((name: string) =>
      name === 'Alpha' ? '1' : '2',
    );

    component.generationMode = 'mixed';
    component.generate();

    expect(randomizerService.generateDeck).toHaveBeenCalledWith(
      'mixed',
      mockArchetypes,
    );
    expect(component.generatedDeck).toEqual(mixedDeck as any);
  });

  it('should handle manual selection change', () => {
    const manualDeck = {
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
    randomizerService.generateDeck.and.returnValue(manualDeck as any);

    component.manualSelections = {
      rooms: '1',
      items: '2',
      entities: '1',
      outcomes: '2',
    };
    component.onManualSelectionChange();

    expect(randomizerService.generateDeck).toHaveBeenCalledWith(
      'manual',
      mockArchetypes,
      component.manualSelections,
    );
    expect(component.generatedDeck).toBeTruthy();
    expect(component.generatedDeck?.cards.length).toBe(2);
  });

  it('should update deck views when a deck is generated', () => {
    const simpleDeck = {
      archetypeName: 'Alpha',
      cards: [{ id: 'R01', count: 2 }],
    };
    randomizerService.generateDeck.and.returnValue(simpleDeck as any);
    randomizerService.isMixedDeck.and.returnValue(false);
    randomizerService.findArchetypeKeyByName.and.returnValue('1');

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
    } as any;
    component.addToDeckbuilder();
    expect(websiteStore.updateDeck).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(jasmine.any(Array));
  });

  it('should open export deck dialog', () => {
    component.generatedDeck = {
      archetypeName: 'Alpha',
      cards: [{ id: 'R01', count: 1 }],
    } as any;
    component.openExportDeckDialog();
    expect(dialogStore.updateExportDeckDialog).toHaveBeenCalled();
  });

  it('should update manual selections when overall selection changes', () => {
    component.onOverallSelectionChange('2');
    expect(component.overallSelection).toBe('2');
    expect(component.manualSelections).toEqual({
      rooms: '2',
      items: '2',
      entities: '2',
      outcomes: '2',
    });
  });

  it('should set overall selection to null when manual selections are mixed', () => {
    component.manualSelections = {
      rooms: '1',
      items: '2',
      entities: '1',
      outcomes: '2',
    };
    component.onManualSelectionChange();
    expect(component.overallSelection).toBeNull();
  });

  it('should set default overall selection when switching to manual mode with no prior selections', () => {
    component.generatedDeck = null;
    component.manualSelections = {
      rooms: null,
      items: null,
      entities: null,
      outcomes: null,
    };
    component.setGenerationMode('manual');
    expect(component.overallSelection).toBe('1');
  });

  describe('Mode Switching and State Persistence', () => {
    it('should pre-fill manual selections when switching from a simple deck', () => {
      const simpleDeck = {
        archetypeName: 'Alpha',
        cards: [{ id: 'R01', count: 1 }],
      };
      component.generatedDeck = simpleDeck as any;
      randomizerService.isMixedDeck.and.returnValue(false);
      randomizerService.findArchetypeKeyByName.and.returnValue('1');
      randomizerService.generateDeck.and.returnValue(simpleDeck as any);

      component.setGenerationMode('manual');

      expect(component.manualSelections).toEqual({
        rooms: '1',
        items: '1',
        entities: '1',
        outcomes: '1',
      });
      expect(component.overallSelection).toBe('1');
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
      component.generatedDeck = mixedDeck as any;
      randomizerService.isMixedDeck.and.returnValue(true);
      randomizerService.findArchetypeKeyByName.and.callFake((name: string) =>
        name === 'Alpha' ? '1' : '2',
      );
      randomizerService.generateDeck.and.returnValue(mixedDeck as any);

      component.setGenerationMode('manual');

      expect(component.manualSelections).toEqual({
        rooms: '1',
        items: '2',
        entities: '1',
        outcomes: '2',
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
      randomizerService.generateDeck.and.returnValue(simpleDeck as any);
      randomizerService.isMixedDeck.and.returnValue(false);
      randomizerService.findArchetypeKeyByName.and.returnValue('1');
      component.generationMode = 'simple';
      component.generate(); // isManualDeck is now false

      // 2. Switch to manual and modify
      const manualDeck = {
        archetypeNames: { rooms: 'Alpha', items: 'Beta' },
        cards: [],
      };
      randomizerService.generateDeck.and.returnValue(manualDeck as any);
      component.setGenerationMode('manual');
      component.manualSelections.items = '2';
      component.onManualSelectionChange(); // isManualDeck is now true
      const generatedManualDeck = component.generatedDeck;
      expect(generatedManualDeck).toBe(manualDeck as any);

      // 3. Switch to simple mode - deck should be sticky
      component.setGenerationMode('simple');
      expect(component.generatedDeck).toBe(generatedManualDeck);

      // 4. Switch to mixed mode - deck should still be sticky
      component.setGenerationMode('mixed');
      expect(component.generatedDeck).toBe(generatedManualDeck);

      // 5. Generate a new deck - stickiness should be removed
      const newSimpleDeck = {
        archetypeName: 'Beta',
        cards: [{ id: 'I01', count: 1 }],
      };
      randomizerService.generateDeck.and.returnValue(newSimpleDeck as any);
      randomizerService.isMixedDeck.and.returnValue(false);
      randomizerService.findArchetypeKeyByName.and.returnValue('2');
      component.generationMode = 'simple';
      component.generate();
      expect(component.generatedDeck).toBe(newSimpleDeck as any);
      expect(component.isManualDeck).toBe(false);
    });

    it('should create a simple deck type from manual when all selections are the same', () => {
      const simpleDeck = { archetypeName: 'Alpha', cards: [] };
      randomizerService.generateDeck.and.returnValue(simpleDeck as any);

      component.setGenerationMode('manual');
      component.manualSelections = {
        rooms: '1',
        items: '1',
        entities: '1',
        outcomes: '1',
      };
      component.onManualSelectionChange();

      expect(component.generatedDeck).toBeTruthy();
      expect((component.generatedDeck as any).archetypeName).toBe('Alpha');
      expect((component.generatedDeck as any).archetypeNames).toBeUndefined();
    });

    it('should create a mixed deck type from manual when selections are different', () => {
      const mixedDeck = {
        archetypeNames: { rooms: 'Alpha', items: 'Beta' },
        cards: [],
      };
      randomizerService.generateDeck.and.returnValue(mixedDeck as any);

      component.setGenerationMode('manual');
      component.manualSelections = {
        rooms: '1',
        items: '2',
        entities: '1',
        outcomes: '1',
      };
      component.onManualSelectionChange();

      expect(component.generatedDeck).toBeTruthy();
      expect((component.generatedDeck as any).archetypeNames).toBeDefined();
      expect((component.generatedDeck as any).archetypeName).toBeUndefined();
    });
  });

  describe('copyShareLink', () => {
    beforeEach(() => {
      // Mock the router.url property
      Object.defineProperty(router, 'url', {
        value: '/randomizer?rooms=1&items=2',
        writable: true,
      });
    });

    it('should copy the current URL to clipboard and show success message', fakeAsync(() => {
      const messageServiceSpy = TestBed.inject(
        MessageService,
      ) as jasmine.SpyObj<MessageService>;
      spyOn(navigator.clipboard, 'writeText').and.returnValue(
        Promise.resolve(),
      );

      component.copyShareLink();
      tick();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        window.location.origin + '/randomizer?rooms=1&items=2',
      );
      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'success',
          summary: 'Link Copied!',
        }),
      );
    }));

    it('should show error message if copying to clipboard fails', fakeAsync(() => {
      const messageServiceSpy = TestBed.inject(
        MessageService,
      ) as jasmine.SpyObj<MessageService>;
      spyOn(navigator.clipboard, 'writeText').and.returnValue(
        Promise.reject('Failed to copy'),
      );

      component.copyShareLink();
      tick();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        window.location.origin + '/randomizer?rooms=1&items=2',
      );
      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          summary: 'Copy Failed!',
        }),
      );
    }));
  });
});

describe('RandomizerPageComponent - Initialization with Query Parameters', () => {
  let component: RandomizerPageComponent;
  let fixture: ComponentFixture<RandomizerPageComponent>;
  let randomizerService: jasmine.SpyObj<RandomizerService>;
  let urlSyncService: jasmine.SpyObj<UrlSyncService>;

  const mockArchetypes = [
    { id: 1, name: 'Alpha', rooms: [{ id: 'R01', count: 1 }] },
    { id: 2, name: 'Beta', items: [{ id: 'I01', count: 1 }] },
  ];

  const mockCardsMap = new Map<string, IDeckCard>([
    ['R01', { id: 'R01', name: { english: 'Room 1' } } as IDeckCard],
    ['I01', { id: 'I01', name: { english: 'Item 1' } } as IDeckCard],
  ]);

  beforeEach(async () => {
    const urlSyncServiceSpy = jasmine.createSpyObj('UrlSyncService', [
      'getQueryParams',
      'updateUrlWithSelections',
    ]);
    const randomizerServiceSpy = jasmine.createSpyObj('RandomizerService', [
      'getArchetypes',
      'generateDeck',
      'isMixedDeck',
      'findArchetypeKeyByName',
    ]);
    const cardStoreSpy = jasmine.createSpyObj('BackroomsCardStore', [
      'updateCards',
      'cardsMap',
    ]);

    await TestBed.configureTestingModule({
      imports: [RandomizerPageComponent, ToastrModule.forRoot()],
      providers: [
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate', 'url']),
        },
        { provide: UrlSyncService, useValue: urlSyncServiceSpy },
        { provide: RandomizerService, useValue: randomizerServiceSpy },
        { provide: BackroomsCardStore, useValue: cardStoreSpy },
        {
          provide: WebsiteStore,
          useValue: jasmine.createSpyObj('WebsiteStore', ['updateDeck']),
        },
        {
          provide: DialogStore,
          useValue: jasmine.createSpyObj('DialogStore', [
            'updateExportDeckDialog',
          ]),
        },
        { provide: Meta, useValue: jasmine.createSpyObj('Meta', ['addTags']) },
        {
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle']),
        },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj('MessageService', ['add']),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomizerPageComponent);
    component = fixture.componentInstance;

    randomizerService = TestBed.inject(
      RandomizerService,
    ) as jasmine.SpyObj<RandomizerService>;
    urlSyncService = TestBed.inject(
      UrlSyncService,
    ) as jasmine.SpyObj<UrlSyncService>;
    const cardStore = TestBed.inject(BackroomsCardStore) as jasmine.SpyObj<
      InstanceType<typeof BackroomsCardStore>
    >;

    urlSyncService.getQueryParams.and.returnValue(
      of({
        rooms: '1',
        items: '2',
        entities: '1',
        outcomes: '2',
      }),
    );
    randomizerService.getArchetypes.and.returnValue(of(mockArchetypes as any));
    (cardStore.cardsMap as jasmine.Spy).and.returnValue(mockCardsMap);

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
    randomizerService.generateDeck.and.returnValue(mixedDeck as any);

    fixture.detectChanges(); // ngOnInit
  });

  it('should set generationMode to "mixed" and generate a deck from query params', () => {
    expect(component.generationMode).toBe('mixed');
    expect(component.manualSelections).toEqual({
      rooms: '1',
      items: '2',
      entities: '1',
      outcomes: '2',
    });
    expect(component.generatedDeck).toBeTruthy();
    expect((component.generatedDeck as any).archetypeNames).toBeDefined();
    expect((component.generatedDeck as any).archetypeNames.items).toBe('Beta');
  });
});

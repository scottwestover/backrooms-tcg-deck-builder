import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { DeckbuilderPageComponent } from './deckbuilder-page.component';
import { BackroomsBackendService } from '../../services/backrooms-backend.service';
import { WebsiteStore } from '../../store/website.store';
import { AuthService } from '../../services/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IDeck, ISave, emptySave } from '../../../models';
import { ToastrModule } from 'ngx-toastr';

describe('DeckbuilderPageComponent', () => {
  let component: DeckbuilderPageComponent;
  let fixture: ComponentFixture<DeckbuilderPageComponent>;
  let backendService: jasmine.SpyObj<BackroomsBackendService>;
  let websiteStore: jasmine.SpyObj<InstanceType<typeof WebsiteStore>>;
  let authService: jasmine.SpyObj<AuthService>;
  let routeParams: BehaviorSubject<any>;

  const mockDeckId = 'deck123';
  const mockUserId = 'user123';

  const mockDeck: IDeck = {
    id: mockDeckId,
    title: 'Test Deck',
    cards: [],
    userId: mockUserId,
    description: '',
    docId: '',
    imageCardId: '',
    user: '',
    date: '',
  };

  const mockSave: ISave = {
    ...emptySave,
    uid: mockUserId,
    decks: [mockDeck],
  };

  beforeEach(async () => {
    routeParams = new BehaviorSubject({});
    const backendServiceSpy = jasmine.createSpyObj('BackroomsBackendService', [
      'getSave',
      'getDeck',
    ]);
    const websiteStoreSpy = jasmine.createSpyObj('WebsiteStore', [
      'deck',
      'updateDeck',
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      userData: null,
    });

    await TestBed.configureTestingModule({
      imports: [DeckbuilderPageComponent, ToastrModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: routeParams.asObservable(),
          },
        },
        { provide: BackroomsBackendService, useValue: backendServiceSpy },
        { provide: WebsiteStore, useValue: websiteStoreSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Meta, useValue: jasmine.createSpyObj('Meta', ['addTags']) },
        {
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle']),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DeckbuilderPageComponent);
    component = fixture.componentInstance;
    backendService = TestBed.inject(
      BackroomsBackendService,
    ) as jasmine.SpyObj<BackroomsBackendService>;
    websiteStore = TestBed.inject(WebsiteStore) as jasmine.SpyObj<
      InstanceType<typeof WebsiteStore>
    >;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkUrl$ observable', () => {
    it('should do nothing if no relevant params are present', fakeAsync(() => {
      routeParams.next({});
      component.checkUrl$.subscribe();
      tick();

      expect(backendService.getSave).not.toHaveBeenCalled();
      expect(backendService.getDeck).not.toHaveBeenCalled();
      expect(websiteStore.updateDeck).not.toHaveBeenCalled();
    }));

    it('should load from getSave when userId and deckId are in params', fakeAsync(() => {
      backendService.getSave.and.returnValue(of(mockSave));
      routeParams.next({ userId: mockUserId, deckId: mockDeckId });

      component.checkUrl$.subscribe();
      tick();

      expect(backendService.getSave).toHaveBeenCalledWith(mockUserId);
      expect(websiteStore.updateDeck).toHaveBeenCalledWith(
        jasmine.objectContaining({ title: mockDeck.title }),
      );
    }));

    it('should generate a new ID if the user is different (from getSave)', fakeAsync(() => {
      backendService.getSave.and.returnValue(of(mockSave));
      Object.defineProperty(authService, 'userData', {
        value: { uid: 'differentUser' },
        configurable: true,
      });
      routeParams.next({ userId: mockUserId, deckId: mockDeckId });

      component.checkUrl$.subscribe();
      tick();

      const updatedDeck = websiteStore.updateDeck.calls.argsFor(0)[0];
      expect(updatedDeck.id).not.toBe(mockDeckId);
    }));

    it('should load from local store if deck ID matches', fakeAsync(() => {
      websiteStore.deck.and.returnValue(mockDeck);
      routeParams.next({ id: mockDeckId });

      component.checkUrl$.subscribe();
      tick();

      expect(websiteStore.deck).toHaveBeenCalled();
      expect(backendService.getDeck).not.toHaveBeenCalled();
      expect(websiteStore.updateDeck).toHaveBeenCalledWith(
        jasmine.objectContaining({ title: mockDeck.title }),
      );
    }));

    it('should load from backend if not in local store', fakeAsync(() => {
      websiteStore.deck.and.returnValue({ id: 'another-deck' } as IDeck);
      backendService.getDeck.and.returnValue(of(mockDeck));
      routeParams.next({ id: mockDeckId });

      component.checkUrl$.subscribe();
      tick();

      expect(websiteStore.deck).toHaveBeenCalled();
      expect(backendService.getDeck).toHaveBeenCalledWith(mockDeckId);
      expect(websiteStore.updateDeck).toHaveBeenCalledWith(
        jasmine.objectContaining({ title: mockDeck.title }),
      );
    }));

    it('should not update deck if not found anywhere', fakeAsync(() => {
      websiteStore.deck.and.returnValue({ id: 'another-deck' } as IDeck);
      backendService.getDeck.and.returnValue(of(undefined as any));
      routeParams.next({ id: 'non-existent-deck' });

      component.checkUrl$.subscribe();
      tick();

      expect(websiteStore.deck).toHaveBeenCalled();
      expect(backendService.getDeck).toHaveBeenCalledWith('non-existent-deck');
      expect(websiteStore.updateDeck).not.toHaveBeenCalled();
    }));
  });
});

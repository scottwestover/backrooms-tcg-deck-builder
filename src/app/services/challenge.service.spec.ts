import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ChallengeService } from './challenge.service';
import { IChallenge, IUser } from '../../models';
import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthService>;
  let firestoreServiceSpy: jasmine.SpyObj<FirestoreService>;

  const mockLocalChallenges: IChallenge[] = [
    {
      id: 'LOCAL-1',
      name: 'Local C1',
      difficulty: 1,
      description: '',
      creator: 'Official',
      type: 'GENERIC',
    },
  ];

  const mockFirestoreChallenges: IChallenge[] = [
    {
      id: 'FS-1',
      name: 'Firestore C1',
      difficulty: 3,
      description: '',
      creator: 'UserA',
      type: 'CUSTOM',
    },
  ];

  const mockUser: IUser = {
    uid: 'test-uid',
    displayName: 'Tester',
    photoURL: '',
    save: {} as any,
  };

  beforeEach(() => {
    // Create a spy object for our new FirestoreService
    firestoreServiceSpy = jasmine.createSpyObj('FirestoreService', [
      'getDocs',
      'addDoc',
    ]);

    authServiceMock = {
      get isLoggedIn() {
        return true;
      },
      userData: mockUser,
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ChallengeService,
        { provide: FirestoreService, useValue: firestoreServiceSpy },
        { provide: AuthService, useValue: authServiceMock },
      ],
    });
    service = TestBed.inject(ChallengeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChallenges', () => {
    it('should fetch and merge challenges from JSON and Firestore', (done) => {
      const firestoreDocs = mockFirestoreChallenges.map((c) => ({
        id: c.id,
        data: () => ({ ...c }),
      }));
      const querySnapshot = {
        forEach: (callback: (doc: any) => void) =>
          firestoreDocs.forEach(callback),
      };
      firestoreServiceSpy.getDocs.and.returnValue(
        Promise.resolve(querySnapshot as any),
      );

      service.getChallenges().subscribe((challenges) => {
        expect(challenges.length).toBe(2);
        expect(challenges).toEqual([
          ...mockLocalChallenges,
          ...mockFirestoreChallenges,
        ]);
        expect(firestoreServiceSpy.getDocs).toHaveBeenCalledWith('challenges');
        done();
      });

      const req = httpMock.expectOne('assets/randomizer/challenges.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockLocalChallenges);
    });
  });

  describe('createChallenge', () => {
    it('should call firestoreService.addDoc with correct data', (done) => {
      firestoreServiceSpy.addDoc.and.returnValue(
        Promise.resolve({ id: 'new-id' } as any),
      );

      const newChallengeData = {
        name: 'New One',
        description: 'Desc',
        difficulty: 4,
        type: 'NEW',
      };
      const expectedDocData = {
        ...newChallengeData,
        creator: mockUser.displayName,
        userId: mockUser.uid,
      };

      service.createChallenge(newChallengeData).subscribe(() => {
        expect(firestoreServiceSpy.addDoc).toHaveBeenCalledWith(
          'challenges',
          expectedDocData,
        );
        done();
      });
    });
  });

  describe('generateChallenges', () => {
    const allMockChallenges: IChallenge[] = [
      ...mockLocalChallenges,
      ...mockFirestoreChallenges,
      {
        id: '3',
        name: 'C3',
        difficulty: 2,
        description: '',
        creator: '',
        type: '',
      },
      {
        id: '4',
        name: 'C4',
        difficulty: 4,
        description: '',
        creator: '',
        type: '',
      },
    ];

    it('should generate 4 random challenges for "random" mode', () => {
      const result = service.generateChallenges('random', allMockChallenges);
      expect(result.length).toBe(4);
    });

    it('should generate one challenge per difficulty level for "all-levels" mode', () => {
      const result = service.generateChallenges(
        'all-levels',
        allMockChallenges,
      );
      expect(result.length).toBe(4);
      const difficulties = result.map((c) => c.difficulty);
      expect(difficulties).toContain(1);
      expect(difficulties).toContain(2);
      expect(difficulties).toContain(3);
      expect(difficulties).toContain(4);
    });

    it('should have unique challenges in the result', () => {
      const randomResult = service.generateChallenges(
        'random',
        allMockChallenges,
      );
      const randomIds = new Set(randomResult.map((c) => c.id));
      expect(randomIds.size).toBe(randomResult.length);

      const allLevelsResult = service.generateChallenges(
        'all-levels',
        allMockChallenges,
      );
      const allLevelsIds = new Set(allLevelsResult.map((c) => c.id));
      expect(allLevelsIds.size).toBe(allLevelsResult.length);
    });
  });
});

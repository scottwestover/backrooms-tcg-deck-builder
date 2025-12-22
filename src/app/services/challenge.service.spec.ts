import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ChallengeService } from './challenge.service';
import { IChallenge, IUser } from '../../models';
import { AuthService } from './auth.service';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthService>;

  const mockChallenges: IChallenge[] = [
    {
      id: '1',
      name: 'C1',
      difficulty: 1,
      description: '',
      creator: '',
      type: '',
    },
    {
      id: '2',
      name: 'C2',
      difficulty: 1,
      description: '',
      creator: '',
      type: '',
    },
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
      difficulty: 3,
      description: '',
      creator: '',
      type: '',
    },
    {
      id: '5',
      name: 'C5',
      difficulty: 4,
      description: '',
      creator: '',
      type: '',
    },
    {
      id: '6',
      name: 'C6',
      difficulty: 4,
      description: '',
      creator: '',
      type: '',
    },
  ];

  const mockUser: IUser = {
    uid: 'test-uid',
    displayName: 'Tester',
    photoURL: '',
    save: {} as any,
  };

  beforeEach(() => {
    authServiceMock = {
      get isLoggedIn() {
        return true;
      },
      userData: mockUser,
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        provideFirebaseApp(() => initializeApp({ projectId: 'test-project' })),
        provideFirestore(() => getFirestore()),
      ],
      providers: [
        ChallengeService,
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

  it('should fetch challenges from JSON file', () => {
    const dummyChallenges = mockChallenges.slice(0, 2);
    service.getChallenges().subscribe((challenges) => {
      expect(challenges.length).toBe(2);
      expect(challenges).toEqual(dummyChallenges);
    });

    const req = httpMock.expectOne('assets/randomizer/challenges.json');
    expect(req.request.method).toBe('GET');
    req.flush(dummyChallenges);
  });

  describe('generateChallenges', () => {
    it('should generate 4 random challenges for "random" mode', () => {
      const result = service.generateChallenges('random', mockChallenges);
      expect(result.length).toBe(4);
    });

    it('should generate one challenge per difficulty level for "all-levels" mode', () => {
      const result = service.generateChallenges('all-levels', mockChallenges);
      expect(result.length).toBe(4);
      const difficulties = result.map((c) => c.difficulty);
      expect(difficulties).toContain(1);
      expect(difficulties).toContain(2);
      expect(difficulties).toContain(3);
      expect(difficulties).toContain(4);
    });

    it('should have unique challenges in the result', () => {
      const randomResult = service.generateChallenges('random', mockChallenges);
      const randomIds = randomResult.map((c) => c.id);
      const uniqueRandomIds = new Set(randomIds);
      expect(uniqueRandomIds.size).toBe(randomResult.length);

      const allLevelsResult = service.generateChallenges(
        'all-levels',
        mockChallenges,
      );
      const allLevelsIds = allLevelsResult.map((c) => c.id);
      const uniqueAllLevelsIds = new Set(allLevelsIds);
      expect(uniqueAllLevelsIds.size).toBe(allLevelsResult.length);
    });
  });
});

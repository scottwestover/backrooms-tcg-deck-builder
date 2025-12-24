import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject } from 'rxjs';
import { IChallenge } from '../../../models';
import { AuthService } from '../../services/auth.service';
import { ChallengeService } from '../../services/challenge.service';
import { UrlSyncService } from '../../services/url-sync.service';
import { DialogStore } from '../../store/dialog.store';
import { ChallengesPageComponent } from './challenges-page.component';
import { ToastrModule } from 'ngx-toastr';

describe('ChallengesPageComponent', () => {
  let component: ChallengesPageComponent;
  let fixture: ComponentFixture<ChallengesPageComponent>;
  let challengeService: jasmine.SpyObj<ChallengeService>;
  let urlSyncService: jasmine.SpyObj<UrlSyncService>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialogStore: jasmine.SpyObj<InstanceType<typeof DialogStore>>;
  let nativeElement: HTMLElement;

  const mockChallenges: IChallenge[] = [
    {
      id: '1',
      name: 'C1',
      difficulty: 1,
      description: 'd1',
      creator: 'c1',
      type: 'GENERIC',
      userId: 'uid-a',
    },
    {
      id: '5',
      name: 'C5',
      difficulty: 1,
      description: 'd5',
      creator: 'c5',
      type: 'GENERIC',
      userId: 'uid-a',
    },
    {
      id: '2',
      name: 'C2',
      difficulty: 2,
      description: 'd2',
      creator: 'c2',
      type: 'CAR_PARK',
      userId: 'uid-b',
    },
    {
      id: '3',
      name: 'C3',
      difficulty: 3,
      description: 'd3',
      creator: 'c3',
      type: 'LOBBY_LEVEL',
      userId: 'uid-c',
    },
    {
      id: '4',
      name: 'C4',
      difficulty: 4,
      description: 'd4',
      creator: 'c4',
      type: 'GENERIC',
      userId: 'uid-d',
    },
  ];

  beforeEach(async () => {
    challengeService = jasmine.createSpyObj(
      'ChallengeService',
      ['getChallenges', 'generateChallenges'],
      {
        refreshChallenges$: new Subject<IChallenge | undefined>(),
      },
    );
    urlSyncService = jasmine.createSpyObj('UrlSyncService', [
      'getQueryParams',
      'updateUrl',
    ]);
    authService = jasmine.createSpyObj('AuthService', [], {
      isLoggedIn: false,
      authChange: new Subject<boolean>(),
      userData: null,
    });
    dialogStore = jasmine.createSpyObj('DialogStore', [
      'updateCreateChallengeDialog',
      'updateMyChallengesDialog',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ChallengesPageComponent,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: ChallengeService, useValue: challengeService },
        { provide: UrlSyncService, useValue: urlSyncService },
        { provide: AuthService, useValue: authService },
        { provide: DialogStore, useValue: dialogStore },
        {
          provide: Title,
          useValue: jasmine.createSpyObj('Title', ['setTitle']),
        },
        { provide: Meta, useValue: jasmine.createSpyObj('Meta', ['addTags']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengesPageComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    // Default mock implementations
    urlSyncService.getQueryParams.and.returnValue(of({}));
    challengeService.getChallenges.and.returnValue(of(mockChallenges));
    challengeService.generateChallenges.and.returnValue(mockChallenges);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch challenges and types on init', () => {
    fixture.detectChanges(); // ngOnInit
    expect(challengeService.getChallenges).toHaveBeenCalled();
    expect(component.allChallenges).toEqual(mockChallenges);
    expect(component.availableTypes.length).toBe(3);
    expect(component.selectedTypes.length).toBe(3);
  });

  it('should initialize state from URL query params', () => {
    const urlParams = { c1: '1', c2: '3', types: 'GENERIC,LOBBY_LEVEL' };
    urlSyncService.getQueryParams.and.returnValue(of(urlParams));

    fixture.detectChanges(); // ngOnInit

    expect(component.generationMode).toBe('random');
    expect(component.selectedTypes).toEqual(['GENERIC', 'LOBBY_LEVEL']);
    expect(component.generatedChallenges.length).toBe(2);
    expect(component.generatedChallenges[0]?.id).toBe('1');
    expect(component.generatedChallenges[1]?.id).toBe('3');
  });

  it('should call generate and updateUrl when the button is clicked', () => {
    fixture.detectChanges();
    component.generationMode = 'all-levels';
    fixture.detectChanges();

    const generateButton = nativeElement.querySelector(
      'button.bg-yellow-500',
    ) as HTMLButtonElement;
    generateButton.click();

    expect(challengeService.generateChallenges).toHaveBeenCalledWith(
      'all-levels',
      jasmine.any(Array),
    );
    expect(urlSyncService.updateUrl).toHaveBeenCalled();
  });

  it('should update url when types change', () => {
    fixture.detectChanges();
    component.onTypeChange();
    expect(urlSyncService.updateUrl).toHaveBeenCalled();
  });

  it('should update url when a manual challenge is selected', () => {
    fixture.detectChanges();
    component.onManualChallengeChange(0, mockChallenges[0]);
    expect(component.manualChallengeSlots[0]).toBe(mockChallenges[0]);
    expect(urlSyncService.updateUrl).toHaveBeenCalled();
  });

  it('should re-roll a challenge and update url', () => {
    component.selectedTypes = ['GENERIC', 'CAR_PARK', 'LOBBY_LEVEL'];
    component.generatedChallenges = [
      mockChallenges[0], // id 1, diff 1
      mockChallenges[2], // id 2, diff 2
      mockChallenges[3], // id 3, diff 3
      mockChallenges[4], // id 4, diff 4
    ];
    fixture.detectChanges();

    component.rerollChallenge(mockChallenges[0], 0);

    expect(component.generatedChallenges[0].id).toBe('5');
    expect(urlSyncService.updateUrl).toHaveBeenCalled();
  });

  it('should sync manual slots when switching from random mode', () => {
    component.generationMode = 'random';
    component.generatedChallenges = [...mockChallenges];
    fixture.detectChanges();

    component.setGenerationMode('manual');
    expect(component.manualChallengeSlots[0]?.id).toBe(mockChallenges[0].id);
    expect(component.manualChallengeSlots[3]?.id).toBe(mockChallenges[3].id);
  });

  it('should sync generated challenges when switching from manual mode', () => {
    component.generationMode = 'manual';
    component.manualChallengeSlots = [...mockChallenges];
    fixture.detectChanges();

    component.setGenerationMode('random');
    expect(component.generatedChallenges[0]?.id).toBe(mockChallenges[0].id);
    expect(component.generatedChallenges[3]?.id).toBe(mockChallenges[3].id);
    expect(challengeService.generateChallenges).toHaveBeenCalled();
    expect(urlSyncService.updateUrl).toHaveBeenCalled();
  });
});

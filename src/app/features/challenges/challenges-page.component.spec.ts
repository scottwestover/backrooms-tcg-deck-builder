import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { IChallenge } from '../../../models';
import { ChallengeService } from '../../services/challenge.service';
import { ChallengesPageComponent } from './challenges-page.component';

describe('ChallengesPageComponent', () => {
  let component: ChallengesPageComponent;
  let fixture: ComponentFixture<ChallengesPageComponent>;
  let challengeService: jasmine.SpyObj<ChallengeService>;
  let nativeElement: HTMLElement;

  const mockChallenges: IChallenge[] = [
    {
      id: 1,
      name: 'C1',
      difficulty: 1,
      description: 'd1',
      creator: 'c1',
      type: 't1',
    },
    {
      id: 2,
      name: 'C2',
      difficulty: 2,
      description: 'd2',
      creator: 'c2',
      type: 't2',
    },
    {
      id: 3,
      name: 'C3',
      difficulty: 3,
      description: 'd3',
      creator: 'c3',
      type: 't3',
    },
    {
      id: 4,
      name: 'C4',
      difficulty: 4,
      description: 'd4',
      creator: 'c4',
      type: 't4',
    },
  ];

  beforeEach(async () => {
    const challengeServiceSpy = jasmine.createSpyObj('ChallengeService', [
      'getChallenges',
      'generateChallenges',
    ]);

    await TestBed.configureTestingModule({
      imports: [ChallengesPageComponent, NoopAnimationsModule],
      providers: [
        { provide: ChallengeService, useValue: challengeServiceSpy },
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
    challengeService = TestBed.inject(
      ChallengeService,
    ) as jasmine.SpyObj<ChallengeService>;

    challengeService.getChallenges.and.returnValue(of(mockChallenges));
    challengeService.generateChallenges.and.returnValue(mockChallenges);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch challenges on init', () => {
    fixture.detectChanges(); // ngOnInit
    expect(challengeService.getChallenges).toHaveBeenCalled();
    expect(component.allChallenges).toEqual(mockChallenges);
  });

  it('should not generate challenges on init', () => {
    fixture.detectChanges(); // ngOnInit
    expect(challengeService.generateChallenges).not.toHaveBeenCalled();
    expect(component.generatedChallenges.length).toBe(0);
  });

  it('should set generation mode and generate challenges', () => {
    fixture.detectChanges();

    component.setGenerationMode('random');

    expect(component.generationMode).toBe('random');
    expect(challengeService.generateChallenges).toHaveBeenCalledWith(
      'random',
      mockChallenges,
    );
    expect(component.generatedChallenges).toEqual(mockChallenges);
  });

  it('should switch to manual mode', () => {
    fixture.detectChanges();
    component.setGenerationMode('manual');
    fixture.detectChanges();

    expect(component.generationMode).toBe('manual');
    const selectorCards = nativeElement.querySelectorAll(
      'backrooms-challenge-selector-card',
    );
    expect(selectorCards.length).toBe(4);
  });

  it('should call generate when the button is clicked', () => {
    fixture.detectChanges();
    component.generationMode = 'all-levels';
    fixture.detectChanges();

    const generateButton = nativeElement.querySelector(
      'button.bg-yellow-500',
    ) as HTMLButtonElement;
    generateButton.click();

    expect(challengeService.generateChallenges).toHaveBeenCalledWith(
      'all-levels',
      mockChallenges,
    );
  });
});

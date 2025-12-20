import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IChallenge } from '../../../../models';
import { ChallengeSelectorCardComponent } from './challenge-selector-card.component';

describe('ChallengeSelectorCardComponent', () => {
  let component: ChallengeSelectorCardComponent;
  let fixture: ComponentFixture<ChallengeSelectorCardComponent>;
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
      difficulty: 1,
      description: 'd2',
      creator: 'c2',
      type: 't2',
    },
    {
      id: 3,
      name: 'C3',
      difficulty: 2,
      description: 'd3',
      creator: 'c3',
      type: 't3',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeSelectorCardComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeSelectorCardComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    component.allChallenges = mockChallenges;
    component.activeTypes = ['t1', 't2', 't3'];
    // Manually trigger ngOnChanges
    component.ngOnChanges({
      allChallenges: {
        currentValue: mockChallenges,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
      activeTypes: {
        currentValue: ['t1', 't2', 't3'],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the level dropdown with available levels', () => {
    const levelSelect = nativeElement.querySelector(
      'select[name="level-select"]',
    );
    const levelOptions = levelSelect!.querySelectorAll('option');
    // 'Any' + Level 1 + Level 2
    expect(levelOptions.length).toBe(3);
    expect(levelOptions[1].textContent).toContain('1');
    expect(levelOptions[2].textContent).toContain('2');
  });

  it('should filter the challenge dropdown when a level is selected', fakeAsync(() => {
    const challengeSelect = nativeElement.querySelector(
      'select[name="challenge-select"]',
    );

    // Initially, all challenges should be available
    let challengeOptions = challengeSelect!.querySelectorAll('option');
    // 'Select a challenge' + 3 challenges
    expect(challengeOptions.length).toBe(4);

    // Select Level 1 by calling the component method
    component.onLevelChange(1);
    tick();
    fixture.detectChanges();

    challengeOptions = challengeSelect!.querySelectorAll('option');
    // 'Select a challenge' + 2 challenges of level 1
    expect(challengeOptions.length).toBe(3);
    expect(challengeOptions[1].textContent).toContain('C1');
    expect(challengeOptions[2].textContent).toContain('C2');
  }));

  it('should emit challengeChange when a challenge is selected', () => {
    spyOn(component.challengeChange, 'emit');
    component.onChallengeChange(mockChallenges[0]);
    expect(component.challengeChange.emit).toHaveBeenCalledWith(
      mockChallenges[0],
    );
  });

  it('should display challenge details when a challenge is selected', () => {
    component.challenge = mockChallenges[0];
    fixture.detectChanges();

    const detailsDiv = nativeElement.querySelector('.border-t');
    expect(detailsDiv).toBeTruthy();
    expect(detailsDiv?.textContent).toContain('C1');
    expect(detailsDiv?.textContent).toContain('Lvl. 1');
    expect(detailsDiv?.textContent).toContain('d1');
  });
});

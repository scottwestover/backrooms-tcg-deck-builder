import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonModule } from 'primeng/button';
import { IChallenge } from '../../../../models';
import { ChallengeDisplayCardComponent } from './challenge-display-card.component';

describe('ChallengeDisplayCardComponent', () => {
  let component: ChallengeDisplayCardComponent;
  let fixture: ComponentFixture<ChallengeDisplayCardComponent>;
  let nativeElement: HTMLElement;

  const mockChallenge: IChallenge = {
    id: '1',
    name: 'Test Challenge',
    difficulty: 3,
    description: 'This is a test description.',
    creator: 'Tester',
    type: 'TESTING',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeDisplayCardComponent, ButtonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeDisplayCardComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything if challenge is null', () => {
    component.challenge = null;
    fixture.detectChanges();
    const cardElement = nativeElement.querySelector('.flex');
    expect(cardElement).toBeFalsy();
  });

  it('should display challenge details when a challenge is provided', () => {
    component.challenge = mockChallenge;
    fixture.detectChanges();

    const nameElement = nativeElement.querySelector('h3');
    const descriptionElement = nativeElement.querySelector('p');
    const levelElement = nativeElement.querySelector(
      'div.gap-2 span:first-child',
    );
    const typeElement = nativeElement.querySelector(
      'div.gap-2 span:last-child',
    );
    const creatorElement = nativeElement.querySelector('span.truncate');

    expect(nameElement?.textContent).toContain('Test Challenge');
    expect(levelElement?.textContent).toContain('Lvl. 3');
    expect(descriptionElement?.textContent).toContain(
      'This is a test description.',
    );
    expect(typeElement?.textContent).toContain('TESTING');
    expect(creatorElement?.textContent).toContain('by Tester');
  });

  it('should not display re-roll button if not rerollable', () => {
    component.challenge = mockChallenge;
    component.rerollable = false;
    fixture.detectChanges();
    const rerollButton = nativeElement.querySelector('button');
    expect(rerollButton).toBeFalsy();
  });

  it('should display re-roll button when rerollable is true', () => {
    component.challenge = mockChallenge;
    component.rerollable = true;
    fixture.detectChanges();
    const rerollButton = nativeElement.querySelector('button');
    expect(rerollButton).toBeTruthy();
    expect(rerollButton?.querySelector('.pi-sync')).toBeTruthy();
  });

  it('should emit reroll event on button click', () => {
    spyOn(component.reroll, 'emit');
    component.challenge = mockChallenge;
    component.rerollable = true;
    fixture.detectChanges();

    const rerollButton = nativeElement.querySelector(
      'button',
    ) as HTMLButtonElement;
    rerollButton.click();

    expect(component.reroll.emit).toHaveBeenCalled();
  });
});

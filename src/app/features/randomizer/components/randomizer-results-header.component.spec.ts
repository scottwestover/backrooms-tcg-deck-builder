import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ICountCard } from '../../../../models';
import {
  GeneratedDeck,
  GeneratedMixedDeck,
} from '../../../services/randomizer.service';
import { RandomizerResultsHeaderComponent } from './randomizer-results-header.component';

describe('RandomizerResultsHeaderComponent', () => {
  let component: RandomizerResultsHeaderComponent;
  let fixture: ComponentFixture<RandomizerResultsHeaderComponent>;
  let nativeElement: HTMLElement;

  const mockSimpleDeck: GeneratedDeck & { cards: ICountCard[] } = {
    archetypeName: 'The Hospital',
    cards: [],
  };

  const mockMixedDeck: GeneratedMixedDeck & { cards: ICountCard[] } = {
    archetypeNames: {
      rooms: 'Office',
      items: 'Party',
      entities: 'Followers',
      outcomes: 'Windows',
    },
    cards: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomizerResultsHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RandomizerResultsHeaderComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything if deck is null', () => {
    component.deck = null;
    fixture.detectChanges();
    const headerElement = nativeElement.querySelector('.bg-gray-800');
    expect(headerElement).toBeFalsy();
  });

  it('should display the simple deck name when a simple deck is provided', () => {
    component.deck = mockSimpleDeck;
    fixture.detectChanges();

    const titleElement = nativeElement.querySelector('h2');
    expect(titleElement?.textContent?.trim()).toBe('The Hospital');

    const mixedDeckGrid = nativeElement.querySelector('.grid');
    expect(mixedDeckGrid).toBeFalsy();
  });

  it('should display the mixed deck details when a mixed deck is provided', () => {
    component.deck = mockMixedDeck;
    fixture.detectChanges();

    const titleElement = nativeElement.querySelector('h2');
    expect(titleElement?.textContent?.trim()).toBe('Mixed Deck');

    const archetypeElements = nativeElement.querySelectorAll('.grid p');
    expect(archetypeElements.length).toBe(4);
    expect(archetypeElements[0].textContent).toContain('Rooms:');
    expect(archetypeElements[0].textContent).toContain('Office');
    expect(archetypeElements[1].textContent).toContain('Items:');
    expect(archetypeElements[1].textContent).toContain('Party');
    expect(archetypeElements[2].textContent).toContain('Entities:');
    expect(archetypeElements[2].textContent).toContain('Followers');
    expect(archetypeElements[3].textContent).toContain('Outcomes:');
    expect(archetypeElements[3].textContent).toContain('Windows');
  });
});

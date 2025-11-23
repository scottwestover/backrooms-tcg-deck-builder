import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardListTableComponent } from './card-list-table.component';

interface DeckAsList {
  id: string;
  name: string;
  count: number;
}

describe('CardListTableComponent', () => {
  let component: CardListTableComponent;
  let fixture: ComponentFixture<CardListTableComponent>;
  let nativeElement: HTMLElement;

  const mockDeckAsList: {
    rooms: DeckAsList[];
    items: DeckAsList[];
    entities: DeckAsList[];
    outcomes: DeckAsList[];
  } = {
    rooms: [
      { id: 'R01', name: 'Room 1', count: 2 },
      { id: 'R02', name: 'Room 2', count: 1 },
    ],
    items: [{ id: 'I01', name: 'Item 1', count: 3 }],
    entities: [],
    outcomes: [{ id: 'O01', name: 'Outcome 1', count: 4 }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardListTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardListTableComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything if deckAsList input is null', () => {
    component.deckAsList = null;
    fixture.detectChanges();
    const container = nativeElement.querySelector('.space-y-4');
    expect(container).toBeFalsy();
  });

  it('should display tables for categories with cards', () => {
    component.deckAsList = mockDeckAsList;
    fixture.detectChanges();

    const headers = nativeElement.querySelectorAll('h3');
    const headerTexts = Array.from(headers).map((h) => h.textContent);
    expect(headerTexts).toContain('Rooms');
    expect(headerTexts).toContain('Items');

    const tables = nativeElement.querySelectorAll('table');
    const roomRows = tables[0].querySelectorAll('tbody tr');
    expect(roomRows.length).toBe(2);

    const itemRows = tables[1].querySelectorAll('tbody tr');
    expect(itemRows.length).toBe(1);
  });

  it('should not display tables for categories with no cards', () => {
    component.deckAsList = mockDeckAsList;
    fixture.detectChanges();

    const allHeaders = nativeElement.querySelectorAll('h3');
    const headerTexts = Array.from(allHeaders).map((h) => h.textContent);

    expect(headerTexts).not.toContain('Entities');
  });

  it('should display the correct data in table cells', () => {
    component.deckAsList = mockDeckAsList;
    fixture.detectChanges();

    const firstRoomRow = nativeElement.querySelector('tbody tr');
    const cells = firstRoomRow?.querySelectorAll('td');

    expect(cells).toBeTruthy();
    expect(cells?.length).toBe(3);
    expect(cells?.[0].textContent).toBe('R01');
    expect(cells?.[1].textContent).toBe('Room 1');
    expect(cells?.[2].textContent).toBe('2');
  });
});

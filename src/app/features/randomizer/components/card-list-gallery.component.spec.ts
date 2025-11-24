import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IDeckCard } from '../../../../models';
import { CardImageComponent } from '../../shared/card-image.component';
import { CardListGalleryComponent } from './card-list-gallery.component';

// Mock CardImageComponent to avoid its dependencies
import { Component, Input } from '@angular/core';

@Component({
  selector: 'backrooms-card-image',
  template: '<div></div>',
  standalone: true,
})
class MockCardImageComponent {
  @Input() card: any;
}

describe('CardListGalleryComponent', () => {
  let component: CardListGalleryComponent;
  let fixture: ComponentFixture<CardListGalleryComponent>;
  let nativeElement: HTMLElement;

  const mockCards: {
    rooms: IDeckCard[];
    items: IDeckCard[];
    entities: IDeckCard[];
    outcomes: IDeckCard[];
  } = {
    rooms: [
      { id: 'R01', name: { english: 'Room 1' }, count: 1 },
      { id: 'R02', name: { english: 'Room 2' }, count: 2 },
    ] as IDeckCard[],
    items: [
      { id: 'I01', name: { english: 'Item 1' }, count: 3 },
    ] as IDeckCard[],
    entities: [] as IDeckCard[],
    outcomes: [
      { id: 'O01', name: { english: 'Outcome 1' }, count: 4 },
    ] as IDeckCard[],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardListGalleryComponent],
    })
      .overrideComponent(CardListGalleryComponent, {
        remove: { imports: [CardImageComponent] },
        add: { imports: [MockCardImageComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CardListGalleryComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything if cards input is null', () => {
    component.cards = null;
    fixture.detectChanges();
    const container = nativeElement.querySelector('.space-y-4');
    expect(container).toBeFalsy();
  });

  it('should display titles and cards for categories with cards', () => {
    component.cards = mockCards;
    fixture.detectChanges();

    const headers = nativeElement.querySelectorAll('h3');
    const headerTexts = Array.from(headers).map((h) => h.textContent);
    expect(headerTexts).toContain('Rooms');
    expect(headerTexts).toContain('Items');

    const roomImages = fixture.debugElement.queryAll(By.css('.card-grid'))[0];
    expect(roomImages.children.length).toBe(2);

    const itemImages = fixture.debugElement.queryAll(By.css('.card-grid'))[1];
    expect(itemImages.children.length).toBe(1);
  });

  it('should not display titles for categories with no cards', () => {
    component.cards = mockCards;
    fixture.detectChanges();

    const allHeaders = nativeElement.querySelectorAll('h3');
    const headerTexts = Array.from(allHeaders).map((h) => h.textContent);

    expect(headerTexts).not.toContain('Entities');
  });

  it('should display the correct quantity for each card', () => {
    component.cards = mockCards;
    fixture.detectChanges();

    const cardItems = nativeElement.querySelectorAll('.card-item');
    const firstRoomQuantity = cardItems[0].querySelector('span span');
    const secondRoomQuantity = cardItems[1].querySelector('span span');
    const firstItemQuantity = cardItems[2].querySelector('span span');

    expect(firstRoomQuantity?.parentElement?.textContent).toContain('x1');
    expect(secondRoomQuantity?.parentElement?.textContent).toContain('x2');
    expect(firstItemQuantity?.parentElement?.textContent).toContain('x3');
  });
});

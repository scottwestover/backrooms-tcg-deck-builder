import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IDeck, IDeckCard } from '../../../../models';
import {
  getCountFromDeckCards,
  mapToDeckCards,
} from '../../../functions/backrooms-card.functions';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';
import { SingleContainerComponent } from '../single-container.component';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'backrooms-ddto-spread',
  template: `
    <div *ngIf="!container" class="no-gap grid h-full w-full grid-cols-4">
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(ddto[0], 'Entity')
        }">
        <span class="text-black-outline-xs">{{ ddto[0] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(ddto[1], 'Item')
        }">
        <span class="text-black-outline-xs">{{ ddto[1] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(ddto[2], 'Room')
        }">
        <span class="text-black-outline-xs">{{ ddto[2] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(ddto[3], 'Outcome')
        }">
        <span class="text-black-outline-xs">{{ ddto[3] }}</span>
      </div>

      <h3 class="h-1/2 text-center text-xs">Entity</h3>
      <h3 class="h-1/2 text-center text-xs">Item</h3>
      <h3 class="h-1/2 text-center text-xs">Room</h3>
      <h3 class="h-1/2 text-center text-xs">Outcome</h3>
    </div>

    <div *ngIf="container" class="flex w-full flex-row">
      <backrooms-single-container
        label="Entity"
        [value]="ddto[0]"
        percent="10"
        class="w-12"></backrooms-single-container>
      <backrooms-single-container
        label="Item"
        [value]="ddto[1]"
        percent="10"
        class="w-14"></backrooms-single-container>
      <backrooms-single-container
        label="Room"
        [value]="ddto[2]"
        percent="3.33"
        class="w-12"></backrooms-single-container>
      <backrooms-single-container
        label="Outcome"
        [value]="ddto[3]"
        percent="50"
        class="w-12"></backrooms-single-container>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgStyle, SingleContainerComponent],
})
export class DdtoSpreadComponent implements OnInit, OnChanges {
  @Input() deck: IDeck | null;
  @Input() container = false;

  ddto = [0, 0, 0, 0];

  private backroomCardStore = inject(BackroomsCardStore);

  ngOnInit(): void {
    this.getDDTO();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDDTO();
  }

  getDDTO() {
    if (!this.deck) {
      return;
    }
    const cards = mapToDeckCards(
      this.deck.cards,
      this.backroomCardStore.cards(),
    );
    const entities: IDeckCard[] = cards.filter(
      (card) => card.cardType === 'Entity',
    );
    const items: IDeckCard[] = cards.filter((card) => card.cardType === 'Item');
    const rooms: IDeckCard[] = cards.filter((card) => card.cardType === 'Room');
    const outcomes: IDeckCard[] = cards.filter(
      (card) => card.cardType === 'Outcome',
    );

    this.ddto[0] = getCountFromDeckCards(entities);
    this.ddto[1] = getCountFromDeckCards(items);
    this.ddto[2] = getCountFromDeckCards(rooms);
    this.ddto[3] = getCountFromDeckCards(outcomes);
  }

  linearGradient(value: number, cardType: string): string {
    let maxValue = 10;
    if (cardType === 'Room') {
      maxValue = 30;
    } else if (cardType === 'Outcome') {
      maxValue = 2;
    }
    const percent = value !== 0 ? (1 - value / maxValue) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${percent}%, #08528d 0%)`;
  }
}

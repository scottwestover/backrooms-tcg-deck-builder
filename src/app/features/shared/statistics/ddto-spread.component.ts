import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BackroomsCard, IDeck, IDeckCard } from '../../../../models';
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
          background: linearGradientEgg()
        }">
        <span class="text-black-outline-xs">{{ ddto[0] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(ddto[1])
        }">
        <span class="text-black-outline-xs">{{ ddto[1] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(ddto[2])
        }">
        <span class="text-black-outline-xs">{{ ddto[2] }}</span>
      </div>
      <div
        class="h-full w-full text-center"
        [ngStyle]="{
          background: linearGradient(ddto[3])
        }">
        <span class="text-black-outline-xs">{{ ddto[3] }}</span>
      </div>

      <h3 class="h-1/2 text-center text-xs">Egg</h3>
      <h3 class="h-1/2 text-center text-xs">Digimon</h3>
      <h3 class="h-1/2 text-center text-xs">Tamer</h3>
      <h3 class="h-1/2 text-center text-xs">Option</h3>
    </div>

    <div *ngIf="container" class="flex w-full flex-row">
      <backrooms-single-container
        label="Egg"
        [value]="ddto[0]"
        percent="20"
        class="w-12"></backrooms-single-container>
      <backrooms-single-container
        label="Digimon"
        [value]="ddto[1]"
        class="w-14"></backrooms-single-container>
      <backrooms-single-container
        label="Tamer"
        [value]="ddto[2]"
        class="w-12"></backrooms-single-container>
      <backrooms-single-container
        label="Option"
        [value]="ddto[3]"
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
    const digieggs: IDeckCard[] = []; //cards.filter((card) => card.cardType === 'Digi-Egg');
    const digimon: IDeckCard[] = []; //cards.filter((card) => card.cardType === 'Digimon');
    const tamer: IDeckCard[] = []; //cards.filter((card) => card.cardType === 'Tamer');
    const options: IDeckCard[] = []; //cards.filter((card) => card.cardType === 'Option');

    this.ddto[0] = getCountFromDeckCards(digieggs);
    this.ddto[1] = getCountFromDeckCards(digimon);
    this.ddto[2] = getCountFromDeckCards(tamer);
    this.ddto[3] = getCountFromDeckCards(options);
  }

  linearGradientEgg(): string {
    const eggPercent = this.ddto[0] !== 0 ? (1 - this.ddto[0] / 5) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${eggPercent}%, #08528d 0%)`;
  }

  linearGradient(value: number): string {
    const percent = value !== 0 ? (1 - value / 50) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${percent}%, #08528d 0%)`;
  }
}

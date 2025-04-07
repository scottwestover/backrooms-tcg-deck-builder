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
  selector: 'backrooms-color-spread',
  template: `
    <div
      *ngIf="!container"
      class="flex h-full w-full flex-row flex-nowrap items-stretch">
      <div
        *ngIf="colorSpread[0] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[0], '#ffd619')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[0] }}</span>
      </div>
      <div
        *ngIf="colorSpread[1] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[1], '#19b383')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[1] }}</span>
      </div>
      <div
        *ngIf="colorSpread[2] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[2], '#ef1919')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[2] }}</span>
      </div>
      <div
        *ngIf="colorSpread[3] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[3], '#8d6fdb')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[3] }}</span>
      </div>
      <div
        *ngIf="colorSpread[4] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[4], '#ffffff')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[4] }}</span>
      </div>
      <div
        *ngIf="colorSpread[5] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[5], '#191919')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[5] }}</span>
      </div>
      <div
        *ngIf="colorSpread[6] !== 0"
        class="h-full w-full grow text-center"
        [ngStyle]="{
          background: linearGradient(colorSpread[6], '#C0C0C0')
        }">
        <span class="text-black-outline-xs">{{ colorSpread[6] }}</span>
      </div>
    </div>

    <div *ngIf="container" class="flex w-full flex-row">
      <backrooms-single-container
        label="Yellow"
        color="#ffd619"
        class="w-10"
        [value]="colorSpread[0]"></backrooms-single-container>
      <backrooms-single-container
        label="Green"
        color="#19b383"
        class="w-10"
        [value]="colorSpread[1]"></backrooms-single-container>
      <backrooms-single-container
        label="Red"
        color="#ef1919"
        class="w-10"
        [value]="colorSpread[2]"></backrooms-single-container>
      <backrooms-single-container
        label="Purple"
        color="#8d6fdb"
        class="w-10"
        [value]="colorSpread[3]"></backrooms-single-container>
      <backrooms-single-container
        label="White"
        color="#ffffff"
        class="w-10"
        [value]="colorSpread[4]"></backrooms-single-container>
      <backrooms-single-container
        label="Black"
        color="#191919"
        class="w-10"
        [value]="colorSpread[5]"></backrooms-single-container>
      <backrooms-single-container
        label="Grey"
        color="#C0C0C0"
        class="w-10"
        [value]="colorSpread[6]"></backrooms-single-container>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgStyle, SingleContainerComponent],
})
export class ColorSpreadComponent implements OnInit, OnChanges {
  @Input() deck: IDeck | null;
  @Input() container = false;

  colorSpread = [0, 0, 0, 0, 0, 0, 0];

  private backroomCardStore = inject(BackroomsCardStore);

  ngOnInit(): void {
    this.getColorSpread();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getColorSpread();
  }

  getColorSpread() {
    if (!this.deck) {
      return;
    }

    const cards = mapToDeckCards(
      this.deck.cards,
      this.backroomCardStore.cards(),
    );
    const yellow = cards.filter((card) => card.rarity === 'COMMON');
    const green = cards.filter((card) => card.rarity === 'UNCOMMON');
    const red = cards.filter((card) => card.rarity === 'RARE');
    const purple = cards.filter((card) => card.rarity === 'HYPER');
    const white = cards.filter((card) => card.rarity === 'PURE');
    const black = cards.filter((card) => card.rarity === 'VOID');
    const grey = cards.filter((card) => card.rarity === 'SHATTERED');

    this.colorSpread[0] = getCountFromDeckCards(yellow);
    this.colorSpread[1] = getCountFromDeckCards(green);
    this.colorSpread[2] = getCountFromDeckCards(red);
    this.colorSpread[3] = getCountFromDeckCards(purple);
    this.colorSpread[4] = getCountFromDeckCards(white);
    this.colorSpread[5] = getCountFromDeckCards(black);
    this.colorSpread[6] = getCountFromDeckCards(grey);
  }

  linearGradient(value: number, color: string): string {
    const percent = value !== 0 ? (1 - value / 50) * 100 : 0;
    return `linear-gradient(to bottom, transparent ${percent}%, ${color} 0%)`;
  }
}

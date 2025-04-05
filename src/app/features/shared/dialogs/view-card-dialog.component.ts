import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  HostListener,
  inject,
} from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ImgFallbackDirective } from 'src/app/directives/ImgFallback.directive';
import { BackroomsCardStore } from 'src/app/store/backrooms-card.store';
import { WebsiteStore } from 'src/app/store/website.store';
import { replacements } from 'src/models/data/keyword-replacement.data';

import { BackroomsCard, ColorMap, ICountCard, IDeck } from '../../../../models';
import { DialogStore } from '../../../store/dialog.store';
import { SaveStore } from '../../../store/save.store';

@Component({
  selector: 'backrooms-view-card-dialog',
  template: `
    <div
      class="h-full w-full min-w-full max-w-full overflow-x-hidden md:w-[700px] md:min-w-[700px] md:max-w-[700px]">
      <div
        class="align-center min-h-10 mt-1 inline-flex w-full justify-between border-b border-slate-200"
        id="Header">
        <div
          class="align-center my-3 inline-flex h-full flex-grow flex-wrap justify-between gap-[.5rem] md:my-2 md:flex-nowrap">
          <p class="self-center font-bold text-gray-500" id="Card-Number">
            {{ card.cardNumber }}
          </p>
          <p
            class="self-center font-bold uppercase text-[#e2e4e6]"
            id="Card-Rarity">
            {{ card.rarity }}
          </p>
          <p
            [ngStyle]="{ color }"
            class="text-black-outline-xs self-center font-bold"
            id="Card-Type">
            {{ card.cardType }}
          </p>
          <!-- <div
            *ngIf="card.cardType === 'Digimon' || card.cardType === 'Digi-Egg'"
            [ngStyle]="{ backgroundColor }"
            class="inline-block rounded-full px-6 py-2.5 leading-tight shadow-md"
            id="Digimon-Lv">
            <p
              class="font-bold leading-[5px] text-[#e2e4e6]"
              [ngClass]="{ 'text-black': this.card.color === 'Yellow' }">
              {{ card.cardLv }}
            </p>
          </div> -->
          <p
            [ngStyle]="{ color }"
            class="text-black-outline-xs hidden self-center font-bold lg:flex"
            id="Card-Version">
            {{ version }}
          </p>
          <p
            [ngStyle]="{ color }"
            class="text-black-outline-xs self-center font-bold lg:hidden"
            id="Card-Version">
            {{ card.version }}
          </p>
        </div>
        <button
          (click)="closeViewCard()"
          class="p-button-text ml-4 flex-shrink-0 md:ml-6"
          icon="pi pi-times"
          pButton
          pRipple
          type="button"></button>
      </div>

      <div class="flex flex-row">
        <button class="mr-1" (click)="previousCard()">
          <i class="fa-solid fa-circle-arrow-left text-[#e2e4e6]"></i>
        </button>
        <h1
          [ngStyle]="{ color }"
          class="text-black-outline-xs my-1 text-3xl font-black"
          id="Card-Name">
          {{ card.name.english }}
        </h1>

        <button class="ml-1" (click)="nextCard()">
          <i class="fa-solid fa-circle-arrow-right text-[#e2e4e6]"></i>
        </button>
      </div>

      <div class="w-full flex-row md:flex" id="Image-Attributes">
        <div class="w-full md:w-1/2">
          <img
            [backroomsImgFallback]="png"
            alt="{{ imageAlt }}"
            defaultImage="assets/images/card-back.webp"
            class="mx-auto my-5 max-w-[15rem] md:my-0 md:max-w-full" />
        </div>
        <div class="md:max-w-1/2 w-full self-center md:w-1/2 md:pl-2">
          <div
            *ngIf="inDeck()"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Deck-Count">
            <p
              [ngStyle]="{ color }"
              class="text-black-outline-xs ml-1.5 text-lg font-extrabold">
              In Deck
            </p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ deckCount() }}x
            </p>
          </div>
          <div
            *ngIf="collectionMode"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Deck-Count">
            <p
              [ngStyle]="{ color }"
              class="text-black-outline-xs ml-1.5 text-lg font-extrabold">
              In Collection
            </p>
            <p
              *ngIf="collectionCard"
              class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ collectionCard.count }}x
            </p>
          </div>

          <!-- <div
            *ngIf="card.type !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Type">
            <p
              [ngStyle]="{ color }"
              class="text-black-outline-xs ml-1.5 text-lg font-extrabold">
              Type
            </p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.type }}
            </p>
          </div> -->
          <!-- <div
            *ngIf="card.dp !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-DP">
            <p
              [ngStyle]="{ color }"
              class="text-black-outline-xs ml-1.5 text-lg font-extrabold">
              DP
            </p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.dp }}
            </p>
          </div> -->
          <!-- <div
            *ngIf="card.playCost !== '-'"
            class="my-0.5 flex w-full flex-row rounded-full border border-slate-200 backdrop-brightness-150"
            id="Digimon-Play-Cost">
            <p
              [ngStyle]="{ color }"
              class="text-black-outline-xs ml-1.5 text-lg font-extrabold">
              Play Cost
            </p>
            <p class="font-white ml-auto mr-1.5 font-bold leading-[1.7em]">
              {{ card.playCost }}
            </p>
          </div> -->
        </div>
      </div>

      <div class="my-4 max-w-full" id="Notes">
        <div class="flex flex-col" id="Card-Notes">
          <p
            [ngStyle]="{ color }"
            class="text-black-outline-xs text-lg font-extrabold">
            Notes
          </p>
          <p class="font-white font-bold">{{ card.notes }}</p>
          <p class="font-white font-bold">{{ card.version }}</p>
        </div>
      </div>

      <div
        *ngIf="card.illustrator !== ''"
        class="my-4 max-w-full"
        id="Illustrator">
        <div class="flex flex-col" id="Card-Illustrator">
          <p
            [ngStyle]="{ color }"
            class="text-black-outline-xs text-lg font-extrabold">
            Illustrator
          </p>
          <div class="flex flex-row">
            <p class="font-white font-bold">{{ card.illustrator }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    NgStyle,
    NgIf,
    NgClass,
    ButtonModule,
    RippleModule,
    LazyLoadImageModule,
    AsyncPipe,
    ImgFallbackDirective,
    NgForOf,
  ],
})
export class ViewCardDialogComponent {
  changeDetection = inject(ChangeDetectorRef);
  saveStore = inject(SaveStore);
  dialogStore = inject(DialogStore);
  websiteStore = inject(WebsiteStore);
  backroomCardStore = inject(BackroomsCardStore);

  card: BackroomsCard = this.dialogStore.viewCard().card;
  width?: string = this.dialogStore.viewCard().width;

  png: string;
  imageAlt: string;

  color: string;
  backgroundColor: string;
  colorMap = ColorMap;

  version: string;
  type: string;

  deck: IDeck = this.websiteStore.deck();

  collectionMode = this.saveStore.collectionMode();
  collectionCard: ICountCard = { count: 0, id: 'BT1-001' };

  loadCard = effect(() => {
    const collection = this.saveStore.collection();
    this.collectionCard = collection.find(
      (colCard) => colCard.id === this.card.id,
    )!;

    this.card = this.dialogStore.viewCard().card;
    this.setupView();
  });

  setupView() {
    // TODO
    //this.color = this.colorMap.get(this.card.color)!;
    //this.backgroundColor = this.color;
    this.version = this.getVersion(this.card.version)!;
    this.png = this.card.cardImage;
    this.imageAlt = this.card.cardNumber + ' ' + this.card.name.english;
    this.type = this.card.cardType;
  }

  inDeck(): boolean {
    return !!this.deck.cards.find((card) => card.id === this.card.id);
  }

  deckCount(): number {
    const card = this.deck.cards.find((card) => card.id === this.card.id);
    return card?.count ?? 0;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowRight') {
      this.nextCard();
    }
    if (event.key == 'ArrowLeft') {
      this.previousCard();
    }
  }

  previousCard() {
    const id = this.backroomCardStore
      .cards()
      .findIndex((card) => this.card.id === card.id);
    if (id === -1 || id === 0) {
      return;
    }
    const newCard = this.backroomCardStore.cards()[id - 1];
    if (!newCard) {
      return;
    }
    this.card = newCard;
    this.setupView();
  }

  nextCard() {
    const id = this.backroomCardStore
      .cards()
      .findIndex((card) => this.card.id === card.id);
    if (id === -1 || id === this.backroomCardStore.cards().length + 1) {
      return;
    }
    const newCard = this.backroomCardStore.cards()[id + 1];
    if (!newCard) {
      return;
    }
    this.card = newCard;
    this.setupView();
  }

  replaceWithImageTags(effect: string): string {
    let replacedText = effect;
    for (const [pattern, imageTag] of replacements) {
      replacedText = replacedText.replace(
        pattern,
        `<img class="inline h-4" src="assets/images/keywords/${imageTag}.webp"/>`,
      );
    }
    return replacedText;
  }

  closeViewCard() {
    this.dialogStore.showViewCardDialog(false);
  }

  private getVersion(version: string) {
    if (version.includes('Foil')) {
      return 'Foil';
    } else if (version.includes('Textured')) {
      return 'Textured';
    } else if (version.includes('Release')) {
      return 'Pre Release';
    } else if (version.includes('Box Topper')) {
      return 'Box Topper';
    } else if (version.includes('Full Art')) {
      return 'Full Art';
    } else if (version.includes('Stamp')) {
      return 'Stamp';
    } else if (version.includes('Special Rare')) {
      return 'Special Rare';
    } else if (version.includes('Rare Pull')) {
      return 'Rare Pull';
    }
    return 'Normal';
  }
}

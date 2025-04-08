import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  Signal,
} from '@angular/core';
import { IDeck, IDeckCard } from '../../../../models';
import { mapToDeckCards } from '../../../functions';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';
import { WebsiteStore } from '../../../store/website.store';
import { ColorSpreadComponent } from '../../shared/statistics/color-spread.component';
import { DdtoSpreadComponent } from '../../shared/statistics/ddto-spread.component';

@Component({
  selector: 'backrooms-deck-stats',
  template: `
    <!-- Deck Stats -->
    <div
      *ngIf="showStats"
      class="fixed bottom-0 z-[102] flex h-28 w-full flex-row"
      [ngClass]="{ 'lg:w-[250px]': collectionView }">
      <div
        [ngClass]="{ 'w-full': collectionView, 'border-l-2': !collectionView }"
        class="surface-card-custom flex flex-row border-r-2 border-t-2 border-white bg-opacity-25 lg:mx-auto">
        <backrooms-ddto-spread
          [deck]="deck()"
          [container]="true"
          class="ml-auto hidden border-r border-slate-200 px-5 lg:block"></backrooms-ddto-spread>

        <backrooms-color-spread
          *ngIf="!collectionView"
          [deck]="deck()"
          [container]="true"
          class="mr-auto hidden border-l border-slate-200 px-5 lg:block"></backrooms-color-spread>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    DdtoSpreadComponent,
    ColorSpreadComponent,
    AsyncPipe,
  ],
})
export class DeckStatsComponent {
  @Input() showStats = true;
  @Input() collectionView = false;

  websiteStore = inject(WebsiteStore);
  backroomCardStore = inject(BackroomsCardStore);

  deck: Signal<IDeck> = this.websiteStore.deck;
  mainDeck: Signal<IDeckCard[]> = computed(() =>
    mapToDeckCards(
      this.websiteStore.deck().cards,
      this.backroomCardStore.cards(),
    ),
  );
}

import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
  NgOptimizedImage,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import {
  BackroomsCard,
  DRAG,
  dummyCard,
  ICountCard,
  IDraggedCard,
} from '../../../../models';
import { ImgFallbackDirective } from '../../../directives/ImgFallback.directive';
import { IntersectionListenerDirective } from '../../../directives/intersection-listener.directive';
import { filterCards } from '../../../functions';
import { DialogStore } from '../../../store/dialog.store';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';
import { SaveStore } from '../../../store/save.store';
import { WebsiteStore } from '../../../store/website.store';
import { ViewCardDialogComponent } from '../../shared/dialogs/view-card-dialog.component';
import { FilterSideBoxComponent } from '../../shared/filter/filter-side-box.component';
import { FullCardComponent } from '../../shared/full-card.component';
import { PaginationCardListHeaderComponent } from './pagination-card-list-header.component';
import { SearchComponent } from './search.component';
import { FilterStore } from '../../../store/filter.store';

@Component({
  selector: 'backrooms-pagination-card-list',
  template: `
    <div class="flex flex-col w-full">
      <backrooms-pagination-card-list-header
        [filterButton]="!filterBoxEnabled"
        (filterBox)="filterBox = $event"
        [widthForm]="widthForm"
        [viewOnly]="
          inputCollection.length > 0
        "></backrooms-pagination-card-list-header>

      <backrooms-search></backrooms-search>

      <div
        [pDroppable]="['fromDeck', 'fromSide']"
        (onDrop)="drop(draggedCard(), draggedCard())"
        class="h-[calc(100vh-8.5rem)] md:h-[calc(100vh-10rem)] lg:h-[calc(100vh-5rem)] flex flex-wrap w-full content-start justify-start overflow-y-scroll">
        @for (card of showCards; track $index) {
          @defer (on viewport) {
            <backrooms-full-card
              [style]="{ width: widthForm.value + 'rem' }"
              class="m-0.5 md:m-1 flex items-center justify-center self-start"
              [card]="card"
              [count]="getCount(card.id)"
              [deckBuilder]="true"
              [collectionOnly]="collectionOnly"
              [onlyView]="inputCollection.length > 0"
              (viewCard)="viewCard($event)"></backrooms-full-card>
            <div
              *ngIf="$index + 1 === showCards.length"
              (backroomsIntersectionListener)="loadItems()"
              class="sm:m-0.5 md:m-1"></div>
          } @placeholder {
            <p-skeleton
              class="sm:m-0.5 md:m-1"
              width="5.6rem"
              height="10rem"></p-skeleton>
          }
        } @empty {
          <h1
            *ngIf="filteredCards().length === 0"
            class="primary-color text-bold my-10 text-center text-5xl">
            No cards found!
          </h1>
        }
      </div>
    </div>

    <backrooms-filter-side-box
      *ngIf="filterBoxEnabled"
      class="hidden xl:flex"></backrooms-filter-side-box>

    <p-sidebar
      [(visible)]="filterBox"
      position="right"
      styleClass="w-[20rem] md:w-[24rem] overflow-x-hidden overflow-y-auto p-0">
      <backrooms-filter-side-box></backrooms-filter-side-box>
    </p-sidebar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PaginationCardListHeaderComponent,
    SearchComponent,
    NgIf,
    DragDropModule,
    NgFor,
    NgClass,
    FullCardComponent,
    DialogModule,
    FilterSideBoxComponent,
    ViewCardDialogComponent,
    AsyncPipe,
    SidebarModule,
    DataViewModule,
    ImgFallbackDirective,
    NgOptimizedImage,
    SkeletonModule,
    IntersectionListenerDirective,
  ],
})
export class PaginationCardListComponent {
  @Input() collectionOnly: boolean = false;
  @Input() initialWidth = 10;
  @Input() inputCollection: ICountCard[] = [];

  backroomCardStore = inject(BackroomsCardStore);
  websiteStore = inject(WebsiteStore);
  saveStore = inject(SaveStore);
  dialogStore = inject(DialogStore);
  filterStore = inject(FilterStore);

  draggedCard = this.websiteStore.draggedCard;
  collection = this.saveStore.collection;

  widthForm = new FormControl(this.initialWidth);

  filterBox = false;
  filterBoxEnabled = true;
  card = JSON.parse(JSON.stringify(dummyCard));

  perPage = 100;
  page = 1;
  filteredCards = this.backroomCardStore.filteredCards;
  showCards: BackroomsCard[] = [];

  onFilterChange = effect(
    () => {
      if (this.inputCollection.length === 0) return;
      const cards = this.backroomCardStore.cards();
      if (cards.length === 0) return;

      const filteredCards = filterCards(
        this.backroomCardStore.cards(),
        { ...this.saveStore.save(), collection: this.inputCollection },
        this.filterStore.filter(),
        this.websiteStore.sort(),
        this.backroomCardStore.cardsMap(),
      );

      this.backroomCardStore.updateFilteredCards(filteredCards);
    },
    { allowSignalWrites: true },
  );

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    effect(() => {
      const settings = this.saveStore.settings();
      if (
        settings.fullscreenFilter === null ||
        settings.fullscreenFilter === undefined
      ) {
        return true;
      }
      return settings.fullscreenFilter;
    });

    effect(() => {
      const filteredCards = this.backroomCardStore.filteredCards();
      this.showCards = filteredCards.slice(0, this.perPage);
      this.page = 1;
      this.changeDetectorRef.detectChanges();
    });
  }

  getCount(cardId: string): number {
    if (this.inputCollection.length === 0) {
      return this.collection().find((value) => value.id === cardId)?.count ?? 0;
    }
    return (
      this.inputCollection.find((value) => value.id === cardId)?.count ?? 0
    );
  }

  viewCard(card: BackroomsCard) {
    this.dialogStore.updateViewCardDialog({
      show: true,
      card,
      width: '50vw',
    });
  }

  drop(card: IDraggedCard, dragCard: IDraggedCard) {
    this.websiteStore.removeCardFromDeck(card.card.id);
  }

  loadItems() {
    const from = this.page * this.perPage;
    const to = (this.page + 1) * this.perPage;
    const newCards = this.filteredCards().slice(from, to);
    this.showCards.push(...newCards);
    this.page = this.page + 1;
  }
}

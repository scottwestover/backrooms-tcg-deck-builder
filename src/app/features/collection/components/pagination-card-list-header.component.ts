import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { SliderModule } from 'primeng/slider';
import { SaveStore } from '../../../store/save.store';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';

@Component({
  selector: 'backrooms-pagination-card-list-header',
  template: `
    <div class="relative flex justify-center items-center h-20 w-full flex-col">
      <div
        class="relative flex justify-center items-center h-10 w-full flex-row">
        <div
          *ngIf="!viewOnly"
          class="absolute left-2 top-4 flex flex-row justify-center items-center">
          <span class="text-xs hidden sm:block font-bold text-[#e2e4e6]"
            >Collection Mode:</span
          >
          <span class="text-xs sm:hidden font-bold text-[#e2e4e6]">CM:</span>
          <input
            type="checkbox"
            class="my-auto ml-1 h-5 w-5"
            [ngModel]="collectionMode()"
            (ngModelChange)="changeCollectionMode($event)" />
          <span class="ml-6 text-xs font-bold text-[#e2e4e6]">
            Cards: {{ cardCount() }}
          </span>
        </div>

        <div
          [ngClass]="{ 'xl:hidden ': !filterButton }"
          class="mx-2 mt-2 flex flex-row justify-center absolute right-2">
          <button
            (click)="filterBox.emit(true)"
            class="flex flex-row sm:justify-center min-w-auto primary-background h-8 w-8 sm:w-24 rounded p-2 text-xs font-semibold text-[#e2e4e6]">
            <i class="pi pi-filter-fill mr-3"></i>
            <span class="hidden sm:block">Filter</span>
          </button>
        </div>
      </div>
      <div
        class="relative flex justify-center items-center h-10 w-full flex-row">
        <p-slider
          class="w-80"
          [formControl]="widthForm"
          [step]="0.1"
          [min]="3"
          [max]="14"></p-slider>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PaginatorModule,
    FormsModule,
    AsyncPipe,
    NgIf,
    SliderModule,
    ReactiveFormsModule,
    NgClass,
  ],
})
export class PaginationCardListHeaderComponent {
  @Input() widthForm: FormControl;
  @Input() viewOnly: boolean;
  @Input() filterButton: boolean | null = true;
  @Output() filterBox = new EventEmitter<boolean>();

  saveStore = inject(SaveStore);
  backroomCardStore = inject(BackroomsCardStore);

  collectionMode = this.saveStore.collectionMode;

  cardCount = computed(() => {
    return this.backroomCardStore.filteredCards().length;
  });

  changeCollectionMode(collectionMode: boolean) {
    // const settings = this.saveStore.settings();
    // this.saveStore.updateSettings({ ...settings, collectionMode });
    this.saveStore.updateCollectionMode(collectionMode);
  }
}

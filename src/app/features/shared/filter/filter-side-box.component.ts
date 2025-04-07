import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { itemsAsSelectItem } from 'src/app/functions/backrooms-card.functions';
import {
  Attributes,
  Colors,
  emptyFilter,
  IFilter,
  Illustrators,
  Keywords,
  Presets,
  Restrictions,
  SpecialRequirements,
  Types,
} from '../../../../models';
import { FilterStore } from '../../../store/filter.store';
import { SaveStore } from '../../../store/save.store';
import { RangeSliderComponent } from '../range-slider.component';
import { SortButtonsComponent } from '../sort-buttons.component';
import { BlockFilterComponent } from './block-filter.component';
import { CardTypeFilterComponent } from './card-type-filter.component';
import { ColorFilterComponent } from './color-filter.component';
import { RarityFilterComponent } from './rarity-filter.component';
import { SetFilterComponent } from './set-filter.component';
import { VersionFilterComponent } from './version-filter.component';

@Component({
  selector: 'backrooms-filter-side-box',
  template: `
    <div class="mx-1 flex h-full w-full flex-col pt-1 overflow-y-auto">
      <div class="mt-1 grid w-full grid-cols-4 spacer">
        <backrooms-sort-buttons
          class="col-span-3 mx-auto"></backrooms-sort-buttons>

        <button
          (click)="reset()"
          class="ml-auto mr-5 text-[#e2e4e6] col-span-1"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <backrooms-color-filter class="spacer"></backrooms-color-filter>
      <backrooms-card-type-filter class="spacer"></backrooms-card-type-filter>

      <backrooms-set-filter class="mx-auto w-full max-w-[250px] spacer">
      </backrooms-set-filter>

      <div class="flex flex-row spacer">
        <backrooms-range-slider
          [reset]="resetEmitter"
          [minMax]="[0, collectionCountMax()]"
          [filterFormControl]="cardCountFilter"
          title="Number in Collection:"
          class="w-full"></backrooms-range-slider>
        <button
          (click)="
            cardCountFilter.setValue([0, collectionCountMax()], {
              emitEvent: false
            })
          "
          class="w-12 text-[#e2e4e6]"
          type="button">
          <i class="pi pi-refresh"></i>
        </button>
      </div>

      <!-- <backrooms-rarity-filter></backrooms-rarity-filter> -->
      <!-- <backrooms-version-filter></backrooms-version-filter> -->
    </div>
  `,
  styleUrls: ['filter-side-box.component.scss'],
  standalone: true,
  imports: [
    SortButtonsComponent,
    ColorFilterComponent,
    CardTypeFilterComponent,
    SetFilterComponent,
    RangeSliderComponent,
    RarityFilterComponent,
    VersionFilterComponent,
    BlockFilterComponent,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [MessageService],
})
export class FilterSideBoxComponent implements OnInit, OnDestroy {
  @Input() public showColors: boolean;
  messageService = inject(MessageService);
  filterStore = inject(FilterStore);
  saveStore = inject(SaveStore);
  keywordFilter = new UntypedFormControl([]);
  attributeFilter = new UntypedFormControl([]);
  typeFilter = new UntypedFormControl([]);
  illustratorFilter = new UntypedFormControl([]);
  specialRequirementsFilter = new UntypedFormControl([]);
  restrictionsFilter = new UntypedFormControl([]);
  sourceFilter = new UntypedFormControl([]);
  levelFilter = new UntypedFormControl([]);
  playCostFilter = new UntypedFormControl([]);
  digivolutionFilter = new UntypedFormControl([]);
  dpFilter = new UntypedFormControl([]);
  cardCountFilter = new UntypedFormControl([]);
  presetFilter = new UntypedFormControl([]);
  filterFormGroup: UntypedFormGroup = new UntypedFormGroup({
    keywordFilter: this.keywordFilter,
    attributeFilter: this.attributeFilter,
    typeFilter: this.typeFilter,
    illustratorFilter: this.illustratorFilter,
    specialRequirementsFilter: this.specialRequirementsFilter,
    restrictionsFilter: this.restrictionsFilter,
    sourceFilter: this.sourceFilter,
    levelFilter: this.levelFilter,
    playCostFilter: this.playCostFilter,
    digivolutionFilter: this.digivolutionFilter,
    dpFilter: this.dpFilter,
    cardCountFilter: this.cardCountFilter,
    presetFilter: this.presetFilter,
  });
  keywords = itemsAsSelectItem(Keywords);
  attributes = itemsAsSelectItem(Attributes);
  types = itemsAsSelectItem(Types);
  colors = itemsAsSelectItem(Colors);
  illustrators = itemsAsSelectItem(Illustrators);
  specialRequirements = itemsAsSelectItem(SpecialRequirements);
  restrictions = itemsAsSelectItem(Restrictions);
  presets = itemsAsSelectItem(Presets);
  resetEmitter = new EventEmitter<void>();
  private filter: IFilter;
  updateFilter = effect(
    () => {
      const filter = this.filterStore.filter();
      this.filter = filter;

      this.levelFilter.setValue(filter.levelFilter, { emitEvent: false });
      this.playCostFilter.setValue(filter.playCostFilter, {
        emitEvent: false,
      });
      this.digivolutionFilter.setValue(filter.digivolutionFilter, {
        emitEvent: false,
      });
      this.dpFilter.setValue(filter.dpFilter, { emitEvent: false });
      this.cardCountFilter.setValue(filter.cardCountFilter, {
        emitEvent: false,
      });

      this.keywordFilter.setValue(filter.keywordFilter, { emitEvent: false });
      this.attributeFilter.setValue(filter.attributeFilter, {
        emitEvent: false,
      });
      this.typeFilter.setValue(filter.typeFilter, { emitEvent: false });
      this.illustratorFilter.setValue(filter.illustratorFilter, {
        emitEvent: false,
      });
      this.specialRequirementsFilter.setValue(
        filter.specialRequirementsFilter,
        { emitEvent: false },
      );
      this.restrictionsFilter.setValue(filter.restrictionsFilter, {
        emitEvent: false,
      });
      this.sourceFilter.setValue(filter.sourceFilter, {
        emitEvent: false,
      });
      this.presetFilter.setValue(filter.presetFilter, {
        emitEvent: false,
      });
    },
    { allowSignalWrites: true },
  );

  collectionCountMax = computed(() => 30);
  private onDestroy$ = new Subject();

  ngOnInit(): void {
    this.filterFormGroup.valueChanges
      .pipe(debounceTime(200), takeUntil(this.onDestroy$))
      .subscribe((filterValue) => {
        const filter: IFilter = { ...this.filter, ...filterValue };
        this.filterStore.updateFilter(filter);
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  reset() {
    this.resetEmitter.emit();
    this.filterStore.updateFilter(emptyFilter);
    this.messageService.add({
      severity: 'info',
      detail: 'All filter were reset.',
    });
  }
}

import { AsyncPipe, NgIf } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { CardTypeButtons } from '../../../../models';
import { FilterStore } from '../../../store/filter.store';
import { MultiButtonsComponent } from '../multi-buttons.component';

@Component({
  selector: 'backrooms-card-type-filter',
  template: `
    <backrooms-multi-buttons
      (clickEvent)="changeCardType($event, cardTypeFilter)"
      [buttonArray]="cardTypeButtons"
      [value]="cardTypeFilter"
      [perRow]="2"
      title="Card Types"></backrooms-multi-buttons>
  `,
  standalone: true,
  imports: [NgIf, MultiButtonsComponent, AsyncPipe],
})
export class CardTypeFilterComponent {
  filterStore = inject(FilterStore);
  cardTypeFilter: string[] = this.filterStore.cardTypeFilter();

  cardTypeButtons = CardTypeButtons;

  filterChange = effect(() => {
    this.cardTypeFilter = this.filterStore.cardTypeFilter();
  });

  changeCardType(type: string, cardTypeFilter: string[]) {
    let types = [];
    if (cardTypeFilter && cardTypeFilter.includes(type)) {
      types = cardTypeFilter.filter((value) => value !== type);
    } else {
      types = [...new Set(cardTypeFilter), type];
    }
    this.filterStore.updateCardTypeFilter(types);
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TAGS } from '../../../../models';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'backrooms-deck-filter',
  template: `
    <div class="mx-auto flex flex-row">
      <div class="flex w-full flex-col">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search h-3"></i>
          <input
            [formControl]="searchFilter"
            class="text-xs w-full"
            pInputText
            placeholder="Search (Title, Description, Card-Ids)"
            type="text" />
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    MultiSelectModule,
  ],
})
export class DeckFilterComponent {
  @Input() searchFilter: UntypedFormControl;
  @Input() tagFilter: UntypedFormControl;

  tags = TAGS;
}

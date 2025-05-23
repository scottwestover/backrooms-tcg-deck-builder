import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { TAGS } from '../../../../models';

@Component({
  selector: 'backrooms-decks-filter',
  template: `
    <div [formGroup]="form">
      <div
        class="my-1 grid max-w-7xl grid-cols-5 lg:flex lg:flex-row hidden lg:block">
        <span class="col-span-5 sm:col-span-2 p-input-icon-left my-1 w-full">
          <i class="pi pi-search h-3"></i>
          <input
            formControlName="searchFilter"
            class="w-full text-xs"
            pInputText
            placeholder="Search (Title, Description, User, Card-Ids)"
            type="text" />
        </span>
        <button
          (click)="applyFilter.emit(true)"
          class="col-span-2 sm:col-span-1 min-w-auto border-2 border-white my-auto ml-2 h-8 sm:w-32 rounded p-2 text-xs font-semibold text-[#e2e4e6]">
          Filter
        </button>
      </div>
      <div class="my-1 grid max-w-7xl grid-cols-5 lg:hidden">
        <div class="col-span-5 p-input-icon-left my-1 w-full">
          <i class="pi pi-search h-3"></i>
          <input
            formControlName="searchFilter"
            class="w-full text-xs"
            pInputText
            placeholder="Search (Title, Description, User, Card-Ids)"
            type="text" />
        </div>
        <div
          class="col-span-5 p-input-icon-left my-1 w-full"
          style="text-align:center;">
          <button
            (click)="applyFilter.emit(true)"
            class="min-w-auto border-2 border-white my-auto ml-2 h-8 sm:w-32 rounded p-2 text-xs font-semibold text-[#e2e4e6]">
            Filter
          </button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    InputTextModule,
    NgIf,
    StyleClassModule,
    MultiSelectModule,
  ],
})
export class DecksFilterComponent {
  @Input() form: UntypedFormGroup;

  @Output() applyFilter = new EventEmitter<any>();

  tags = TAGS;
}

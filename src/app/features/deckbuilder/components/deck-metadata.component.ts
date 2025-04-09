import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ColorList } from '../../../../models';
import { ObscenityPipe } from '../../../pipes/obscenity.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { NgFor, NgClass, NgOptimizedImage } from '@angular/common';
import { BackroomsCardStore } from '../../../store/backrooms-card.store';
import { WebsiteStore } from '../../../store/website.store';

@Component({
  selector: 'backrooms-deck-metadata',
  template: `
    <div class="mb-1 inline-flex w-full px-3">
      <div class="mt-2 w-full">
        <input
          [ngModel]="this.obscenity.transform(this.title())"
          (ngModelChange)="updateTitle($event)"
          placeholder="Deck Name:"
          class="h-8 w-full text-sm"
          pInputText
          type="text" />
      </div>
    </div>

    <div class="mb-1 inline-flex w-full px-3">
      <span class="mt-2 w-full">
        <textarea
          [ngModel]="this.obscenity.transform(this.description())"
          (ngModelChange)="updateDescription($event)"
          placeholder="Description:"
          class="h-[40px] w-full overflow-hidden md:h-[66px]"
          pInputTextarea></textarea>
      </span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    ChipModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    NgClass,
    NgOptimizedImage,
  ],
})
export class DeckMetadataComponent {
  websiteStore = inject(WebsiteStore);
  backroomCardStore = inject(BackroomsCardStore);

  title = computed(() => this.websiteStore.deck().title);
  description = computed(() => this.websiteStore.deck().description);

  colors = ColorList;
  obscenity = new ObscenityPipe();

  updateTitle(title: string) {
    this.websiteStore.updateDeckTitle(title);
  }
  updateDescription(description: string) {
    this.websiteStore.updateDeckDescription(description);
  }
}

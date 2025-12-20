import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IChallenge } from '../../../../models';

@Component({
  selector: 'backrooms-challenge-display-card',
  template: `
    @if (challenge) {
      <div
        class="relative flex h-full flex-col rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-yellow-500">
        @if (rerollable) {
          <button
            pButton
            type="button"
            icon="pi pi-sync"
            class="p-button-rounded p-button-text absolute top-2 right-2"
            (click)="onRerollClick()"></button>
        }
        <div class="mb-2 flex items-start justify-between">
          <h3
            class="text-lg font-bold text-yellow-400 flex-grow overflow-hidden whitespace-nowrap text-ellipsis pr-2">
            {{ challenge.name }}
          </h3>
        </div>
        <p class="flex-grow text-gray-300">{{ challenge.description }}</p>
        <div
          class="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div class="flex flex-shrink-0 items-center gap-2">
            <span
              class="rounded-full bg-gray-700 px-2 py-0.5 text-sm font-semibold flex-shrink-0 whitespace-nowrap">
              Lvl. {{ challenge.difficulty }}
            </span>
            <span
              class="rounded-full bg-gray-700 px-2 py-0.5 text-sm font-semibold flex-shrink-0 whitespace-nowrap">
              {{ challenge.type }}
            </span>
          </div>
          <span class="ml-2 truncate">by {{ challenge.creator }}</span>
        </div>
      </div>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, ButtonModule],
})
export class ChallengeDisplayCardComponent {
  @Input() challenge: IChallenge | null = null;
  @Input() rerollable = false;
  @Output() reroll = new EventEmitter<void>();

  onRerollClick(): void {
    this.reroll.emit();
  }
}

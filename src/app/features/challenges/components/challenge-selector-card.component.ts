import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IChallenge } from '../../../../models';

@Component({
  selector: 'backrooms-challenge-selector-card',
  template: `
    <div
      class="flex h-full flex-col rounded-lg border border-gray-700 bg-gray-800 p-4 transition-colors hover:border-yellow-500">
      <div class="flex h-full flex-col gap-4">
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="flex flex-col md:w-1/3">
            <label class="mb-1 text-sm text-gray-400">Level:</label>
            <select
              name="level-select"
              [(ngModel)]="selectedLevel"
              (ngModelChange)="onLevelChange($event)"
              class="rounded-md bg-gray-700 p-2 text-white">
              <option [ngValue]="null">Any</option>
              @for (level of availableLevels; track level) {
                <option [ngValue]="level">{{ level }}</option>
              }
            </select>
          </div>
          <div class="flex flex-col md:w-2/3">
            <label class="mb-1 text-sm text-gray-400">Challenge:</label>
            <select
              name="challenge-select"
              [ngModel]="challenge"
              (ngModelChange)="onChallengeChange($event)"
              [disabled]="
                !filteredChallenges || filteredChallenges.length === 0
              "
              class="rounded-md bg-gray-700 p-2 text-white">
              <option [ngValue]="null" disabled>Select a challenge</option>
              @for (c of filteredChallenges; track c.id) {
                <option [ngValue]="c">{{ c.name }}</option>
              }
            </select>
          </div>
        </div>

        @if (challenge) {
          <div class="mt-2 border-t border-gray-700 pt-2">
            <div class="mb-1 flex items-center justify-between">
              <h4
                class="text-md font-semibold text-yellow-400 flex-grow overflow-hidden whitespace-nowrap text-ellipsis pr-2">
                {{ challenge.name }}
              </h4>
            </div>
            <p class="text-sm text-gray-300">{{ challenge.description }}</p>
            <div
              class="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div class="flex flex-shrink-0 items-center gap-2">
                <span
                  class="rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold flex-shrink-0 whitespace-nowrap">
                  Lvl. {{ challenge.difficulty }}
                </span>
                <span
                  class="rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold flex-shrink-0 whitespace-nowrap">
                  {{ challenge.type }}
                </span>
              </div>
              <span class="ml-2 truncate">by {{ challenge.creator }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, FormsModule],
})
export class ChallengeSelectorCardComponent implements OnChanges {
  @Input() challenge: IChallenge | null = null;
  @Input() allChallenges: IChallenge[] = [];
  @Input() activeTypes: string[] = [];
  @Output() challengeChange = new EventEmitter<IChallenge | null>();

  selectedLevel: number | null = null;
  availableLevels: number[] = [];
  filteredChallenges: IChallenge[] = [];

  private get challengesFilteredByType(): IChallenge[] {
    if (!this.activeTypes || this.activeTypes.length === 0) {
      return [];
    }
    return this.allChallenges.filter((c) => this.activeTypes.includes(c.type));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['allChallenges'] || changes['activeTypes']) {
      const available = this.challengesFilteredByType;
      this.availableLevels = [
        ...new Set(available.map((c) => c.difficulty)),
      ].sort((a, b) => a - b);

      if (
        this.selectedLevel &&
        !this.availableLevels.includes(this.selectedLevel)
      ) {
        this.selectedLevel = null;
      }

      this.filterChallenges(this.selectedLevel);

      const currentChallenge = this.challenge;
      if (
        currentChallenge &&
        !this.filteredChallenges.find((c) => c.id === currentChallenge.id)
      ) {
        this.onChallengeChange(null);
      }
    }
  }

  onLevelChange(level: number | null) {
    this.selectedLevel = level;
    this.filterChallenges(level);
    if (this.challenge && level !== null && this.challenge.difficulty !== level) {
      this.onChallengeChange(null);
    }
  }

  filterChallenges(level: number | null) {
    const available = this.challengesFilteredByType;
    if (level === null) {
      this.filteredChallenges = available;
    }
    else {
      this.filteredChallenges = available.filter(
        (c) => c.difficulty === level,
      );
    }
  }

  onChallengeChange(challenge: IChallenge | null) {
    this.challengeChange.emit(challenge);
  }
}

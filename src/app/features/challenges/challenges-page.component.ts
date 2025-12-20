import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TooltipModule } from 'primeng/tooltip';
import { switchMap, take } from 'rxjs';
import { IChallenge } from '../../../models';
import { ChallengeService } from '../../services/challenge.service';
import { UrlSyncService } from '../../services/url-sync.service';
import { PageComponent } from '../shared/page.component';
import { ChallengeDisplayCardComponent } from './components/challenge-display-card.component';
import { ChallengeSelectorCardComponent } from './components/challenge-selector-card.component';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'backrooms-challenges-page',
  template: `
    <backrooms-page>
      <div class="mx-auto w-full max-w-7xl self-baseline px-5">
        <h1
          class="text-shadow mt-6 pb-1 text-2xl font-black text-[#e2e4e6] md:text-4xl">
          Challenge Randomizer
        </h1>
        <p class="text-md mb-1 text-gray-400">
          Generate a random set of challenges to complete.
        </p>

        <hr />

        <div
          class="my-4 flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
          <div class="flex flex-col items-center">
            <p class="mb-1 text-sm text-gray-400">Randomization Mode:</p>
            <div class="flex items-center justify-center">
              <button
                (click)="setGenerationMode('all-levels')"
                [ngClass]="{
                  'bg-yellow-500 text-black': generationMode === 'all-levels',
                  'bg-gray-700 text-white': generationMode !== 'all-levels'
                }"
                class="rounded-l-lg px-3.5 py-1.5 font-bold transition-colors md:px-4 md:py-2">
                All Levels
              </button>
              <button
                (click)="setGenerationMode('random')"
                [ngClass]="{
                  'bg-yellow-500 text-black': generationMode === 'random',
                  'bg-gray-700 text-white': generationMode !== 'random'
                }"
                class="px-3.5 py-1.5 font-bold transition-colors md:px-4 md:py-2">
                Random
              </button>
              <button
                (click)="setGenerationMode('manual')"
                [ngClass]="{
                  'bg-yellow-500 text-black': generationMode === 'manual',
                  'bg-gray-700 text-white': generationMode !== 'manual'
                }"
                class="rounded-r-lg px-3.5 py-1.5 font-bold transition-colors md:px-4 md:py-2">
                Manual
              </button>
            </div>
          </div>

          <div class="flex flex-col items-center">
            <p class="mb-1 text-sm text-gray-400">Challenge Types:</p>
            <p-multiSelect
              [options]="availableTypes"
              [(ngModel)]="selectedTypes"
              (onChange)="onTypeChange()"
              optionLabel="label"
              optionValue="value"
              display="chip"
              placeholder="Select Types"
              styleClass="w-full max-w-sm md:w-64"
              [filter]="false"
              [showHeader]="false">
            </p-multiSelect>
          </div>

          @if (generationMode !== 'manual') {
            <button
              (click)="generate()"
              class="rounded-lg bg-yellow-500 px-7 py-2.5 font-bold text-black transition-transform hover:scale-105 md:px-8 md:py-3">
              Generate Challenges
            </button>
          }
        </div>

        <div class="mt-6 w-full text-white">
          <div class="flex flex-col gap-4">
            @if (generationMode === 'manual') {
              @for (challenge of manualChallengeSlots; track $index) {
                <backrooms-challenge-selector-card
                  [challenge]="challenge"
                  [allChallenges]="allChallenges"
                  [activeTypes]="selectedTypes"
                  (challengeChange)="
                    onManualChallengeChange($index, $event)
                  "></backrooms-challenge-selector-card>
              }
            } @else {
              @for (
                challenge of generatedChallenges;
                track challenge.id;
                let i = $index
              ) {
                <backrooms-challenge-display-card
                  [challenge]="challenge"
                  [rerollable]="
                    generationMode === 'all-levels' ||
                    generationMode === 'random'
                  "
                  (reroll)="
                    rerollChallenge(challenge, i)
                  "></backrooms-challenge-display-card>
              }
            }
          </div>
        </div>
      </div>
    </backrooms-page>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    AsyncPipe,
    PageComponent,
    ButtonModule,
    TooltipModule,
    ChallengeDisplayCardComponent,
    ChallengeSelectorCardComponent,
    MultiSelectModule,
    FormsModule,
  ],
})
export class ChallengesPageComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private meta = inject(Meta);
  private title = inject(Title);
  private challengeService = inject(ChallengeService);
  private urlSyncService = inject(UrlSyncService);

  generationMode: 'all-levels' | 'random' | 'manual' = 'all-levels';

  allChallenges: IChallenge[] = [];
  generatedChallenges: IChallenge[] = [];
  manualChallengeSlots: (IChallenge | null)[] = [null, null, null, null];

  availableTypes: SelectItem[] = [];
  selectedTypes: string[] = [];

  ngOnInit(): void {
    this.makeGoogleFriendly();
    this.challengeService
      .getChallenges()
      .pipe(
        switchMap((data) => {
          this.allChallenges = data;
          const uniqueTypes = [...new Set(data.map((c) => c.type))];
          this.availableTypes = uniqueTypes.map((t) => ({
            label: t,
            value: t,
          }));
          return this.urlSyncService.getQueryParams().pipe(take(1));
        }),
      )
      .subscribe((params) => {
        const typesParam = params['types'];
        if (typesParam) {
          this.selectedTypes = typesParam.split(',');
        } else {
          this.selectedTypes = this.availableTypes.map(
            (t) => t.value as string,
          );
        }

        const challengeIds = [
          params['c1'],
          params['c2'],
          params['c3'],
          params['c4'],
        ]
          .filter((id) => !!id)
          .map((id) => parseInt(id, 10));

        if (challengeIds.length > 0) {
          const challengesFromUrl = challengeIds.map(
            (id) => this.allChallenges.find((c) => c.id === id) || null,
          );

          this.generatedChallenges = challengesFromUrl.filter(
            (c) => c !== null,
          ) as IChallenge[];
          // this.manualChallengeSlots = challengesFromUrl; // Removed this line

          // If we load from a URL, default to showing the generated challenges in random mode
          this.generationMode = 'random';
          this.cdr.markForCheck();
        }
      });
  }

  onTypeChange(): void {
    if (this.generationMode === 'manual') {
      this.manualChallengeSlots = [null, null, null, null];
    } else {
      this.generate();
    }
    this.updateUrl();
  }

  setGenerationMode(mode: 'all-levels' | 'random' | 'manual'): void {
    this.generationMode = mode;
    if (mode !== 'manual') {
      // If switching from manual, sync generated from manual slots
      if (this.manualChallengeSlots.some((c) => c !== null)) {
        this.generatedChallenges = this.manualChallengeSlots.filter(
          (c) => c !== null,
        ) as IChallenge[];
      }
      this.generate();
    } else {
      // If switching to manual, sync manual slots from generated
      if (this.generatedChallenges.length > 0) {
        this.manualChallengeSlots = Array.from(
          { length: 4 },
          (_, i) => this.generatedChallenges[i] || null,
        );
      }
    }
    this.cdr.markForCheck();
  }

  generate(): void {
    if (this.generationMode === 'manual') return;

    const filteredChallenges = this.getFilteredChallenges();
    if (filteredChallenges.length < 4 && this.generationMode === 'all-levels') {
      this.generatedChallenges = [];
      this.cdr.markForCheck();
      this.updateUrl();
      return;
    }

    this.generatedChallenges = this.challengeService.generateChallenges(
      this.generationMode,
      filteredChallenges,
    );
    this.cdr.markForCheck();
    this.updateUrl();
  }

  rerollChallenge(challengeToReplace: IChallenge, index: number): void {
    const filteredChallenges = this.getFilteredChallenges();
    const currentChallengeIds = new Set(
      this.generatedChallenges.map((c) => c.id),
    );

    let potentialNewChallenges: IChallenge[] = [];

    if (this.generationMode === 'all-levels') {
      const difficulty = challengeToReplace.difficulty;
      potentialNewChallenges = filteredChallenges.filter(
        (c) => c.difficulty === difficulty && !currentChallengeIds.has(c.id),
      );
    } else if (this.generationMode === 'random') {
      potentialNewChallenges = filteredChallenges.filter(
        (c) => !currentChallengeIds.has(c.id),
      );
    }

    if (potentialNewChallenges.length > 0) {
      const newChallenge =
        potentialNewChallenges[
          Math.floor(Math.random() * potentialNewChallenges.length)
        ];
      this.generatedChallenges[index] = newChallenge;
      this.generatedChallenges = [...this.generatedChallenges];
      this.updateUrl();
    }
  }

  onManualChallengeChange(index: number, challenge: IChallenge | null) {
    this.manualChallengeSlots[index] = challenge;
    this.manualChallengeSlots = [...this.manualChallengeSlots];
    this.updateUrl();
  }

  private getFilteredChallenges(): IChallenge[] {
    if (!this.selectedTypes || this.selectedTypes.length === 0) {
      return [];
    }
    return this.allChallenges.filter((c) =>
      this.selectedTypes.includes(c.type),
    );
  }

  private updateUrl(): void {
    const challengesToSync =
      this.generationMode === 'manual'
        ? this.manualChallengeSlots
        : this.generatedChallenges;

    const params: any = {};

    challengesToSync.forEach((challenge, index) => {
      if (challenge) {
        params[`c${index + 1}`] = challenge.id;
      }
    });

    if (this.selectedTypes.length < this.availableTypes.length) {
      params['types'] = this.selectedTypes.join(',');
    }

    this.urlSyncService.updateUrl(params);
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Backrooms TCG - Challenge Randomizer');
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Use the challenge randomizer to generate a random set of challenges for the Backrooms TCG.',
      },
      { name: 'author', content: 'scottwestover' },
      {
        name: 'keywords',
        content:
          'Backrooms, TCG, Challenge, Randomizer, Generator, Trading Card Game',
      },
    ]);
  }
}

import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICountCard } from '../../../../models';
import {
  GeneratedDeck,
  GeneratedMixedDeck,
} from '../../../services/randomizer.service';

@Component({
  selector: 'backrooms-randomizer-results-header',
  template: `
    @if (deck) {
      @if (isMixedDeck(deck)) {
        <div class="mb-4 rounded-lg bg-gray-800 p-4 text-center">
          <p class="mb-1 text-sm text-gray-400">Deck Results:</p>
          <h2 class="text-xl font-bold text-yellow-400">Mixed Deck</h2>
          <div class="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <p>
              <span class="font-bold">Rooms:</span>
              {{ deck.archetypeNames.rooms }}
            </p>
            <p>
              <span class="font-bold">Items:</span>
              {{ deck.archetypeNames.items }}
            </p>
            <p>
              <span class="font-bold">Entities:</span>
              {{ deck.archetypeNames.entities }}
            </p>
            <p>
              <span class="font-bold">Outcomes:</span>
              {{ deck.archetypeNames.outcomes }}
            </p>
          </div>
        </div>
      } @else {
        <div class="mb-4 rounded-lg bg-gray-800 p-4 text-center">
          <p class="mb-1 text-sm text-gray-400">Deck Results:</p>
          <h2 class="text-xl font-bold text-yellow-400">
            {{ deck.archetypeName }}
          </h2>
        </div>
      }
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
})
export class RandomizerResultsHeaderComponent {
  @Input() deck:
    | ((GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] })
    | null = null;

  isMixedDeck(
    deck: GeneratedDeck | GeneratedMixedDeck,
  ): deck is GeneratedMixedDeck {
    return 'archetypeNames' in deck;
  }
}

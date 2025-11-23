import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
import { BackroomsCard, ICountCard, IDeck } from '../../../models';
import {
  ArchetypeData,
  GeneratedDeck,
  GeneratedMixedDeck,
  RandomizerService,
} from '../../services/randomizer.service';
import { BackroomsCardStore } from '../../store/backrooms-card.store';
import { WebsiteStore } from '../../store/website.store';
import { CardImageComponent } from '../shared/card-image.component';
import { PageComponent } from '../shared/page.component';
import { CardListGalleryComponent } from './components/card-list-gallery.component';
import { CardListTableComponent } from './components/card-list-table.component';
import { RandomizerManualControlsComponent } from './components/randomizer-manual-controls.component';
import { RandomizerResultsHeaderComponent } from './components/randomizer-results-header.component';

interface DeckAsList {
  id: string;
  name: string;
  count: number;
}

@Component({
  selector: 'backrooms-randomizer-page',
  template: `
    <backrooms-page>
      <div class="mx-auto self-baseline px-5 w-full max-w-7xl">
        <h1
          class="text-shadow mt-6 pb-1 text-2xl md:text-4xl font-black text-[#e2e4e6]">
          Deck Randomizer
        </h1>
        <p class="text-md text-gray-400 mb-1">
          Generate a random deck to play with.
        </p>

        <hr />

        <div
          class="my-4 flex flex-col items-center gap-4 md:flex-row md:justify-between md:items-end">
          <div class="flex flex-col items-center">
            <p class="mb-1 text-sm text-gray-400">Randomization Mode:</p>
            <div class="flex items-center justify-center">
              <button
                (click)="setGenerationMode('simple')"
                [ngClass]="{
                  'bg-yellow-500 text-black': generationMode === 'simple',
                  'bg-gray-700 text-white': generationMode !== 'simple'
                }"
                class="rounded-l-lg px-3.5 py-1.5 font-bold transition-colors md:px-4 md:py-2">
                Simple
              </button>
              <button
                (click)="setGenerationMode('mixed')"
                [ngClass]="{
                  'bg-yellow-500 text-black': generationMode === 'mixed',
                  'bg-gray-700 text-white': generationMode !== 'mixed'
                }"
                class="px-3.5 py-1.5 font-bold transition-colors md:px-4 md:py-2">
                Mixed
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

          @if (generationMode !== 'manual') {
            <button
              (click)="generate()"
              class="rounded-lg bg-yellow-500 px-7 py-2.5 font-bold text-black transition-transform hover:scale-105 md:px-8 md:py-3">
              Generate Deck
            </button>
          }
        </div>

        @if (generationMode === 'manual') {
          <backrooms-randomizer-manual-controls
            [archetypes]="archetypes"
            [archetypeKeys]="archetypeKeys"
            [(manualSelections)]="manualSelections"
            (selectionChange)="
              onManualSelectionChange()
            "></backrooms-randomizer-manual-controls>
        }

        @if (generatedDeck) {
          <div class="mt-6 w-full text-white">
            @if (generationMode !== 'manual') {
              <backrooms-randomizer-results-header
                [deck]="generatedDeck"></backrooms-randomizer-results-header>
            }

            <div
              class="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
              <button
                (click)="addToDeckbuilder()"
                class="rounded-lg bg-yellow-500 px-5 py-1.5 font-bold text-black transition-transform hover:scale-105 md:px-6 md:py-2">
                Add to Deckbuilder
              </button>

              <div class="flex flex-col items-center">
                <p class="mb-1 text-sm text-gray-400">Deck View:</p>
                <div class="flex items-center justify-center">
                  <button
                    (click)="cardViewMode = 'images'"
                    [ngClass]="{
                      'bg-yellow-500 text-black': cardViewMode === 'images',
                      'bg-gray-700 text-white': cardViewMode !== 'images'
                    }"
                    class="rounded-l-lg px-3.5 py-1.5 font-bold transition-colors md:px-4 md:py-2">
                    Image View
                  </button>
                  <button
                    (click)="cardViewMode = 'list'"
                    [ngClass]="{
                      'bg-yellow-500 text-black': cardViewMode === 'list',
                      'bg-gray-700 text-white': cardViewMode !== 'list'
                    }"
                    class="rounded-r-lg px-3.5 py-1.5 font-bold transition-colors md:px-4 md:py-2">
                    List View
                  </button>
                </div>
              </div>
            </div>

            @if (cardViewMode === 'images') {
              <backrooms-card-list-gallery
                [cards]="generatedCards"></backrooms-card-list-gallery>
            } @else if (cardViewMode === 'list') {
              <backrooms-card-list-table
                [deckAsList]="generatedDeckAsList"></backrooms-card-list-table>
            }
          </div>
        }
      </div>
    </backrooms-page>
  `,
  styles: [
    `
      .card-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    AsyncPipe,
    PageComponent,
    CardImageComponent,
    FormsModule,
    CardListGalleryComponent,
    CardListTableComponent,
    RandomizerManualControlsComponent,
    RandomizerResultsHeaderComponent,
  ],
})
export class RandomizerPageComponent implements OnInit {
  private router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);

  private randomizerService = inject(RandomizerService);
  private cardStore = inject(BackroomsCardStore);
  private websiteStore = inject(WebsiteStore);

  generationMode: 'simple' | 'mixed' | 'manual' = 'simple';
  cardViewMode: 'images' | 'list' = 'images';

  archetypes: ArchetypeData = {};
  archetypeKeys: string[] = [];
  manualSelections: {
    rooms: string | null;
    items: string | null;
    entities: string | null;
    outcomes: string | null;
  } = { rooms: null, items: null, entities: null, outcomes: null };

  generatedDeck:
    | ((GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] })
    | null = null;
  lastRandomDeck:
    | ((GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] })
    | null = null;

  generatedCards: {
    rooms: BackroomsCard[];
    items: BackroomsCard[];
    entities: BackroomsCard[];
    outcomes: BackroomsCard[];
  } | null = null;

  generatedDeckAsList: {
    rooms: DeckAsList[];
    items: DeckAsList[];
    entities: DeckAsList[];
    outcomes: DeckAsList[];
  } | null = null;

  ngOnInit() {
    this.makeGoogleFriendly();
    this.cardStore.updateCards();
    this.randomizerService.getArchetypes().subscribe((data) => {
      this.archetypes = data;
      this.archetypeKeys = Object.keys(data);
    });
  }

  setGenerationMode(mode: 'simple' | 'mixed' | 'manual') {
    this.generationMode = mode;

    if (mode === 'manual') {
      if (
        this.manualSelections.rooms === null &&
        this.archetypeKeys.length > 0
      ) {
        const defaultKey = this.archetypeKeys[0];
        this.manualSelections = {
          rooms: defaultKey,
          items: defaultKey,
          entities: defaultKey,
          outcomes: defaultKey,
        };
      }
      this.onManualSelectionChange();
    } else {
      this.generatedDeck = this.lastRandomDeck;
      if (this.generatedDeck) {
        this.updateDeckViews(this.generatedDeck.cards);
      } else {
        this.generatedCards = null;
        this.generatedDeckAsList = null;
      }
    }
  }

  generate() {
    let deck: (GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] };
    if (this.generationMode === 'simple') {
      deck = this.randomizerService.generateSimpleDeck(this.archetypes);
    } else {
      deck = this.randomizerService.generateMixedDeck(this.archetypes);
    }
    this.generatedDeck = deck;
    this.lastRandomDeck = deck;
    this.updateDeckViews(deck.cards);
  }

  onManualSelectionChange() {
    const { rooms, items, entities, outcomes } = this.manualSelections;
    if (rooms && items && entities && outcomes) {
      const roomCards = this.archetypes[rooms].rooms;
      const itemCards = this.archetypes[items].items;
      const entityCards = this.archetypes[entities].entities;
      const outcomeCards = this.archetypes[outcomes].outcomes;

      const allCards = [
        ...roomCards,
        ...itemCards,
        ...entityCards,
        ...outcomeCards,
      ];

      this.generatedDeck = {
        archetypeName: 'Manual Mix',
        cards: allCards,
      };

      this.updateDeckViews(allCards);
    }
  }

  private updateDeckViews(cards: ICountCard[]) {
    if (!cards) {
      this.generatedCards = null;
      this.generatedDeckAsList = null;
      return;
    }

    const cardMap = this.cardStore.cardsMap();
    const rooms: BackroomsCard[] = [];
    const items: BackroomsCard[] = [];
    const entities: BackroomsCard[] = [];
    const outcomes: BackroomsCard[] = [];

    const listRooms: DeckAsList[] = [];
    const listItems: DeckAsList[] = [];
    const listEntities: DeckAsList[] = [];
    const listOutcomes: DeckAsList[] = [];

    for (const countCard of cards) {
      const card = cardMap.get(countCard.id);
      if (card) {
        const deckAsListCard = {
          id: card.id,
          name: card.name.english,
          count: countCard.count,
        };

        for (let i = 0; i < countCard.count; i++) {
          if (card.cardType === 'Room') rooms.push(card);
          else if (card.cardType === 'Item') items.push(card);
          else if (card.cardType === 'Entity') entities.push(card);
          else if (card.cardType === 'Outcome') outcomes.push(card);
        }

        if (card.cardType === 'Room') listRooms.push(deckAsListCard);
        else if (card.cardType === 'Item') listItems.push(deckAsListCard);
        else if (card.cardType === 'Entity') listEntities.push(deckAsListCard);
        else if (card.cardType === 'Outcome') listOutcomes.push(deckAsListCard);
      }
    }

    this.generatedCards = { rooms, items, entities, outcomes };
    this.generatedDeckAsList = {
      rooms: listRooms,
      items: listItems,
      entities: listEntities,
      outcomes: listOutcomes,
    };
  }

  addToDeckbuilder() {
    if (!this.generatedDeck) return;

    const newDeck: IDeck = {
      id: uuid.v4(),
      title:
        'archetypeNames' in this.generatedDeck
          ? 'Mixed Random Deck'
          : this.generatedDeck.archetypeName,
      description: 'A randomly generated deck.',
      cards: this.generatedDeck.cards,
      date: new Date().toISOString(),
      user: '',
      userId: '',
      imageCardId: this.generatedDeck.cards[0]?.id ?? 'LL-001',
      docId: '',
    };

    this.websiteStore.updateDeck(newDeck);
    this.router.navigate(['/deckbuilder', newDeck.id]);
  }

  private makeGoogleFriendly() {
    this.title.setTitle('Backrooms TCG - Deck Randomizer');
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Use the deck randomizer to generate a random deck for the Backrooms TCG.',
      },
      { name: 'author', content: 'scottwestover' },
      {
        name: 'keywords',
        content:
          'Backrooms, TCG, Deck, Randomizer, Generator, Trading Card Game',
      },
    ]);
  }
}

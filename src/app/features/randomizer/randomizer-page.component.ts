import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { take } from 'rxjs';
import * as uuid from 'uuid';
import { ICountCard, IDeck, IDeckCard } from '../../../models';
import {
  ArchetypeData,
  GeneratedDeck,
  GeneratedMixedDeck,
  RandomizerService,
} from '../../services/randomizer.service';
import { BackroomsCardStore } from '../../store/backrooms-card.store';
import { DialogStore } from '../../store/dialog.store';
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
            [(overallSelection)]="overallSelection"
            (overallSelectionChange)="onOverallSelectionChange($event)"
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
              <div class="flex gap-2 items-end">
                <button
                  (click)="addToDeckbuilder()"
                  class="rounded-lg bg-yellow-500 px-5 py-1.5 font-bold text-black transition-transform hover:scale-105 md:px-6 md:py-2">
                  Add to Deckbuilder
                </button>
                <button
                  (click)="openExportDeckDialog()"
                  class="p-button-outlined py-1.5 px-3"
                  icon="pi pi-upload"
                  iconPos="left"
                  pButton
                  pTooltip="Click to export this deck!"
                  tooltipPosition="top"></button>
                <button
                  (click)="copyShareLink()"
                  class="p-button-outlined py-1.5 px-3"
                  icon="pi pi-link"
                  iconPos="left"
                  pButton
                  pTooltip="Copy link to this page and share with others!"
                  tooltipPosition="top"></button>
              </div>

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
    ButtonModule, // Added for pButton
    TooltipModule, // Added for pTooltip
    ToastModule, // Added for p-toast
  ],
})
export class RandomizerPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private meta = inject(Meta);
  private title = inject(Title);

  private randomizerService = inject(RandomizerService);
  private cardStore = inject(BackroomsCardStore);
  private websiteStore = inject(WebsiteStore);
  private dialogStore = inject(DialogStore); // Injected DialogStore
  private messageService = inject(MessageService); // Injected MessageService

  generationMode: 'simple' | 'mixed' | 'manual' = 'simple';
  cardViewMode: 'images' | 'list' = 'images';

  archetypes: ArchetypeData = [];
  archetypeKeys: string[] = [];
  overallSelection: string | null = null;
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
    rooms: IDeckCard[];
    items: IDeckCard[];
    entities: IDeckCard[];
    outcomes: IDeckCard[];
  } | null = null;

  generatedDeckAsList: {
    rooms: DeckAsList[];
    items: DeckAsList[];
    entities: DeckAsList[];
    outcomes: DeckAsList[];
  } | null = null;

  isManualDeck = false;

  ngOnInit(): void {
    this.makeGoogleFriendly();
    this.cardStore.updateCards();
    this.randomizerService.getArchetypes().subscribe((data) => {
      this.archetypes = data;
      this.archetypeKeys = data.map((a) => a.id.toString());

      this.route.queryParams.pipe(take(1)).subscribe((params) => {
        const { rooms, items, entities, outcomes } = params;
        if (rooms || items || entities || outcomes) {
          const defaultKey =
            this.archetypeKeys.length > 0 ? this.archetypeKeys[0] : null;

          const selections = {
            rooms: this.archetypeKeys.includes(rooms) ? rooms : defaultKey,
            items: this.archetypeKeys.includes(items) ? items : defaultKey,
            entities: this.archetypeKeys.includes(entities)
              ? entities
              : defaultKey,
            outcomes: this.archetypeKeys.includes(outcomes)
              ? outcomes
              : defaultKey,
          };

          this.manualSelections = selections;
          this.generationMode = 'mixed';
          this.onManualSelectionChange();
          this.cdr.markForCheck();
        }
      });
    });
  }

  setGenerationMode(mode: 'simple' | 'mixed' | 'manual'): void {
    this.generationMode = mode;

    if (mode === 'manual') {
      if (this.generatedDeck) {
        if (this.isMixedDeck(this.generatedDeck)) {
          const mixedDeck = this.generatedDeck;

          this.manualSelections = {
            rooms: this.findArchetypeKeyByName(mixedDeck.archetypeNames.rooms),
            items: this.findArchetypeKeyByName(mixedDeck.archetypeNames.items),
            entities: this.findArchetypeKeyByName(
              mixedDeck.archetypeNames.entities,
            ),
            outcomes: this.findArchetypeKeyByName(
              mixedDeck.archetypeNames.outcomes,
            ),
          };

          const { rooms, items, entities, outcomes } = this.manualSelections;

          if (
            rooms &&
            rooms === items &&
            rooms === entities &&
            rooms === outcomes
          ) {
            this.overallSelection = rooms;
          } else {
            this.overallSelection = null;
          }
        } else {
          // Simple Deck
          const simpleDeck = this.generatedDeck;
          const key = this.findArchetypeKeyByName(simpleDeck.archetypeName);

          this.manualSelections = {
            rooms: key,
            items: key,
            entities: key,
            outcomes: key,
          };

          this.overallSelection = key;
        }
      } else if (
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

        this.overallSelection = defaultKey;
      }

      this.onManualSelectionChange();

      return;
    }

    if (this.isManualDeck) {
      return;
    }

    this.generatedDeck = this.lastRandomDeck;

    if (this.generatedDeck) {
      this.updateDeckViews(this.generatedDeck.cards);
    } else {
      this.generatedCards = null;

      this.generatedDeckAsList = null;
    }
  }

  generate(): void {
    this.isManualDeck = false;

    let deck: (GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] };

    if (this.generationMode === 'simple') {
      deck = this.randomizerService.generateSimpleDeck(this.archetypes);
    } else {
      deck = this.randomizerService.generateMixedDeck(this.archetypes);
    }

    this.generatedDeck = deck;
    this.lastRandomDeck = deck;
    this.updateDeckViews(deck.cards);

    // Update URL and selections
    let selections: {
      rooms: string | null;
      items: string | null;
      entities: string | null;
      outcomes: string | null;
    };

    if (this.isMixedDeck(deck)) {
      selections = {
        rooms: this.findArchetypeKeyByName(deck.archetypeNames.rooms),
        items: this.findArchetypeKeyByName(deck.archetypeNames.items),
        entities: this.findArchetypeKeyByName(deck.archetypeNames.entities),
        outcomes: this.findArchetypeKeyByName(deck.archetypeNames.outcomes),
      };
    } else {
      // Simple deck
      const key = this.findArchetypeKeyByName(deck.archetypeName);
      selections = { rooms: key, items: key, entities: key, outcomes: key };
    }

    this.manualSelections = selections;
    this.updateUrlWithSelections(selections);
  }

  onOverallSelectionChange(archetypeKey: string | null): void {
    this.overallSelection = archetypeKey;

    if (archetypeKey) {
      this.manualSelections = {
        rooms: archetypeKey,
        items: archetypeKey,
        entities: archetypeKey,
        outcomes: archetypeKey,
      };

      this.onManualSelectionChange();
    }
  }

  onManualSelectionChange(): void {
    this.isManualDeck = true;

    const { rooms, items, entities, outcomes } = this.manualSelections;

    if (rooms && items && entities && outcomes) {
      const allSame =
        rooms === items && rooms === entities && rooms === outcomes;

      if (allSame) {
        this.overallSelection = rooms;
      } else {
        this.overallSelection = null;
      }

      // Find archetypes by ID (string representation)
      const roomArchetype = this.archetypes.find(
        (a) => a.id.toString() === rooms,
      );
      const itemArchetype = this.archetypes.find(
        (a) => a.id.toString() === items,
      );
      const entityArchetype = this.archetypes.find(
        (a) => a.id.toString() === entities,
      );
      const outcomeArchetype = this.archetypes.find(
        (a) => a.id.toString() === outcomes,
      );

      if (
        !roomArchetype ||
        !itemArchetype ||
        !entityArchetype ||
        !outcomeArchetype
      ) {
        // Handle error or return if archetypes are not found
        console.error('One or more archetypes not found for manual selection.');
        return;
      }

      const roomCards = roomArchetype.rooms;
      const itemCards = itemArchetype.items;
      const entityCards = entityArchetype.entities;
      const outcomeCards = outcomeArchetype.outcomes;
      const allCards = [
        ...roomCards,
        ...itemCards,
        ...entityCards,
        ...outcomeCards,
      ];

      if (allSame) {
        this.generatedDeck = {
          archetypeName: roomArchetype.name,
          cards: allCards,
        };
      } else {
        this.generatedDeck = {
          archetypeNames: {
            rooms: roomArchetype.name,
            items: itemArchetype.name,
            entities: entityArchetype.name,
            outcomes: outcomeArchetype.name,
          },
          cards: allCards,
        };
      }

      this.updateDeckViews(allCards);
      this.updateUrlWithSelections(this.manualSelections);
    }
  }

  private updateUrlWithSelections(selections: {
    rooms: string | null;
    items: string | null;
    entities: string | null;
    outcomes: string | null;
  }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: selections,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private isMixedDeck(
    deck: GeneratedDeck | GeneratedMixedDeck,
  ): deck is GeneratedMixedDeck {
    return 'archetypeNames' in deck;
  }

  private findArchetypeKeyByName(name: string): string | null {
    return (
      this.archetypes
        .find((archetype) => archetype.name === name)
        ?.id.toString() ?? null
    );
  }

  private updateDeckViews(cards: ICountCard[]): void {
    if (!cards) {
      this.generatedCards = null;
      this.generatedDeckAsList = null;
      return;
    }

    const cardMap = this.cardStore.cardsMap();
    const rooms: IDeckCard[] = [];
    const items: IDeckCard[] = [];
    const entities: IDeckCard[] = [];
    const outcomes: IDeckCard[] = [];
    const listRooms: DeckAsList[] = [];
    const listItems: DeckAsList[] = [];
    const listEntities: DeckAsList[] = [];
    const listOutcomes: DeckAsList[] = [];

    for (const countCard of cards) {
      const card = cardMap.get(countCard.id);

      if (card) {
        const deckCard: IDeckCard = { ...card, count: countCard.count };
        const deckAsListCard = {
          id: card.id,
          name: card.name.english,
          count: countCard.count,
        };

        if (card.cardType.toLowerCase() === 'room') {
          rooms.push(deckCard);

          listRooms.push(deckAsListCard);
        } else if (card.cardType.toLowerCase() === 'item') {
          items.push(deckCard);

          listItems.push(deckAsListCard);
        } else if (card.cardType.toLowerCase() === 'entity') {
          entities.push(deckCard);

          listEntities.push(deckAsListCard);
        } else if (card.cardType.toLowerCase() === 'outcome') {
          outcomes.push(deckCard);

          listOutcomes.push(deckAsListCard);
        }
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

  addToDeckbuilder(): void {
    if (!this.generatedDeck) return;

    // TODO: see if we can re-use the same method we use elsewhere for creating new decks instead of duplicating
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

  openExportDeckDialog(): void {
    if (!this.generatedDeck) return;

    const deckToExport: IDeck = {
      id: uuid.v4(), // Generate a new ID for the exported deck
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

    this.dialogStore.updateExportDeckDialog({
      show: true,
      deck: deckToExport,
    });
  }

  copyShareLink(): void {
    const currentUrl = window.location.origin + this.router.url;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Link Copied!',
          detail: 'The current page link has been copied to your clipboard.',
        });
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Copy Failed!',
          detail: 'Could not copy the link to your clipboard.',
        });
      });
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

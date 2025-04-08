import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { distinctUntilChanged, filter, first, pipe, switchMap } from 'rxjs';
import {
  BackroomsCard,
  DRAG,
  dummyCard,
  emptyDeck,
  IDeck,
  IDraggedCard,
  ISort,
} from '../../models';
import { checkSpecialCardCounts } from '../functions';
import { BackroomsBackendService } from '../services/backrooms-backend.service';

type Website = {
  deck: IDeck;
  mobileCollectionView: boolean;
  addCardToDeck: string;
  sort: ISort;
  communityDeckSearch: string;
  communityDecks: IDeck[];
  draggedCard: IDraggedCard;
};

const initialState: Website = {
  deck: JSON.parse(JSON.stringify(emptyDeck)),
  mobileCollectionView: false,
  addCardToDeck: '',
  sort: {
    sortBy: {
      name: 'ID',
      element: 'id',
    },
    ascOrder: true,
  },
  communityDeckSearch: '',
  communityDecks: [],
  draggedCard: {
    card: JSON.parse(JSON.stringify(dummyCard)),
    drag: DRAG.Collection,
  },
};

export const WebsiteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods(
    (store, backroomsBackendService = inject(BackroomsBackendService)) => ({
      loadCommunityDecks: rxMethod<void>(
        pipe(
          first(),
          distinctUntilChanged(),
          switchMap(() => {
            return backroomsBackendService.getDecks().pipe(
              filter((decks) => decks !== null),
              tapResponse({
                next: (communityDecks) =>
                  patchState(store, (state) => ({ communityDecks })),
                error: () => {},
                finalize: () => {},
              }),
            );
          }),
        ),
      ),

      updateDeck(deck: IDeck): void {
        patchState(store, (state) => ({ deck }));
      },
      updateDeckTitle(title: string): void {
        patchState(store, (state) => ({ deck: { ...state.deck, title } }));
      },
      updateDeckDescription(description: string): void {
        patchState(store, (state) => ({
          deck: { ...state.deck, description },
        }));
      },

      updateMobileCollectionView(mobileCollectionView: boolean): void {
        patchState(store, (state) => ({ mobileCollectionView }));
      },
      updateAddCardToDeck(addCardToDeck: string): void {
        patchState(store, (state) => ({ addCardToDeck }));
      },
      updateSort(sort: ISort): void {
        patchState(store, (state) => ({ sort }));
      },
      updateCommunityDeckSearch(communityDeckSearch: string): void {
        patchState(store, (state) => ({ communityDeckSearch }));
      },
      updateCommunityDecks(communityDecks: IDeck[]): void {
        patchState(store, (state) => ({ communityDecks }));
      },
      updateDraggedCard(draggedCard: IDraggedCard): void {
        patchState(store, (state) => ({ draggedCard }));
      },

      createNewDeck(id: string): void {
        patchState(store, (state) => ({ deck: { ...emptyDeck, id } }));
      },

      addCardToDeck(
        cardToAdd: string,
        cardMap: Map<string, BackroomsCard>,
      ): void {
        patchState(store, (state) => {
          const cards = state.deck.cards.map((card) => {
            if (card.id === cardToAdd) {
              card.count += 1;
            }
            card.count = checkSpecialCardCounts(card, cardMap);
            return card;
          });

          if (!cards.find((card) => card.id === cardToAdd)) {
            cards.push({ id: cardToAdd, count: 1 });
          }

          return { deck: { ...state.deck, cards } };
        });
      },
      removeCardFromDeck(cardToRemove: string): void {
        patchState(store, (state) => {
          const cards = state.deck.cards
            .map((card) => {
              if (card.id === cardToRemove) {
                card.count -= 1;
              }
              return card;
            })
            .filter((card) => card.count > 0);

          return { deck: { ...state.deck, cards } };
        });
      },
    }),
  ),
);

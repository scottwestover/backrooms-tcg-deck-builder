import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { distinctUntilChanged, first, pipe, switchMap } from 'rxjs';
import {
  emptySave,
  emptySettings,
  ICountCard,
  IDeck,
  ISave,
} from '../../models';
import { AuthService } from '../services/auth.service';
import { COLLECTION_MIN } from '../config';

type Save = {
  save: ISave;
  loadedSave: boolean;
  collectionMode: boolean;
  lastUpdatedDeckId: string;
};

const initialState: Save = {
  save: emptySave,
  loadedSave: false,
  collectionMode: false,
  lastUpdatedDeckId: '',
};

export const SaveStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ save }) => ({
    settings: computed(() => emptySettings),
    //collectionMode: computed(() => /*save.settings().collectionMode*/ false),
    collectionMinimum: computed(() => COLLECTION_MIN),
    aaCollectionMinimum: computed(() => COLLECTION_MIN),
    displaySideDeck: computed(() => /*save.settings().displaySideDeck*/ false),
    collection: computed(() => save.collection()),
    decks: computed(() => save.decks()),
  })),

  withMethods(
    (
      store,
      toastrService = inject(ToastrService),
      authService = inject(AuthService),
    ) => ({
      loadSave: rxMethod<void>(
        pipe(
          first(),
          distinctUntilChanged(),
          switchMap(() => {
            return authService.loadSave().pipe(
              tapResponse({
                next: (save) => {
                  // TODO
                  // toastrService.info(
                  //   'Your save was loaded successfully!',
                  //   'Welcome back!',
                  // );

                  patchState(store, {
                    save: {
                      ...save,
                      version: emptySave.version,
                    },
                  });
                },
                error: () => {
                  toastrService.info(
                    'There was an error while loading your save, please refresh the site!',
                    'Save Loading Error!',
                  );
                },
                finalize: () => {
                  patchState(store, { loadedSave: true });
                },
              }),
            );
          }),
        ),
      ),

      updateSave(save: ISave): void {
        patchState(store, (state) => ({ save }));
      },
      updateCollectionMode(collectionMode: boolean): void {
        patchState(store, (state) => ({
          collectionMode,
        }));
      },
      // updateSettings(settings: ISettings): void {
      //   patchState(store, (state) => ({ save: { ...state.save, settings } }));
      // },
      updateCollection(collection: ICountCard[]): void {
        patchState(store, (state) => ({ save: { ...state.save, collection } }));
      },
      updateDeck(decks: IDeck[]): void {
        patchState(store, (state) => ({ save: { ...state.save, decks } }));
      },

      updateCard(id: string, count: number): void {
        patchState(store, (state) => {
          const taken = state.save.collection.find((card) => card.id === id);
          let collection = [...state.save.collection];
          if (taken) {
            // Increase the Cards Count
            collection = state.save.collection.map((card) => {
              if (card.id !== id) {
                return card;
              }
              return { id, count } as ICountCard;
            });
          } else {
            // Create new Card and add it to the state
            const card = { id, count } as ICountCard;
            collection = [...state.save.collection, card];
          }
          return { save: { ...state.save, collection } };
        });
      },
      addCard(card: ICountCard[]): void {
        patchState(store, (state) => {
          const collection = [...state.save.collection, ...card];
          return { save: { ...state.save, collection } };
        });
      },

      importDeck(deck: IDeck): void {
        patchState(store, (state) => {
          // If there are no decks, just add the deck to the array
          if (!state.save.decks) {
            return {
              save: { ...state.save, decks: [deck] },
              lastUpdatedDeckId: deck.id,
            };
          }

          // If you have a deck with the same ID overwrite it
          const foundDeck = state.save.decks?.find(
            (value) => value.id === deck.id,
          );
          if (foundDeck) {
            const allButFoundDeck: IDeck[] = state.save.decks.filter(
              (value) => value.id !== deck.id,
            );
            const decks: IDeck[] = [...new Set([...allButFoundDeck, deck])];
            return {
              save: { ...state.save, decks },
              lastUpdatedDeckId: deck.id,
            };
          }

          // Add the deck to the decks
          return {
            save: {
              ...state.save,
              decks: [...state.save.decks, deck],
            },
            lastUpdatedDeckId: deck.id,
          };
        });
      },
      saveDeck(deck: IDeck): void {
        patchState(store, (state) => {
          // Change the Deck with the same ID
          const decks = state.save.decks.map((value) => {
            if (value?.id === deck.id) {
              return deck;
            }
            return value;
          });

          return {
            save: {
              ...state.save,
              decks: [...new Set(decks)],
            },
            lastUpdatedDeckId: deck.id,
          };
        });
      },
      deleteDeck(deck: IDeck): void {
        patchState(store, (state) => {
          // Make an Array without the deck, which was given
          const decks = [
            ...new Set(state.save.decks.filter((item) => item.id !== deck.id)),
          ];
          return { save: { ...state.save, decks }, lastUpdatedDeckId: deck.id };
        });
      },
    }),
  ),
);

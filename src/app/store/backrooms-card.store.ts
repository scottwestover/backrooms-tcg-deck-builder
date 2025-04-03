import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  setupBackroomsCardMap,
  setupCardJson,
} from '../../assets/cardlists/BackroomCards';
import { BackroomsCard } from '../../models';

type BackroomsCards = {
  cards: BackroomsCard[];
  filteredCards: BackroomsCard[];
  cardsMap: Map<string, BackroomsCard>;
};

const initialState: BackroomsCards = {
  cards: [],
  filteredCards: [],
  cardsMap: new Map<string, BackroomsCard>(),
};

export const BackroomsCardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    updateCards(): void {
      const cards = setupCardJson();
      const filteredCards = cards;
      const cardsMap = setupBackroomsCardMap(cards);
      patchState(store, (state) => ({
        ...state,
        cards,
        filteredCards,
        cardsMap,
      }));
    },
    updateFilteredCards(filteredCards: BackroomsCard[]): void {
      patchState(store, (state) => ({ filteredCards }));
    },
  })),
);

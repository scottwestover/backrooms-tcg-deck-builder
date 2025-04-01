import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  setupDigimonCardMap,
  setupDigimonCards,
} from '../../assets/cardlists/DigimonCards';
import { BackroomsCard, CARDSET } from '../../models';

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

export const DigimonCardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store) => ({
    updateCards(cardset: CARDSET): void {
      const cards = setupDigimonCards(cardset);
      const filteredCards = cards;
      const cardsMap = setupDigimonCardMap(cards);
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

import { ICountCard } from './count-card.interface';
import { IDeck } from './deck.interface';

export interface ISave {
  uid?: string;
  displayName?: string;
  photoURL?: string;
  version?: number;
  collection: ICountCard[];
  decks: IDeck[];
}

export interface ISaveFireStore {
  uid: string;
  displayName: string;
  photoURL?: string;
  version: number;
  collection: string;
}

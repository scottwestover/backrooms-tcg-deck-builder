import { ICountCard } from './count-card.interface';

export interface IDeck {
  id: string;
  cards: ICountCard[];
  title: string;
  description: string;
  date: string;
  user: string;
  userId: string;
  imageCardId: string;
  photoUrl?: string;
}

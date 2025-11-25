import * as uuid from 'uuid';
import { ICountCard, IDeck } from '../../models';
import {
  GeneratedDeck,
  GeneratedMixedDeck,
} from '../services/randomizer.service';

export function createDeckFromGenerated(
  generatedDeck: (GeneratedDeck | GeneratedMixedDeck) & { cards: ICountCard[] },
): IDeck {
  return {
    id: uuid.v4(),
    title:
      'archetypeNames' in generatedDeck
        ? 'Mixed Random Deck'
        : generatedDeck.archetypeName,
    description: 'A randomly generated deck.',
    cards: generatedDeck.cards,
    date: new Date().toISOString(),
    user: '',
    userId: '',
    imageCardId: generatedDeck.cards[0]?.id ?? 'LL-001',
    docId: '',
  };
}

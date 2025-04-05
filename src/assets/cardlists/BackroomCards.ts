import { BackroomsCard } from '../../models';
import LobbyLevelCardsJson from './lobby-level-cards.json';
import CardParkCardsJson from './car-park-cards.json';

export function setupCardJson(): BackroomsCard[] {
  return setupJsonENG();
}

function setupJsonENG(): BackroomsCard[] {
  const cards: BackroomsCard[] = [...LobbyLevelCardsJson, ...CardParkCardsJson];
  return cards;
}

export function setupBackroomsCardMap(
  cards: BackroomsCard[],
): Map<string, BackroomsCard> {
  const cardMap = new Map<string, BackroomsCard>();
  cards.forEach((card) => {
    cardMap.set(card.id, card);
  });
  return cardMap;
}

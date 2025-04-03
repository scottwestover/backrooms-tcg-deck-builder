import { BackroomsCard } from '../../models';
import BackRoomsCardsJson from './backrooms-cards.json';

export function setupCardJson(): BackroomsCard[] {
  return setupJsonENG();
}

function setupJsonENG(): BackroomsCard[] {
  const cards: BackroomsCard[] = [...BackRoomsCardsJson];
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

/* =========================
       Support Functions
   ========================= */
export function addJBeforeWebp(imagePath: string): string {
  if (imagePath.endsWith('.webp') && !imagePath.endsWith('-J.webp')) {
    const index = imagePath.lastIndexOf('.webp');
    return imagePath.slice(0, index) + '-J' + imagePath.slice(index);
  } else {
    // If the imagePath does not end with ".webp", return it as is.
    return imagePath;
  }
}

export function addSampleBeforeWebp(imagePath: string): string {
  if (imagePath.endsWith('.webp') && !imagePath.endsWith('-Sample-J.webp')) {
    const index = imagePath.lastIndexOf('.webp');
    return imagePath.slice(0, index) + '-Sample-J' + imagePath.slice(index);
  } else {
    // If the imagePath does not end with ".webp", return it as is.
    return imagePath;
  }
}

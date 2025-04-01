import { BackroomsCard, CARDSET } from '../../models';
import { DigimonCard } from '../../models';
import DigimonCardsJsonENG from './PreparedDigimonCardsENG.json';

export function setupDigimonCards(cardset: CARDSET): BackroomsCard[] {
  return setupJsonENG();
}

function setupJsonENG(): BackroomsCard[] {
  const digimonCards: BackroomsCard[] = [...DigimonCardsJsonENG];
  return digimonCards;
}

export function setupDigimonCardMap(
  cards: BackroomsCard[],
): Map<string, BackroomsCard> {
  const digimonCardMap = new Map<string, BackroomsCard>();
  cards.forEach((digimonCard) => {
    digimonCardMap.set(digimonCard.id, digimonCard);
  });
  return digimonCardMap;
}

function mapJsonToEngCardList(): Map<string, BackroomsCard> {
  const cards: Map<string, BackroomsCard> = new Map<string, BackroomsCard>();

  const digimonCards: BackroomsCard[] = [...DigimonCardsJsonENG];
  digimonCards.forEach((digimonCard: BackroomsCard) => {
    cards.set(digimonCard.id, digimonCard);
  });

  return cards;
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

import {
  BackroomsCard,
  dummyCard,
  ICountCard,
  IDeck,
  IDeckCard,
  ISelectItem,
  ITag,
  ITournamentDeck,
  tagsList,
} from '../../models';
import { ReleaseOrder } from '../../models/data/release-order.data';
import { ColorOrderMap } from '../../models/maps/color.map';

export function setNewestSet(cards: ICountCard[]): ITag[] {
  const releaseOrder = ReleaseOrder;
  let set = '';
  releaseOrder.forEach((value) => {
    if (set) {
      return;
    }
    if (!cards) {
      return;
    }
    if (cards.find((card) => card.id.includes(value))) {
      set = value;
    }
  });
  const newestTag = tagsList.find((tag) => tag.name === set);
  return newestTag ? [newestTag] : [];
}

export function bannedCardsIncluded(
  cards: ICountCard[],
  allCards: BackroomsCard[],
): boolean {
  let banned = false;
  if (!cards) {
    return false;
  }
  cards.forEach((card) => {
    if (banned) {
      return;
    }

    const foundCard = allCards.find((allCard) => allCard.id === card.id);
    /* TODO Implement
    if (foundCard) {
      banned = foundCard.restriction === 'Banned';
    }*/
  });
  return banned;
}

export function tooManyRestrictedCardsIncluded(
  cards: ICountCard[],
  allCards: BackroomsCard[],
): boolean {
  let restricted = false;
  if (!cards) {
    return false;
  }
  cards.forEach((card) => {
    if (restricted) {
      return;
    }

    const foundCard = allCards.find((allCard) => allCard.id === card.id);
    /* TODO Implement
    if (foundCard) {
      const res = foundCard.restriction === 'Restricted to 1';
      restricted = res ? card.count > 1 : false;
    }*/
  });
  return restricted;
}

export function compareIDs(idA: string, idB: string): boolean {
  const aST = idA.includes('ST');
  const bST = idB.includes('ST');
  if (aST && bST) {
    const splitA = idA.split('-');
    const splitB = idB.split('-');

    const numberA: number = +splitA[0].substring(2) >>> 0;
    const numberB: number = +splitB[0].substring(2) >>> 0;

    return numberA === numberB ? splitA[1] === splitB[1] : false;
  }
  return idA === idB;
}

export function formatId(id: string): string {
  return id.replace('ST0', 'ST').split('_P')[0];
}

export function deckIsValid(deck: IDeck, allCards: BackroomsCard[]): string {
  const cardMap = new Map<string, BackroomsCard>();

  allCards.forEach((card) => {
    cardMap.set(formatId(card.id), card);
  });

  let cardCount = 0;
  let eggCount = 0;

  if (!deck.cards || deck.cards.length === 0) {
    return 'Deck has no cards.';
  }

  deck.cards.forEach((card) => {
    const fullCard = cardMap.get(formatId(card.id));

    if (fullCard) {
      try {
        // if (fullCard.cardType !== 'Digi-Egg') {
        //   cardCount += card.count;
        // } else {
        //   eggCount += card.count;
        // }
        cardCount += card.count;
      } catch (e) {}
    }
  });

  if (cardCount !== 50) {
    return "Deck cannot be shared! You don't have 50 cards.";
  }

  if (eggCount > 5) {
    return 'Deck cannot be shared! You have more than 5 Eggs.';
  }

  if (!deck.title || deck.title === '' || deck.title === 'Imported Deck') {
    return 'Deck cannot be shared! You need a title.';
  }

  return '';
}

export function sortColors(colorA: string, colorB: string): number {
  const a: number = ColorOrderMap.get(colorA) ?? 0;
  const b: number = ColorOrderMap.get(colorB) ?? 0;
  return a - b;
}

export function mapToDeckCards(
  cards: ICountCard[],
  allCards: BackroomsCard[],
): IDeckCard[] {
  const deckCards: IDeckCard[] = [];

  if (!cards) {
    return deckCards;
  }

  cards.forEach((card) => {
    let cardSplit = card.id.split('-');
    const numberNot10But0 =
      cardSplit[0].includes('0') && cardSplit[0] !== 'ST10';
    if (cardSplit[0].includes('ST') && numberNot10But0) {
      let searchId = cardSplit[0].replace('0', '') + '-' + cardSplit[1];
      let found = allCards.find((allCard) => searchId === allCard.id);
      deckCards.push({ ...found, count: card.count } as IDeckCard);
      return;
    }

    let found = allCards.find((allCard) => card.id === allCard.id);
    deckCards.push({ ...found, count: card.count } as IDeckCard);
  });

  return deckCards;
}

export function getCountFromDeckCards(
  deckCards: IDeckCard[] | ICountCard[],
): number {
  let number = 0;
  deckCards.forEach((card) => {
    number += card.count;
  });
  return number;
}

export function colorSort(deck: IDeckCard[]) {
  return deck;
  // const eggs = deck
  //   .filter((card) => card.cardType === 'Digi-Egg')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  // const red = deck
  //   .filter(
  //     (card) => card.color.startsWith('Red') && card.cardType === 'Digimon',
  //   )
  //   .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  // const blue = deck
  //   .filter(
  //     (card) => card.color.startsWith('Blue') && card.cardType === 'Digimon',
  //   )
  //   .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  // const yellow = deck
  //   .filter(
  //     (card) =>
  //       card.color.startsWith('Yellow') && card.cardType === 'Digimon',
  //   )
  //   .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  // const green = deck
  //   .filter(
  //     (card) => card.color.startsWith('Green') && card.cardType === 'Digimon',
  //   )
  //   .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  // const black = deck
  //   .filter(
  //     (card) => card.color.startsWith('Black') && card.cardType === 'Digimon',
  //   )
  //   .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));
  // const purple = deck
  //   .filter(
  //     (card) =>
  //       card.color.startsWith('Purple') && card.cardType === 'Digimon',
  //   )
  //   .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

  // const white = deck
  //   .filter(
  //     (card) => card.color.startsWith('White') && card.cardType === 'Digimon',
  //   )
  //   .sort((a, b) => a.cardLv.localeCompare(b.cardLv) || sortID(a.id, b.id));

  // const tamer = deck
  //   .filter((card) => card.cardType === 'Tamer')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  // const options = deck
  //   .filter((card) => card.cardType === 'Option')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  // return [
  //   ...new Set([
  //     ...eggs,
  //     ...red,
  //     ...blue,
  //     ...yellow,
  //     ...green,
  //     ...black,
  //     ...purple,
  //     ...white,
  //     ...tamer,
  //     ...options,
  //   ]),
  // ];
}

export function levelSort(deck: IDeckCard[]) {
  // const eggs = deck
  //   .filter((card) => card.cardType === 'Digi-Egg')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  // const lv0 = deck
  //   .filter((card) => card.cardLv === '-' && card.cardType === 'Digimon')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  // const lv3 = deck
  //   .filter((card) => card.cardLv === 'Lv.3')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  // const lv4 = deck
  //   .filter((card) => card.cardLv === 'Lv.4')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  // const lv5 = deck
  //   .filter((card) => card.cardLv === 'Lv.5')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  // const lv6 = deck
  //   .filter((card) => card.cardLv === 'Lv.6')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));
  // const lv7 = deck
  //   .filter((card) => card.cardLv === 'Lv.7')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  // const tamer = deck
  //   .filter((card) => card.cardType === 'Tamer')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  // const options = deck
  //   .filter((card) => card.cardType === 'Option')
  //   .sort((a, b) => sortColors(a.color, b.color) || sortID(a.id, b.id));

  return deck;
}

export function setDeckImage(
  deck: IDeck | ITournamentDeck,
  allCards: BackroomsCard[],
): BackroomsCard {
  if (deck.cards && deck.cards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  let deckCards = mapToDeckCards(deck.cards, allCards);

  // deckCards = deckCards
  //   .filter((card) => card.cardType === 'Digimon')
  //   .filter((card) => card.cardLv !== 'Lv.7');

  if (deckCards.length === 0) {
    return JSON.parse(JSON.stringify(dummyCard));
  }
  // try {
  //   deckCards = deckCards.sort(
  //     (a, b) =>
  //       Number(b.cardLv.replace('Lv.', '')) -
  //       Number(a.cardLv.replace('Lv.', '')),
  //   );
  // } catch (e) {}

  return deckCards.length > 0
    ? deckCards[0]
    : JSON.parse(JSON.stringify(dummyCard));
}

export function itemsAsSelectItem(array: string[]): ISelectItem[] {
  return array.map((item) => ({ label: item, value: item }) as ISelectItem);
}

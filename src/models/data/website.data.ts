import * as uuid from 'uuid';
import { BackroomsCard, IDeck } from '../interfaces';

export const dummyCard: BackroomsCard = {
  id: 'LL-001',
  name: {
    english: 'Hallway',
  },
  rarity: 'COMMON',
  types: ['ROOM'],
  ccs: {
    type: 'PP',
    value: '3',
  },
  navigationPoints: '2',
  sanityPoints: '3',
  attackDamage: '',
  health: '',
  cardImage: 'assets/images/cards/lobby-level/LL-001.webp',
  illustrator: 'vignesh652',
  cardNumber: '1001',
  notes: '-',
  version: 'Normal',
  cardType: 'Room',
};

export const emptyDeck: IDeck = {
  id: uuid.v4(),
  title: '',
  description: '',
  date: new Date().toString(),
  cards: [],
  user: '',
  userId: '',
  imageCardId: 'LL-001',
};

export const emptyFilter = {
  searchFilter: '',
  setFilter: [],
  cardCountFilter: [0, 30],
  levelFilter: [2, 7],
  playCostFilter: [0, 20],
  dpFilter: [1, 17],
  rarityFilter: [],
  versionFilter: [],
  keywordFilter: [],
  formFilter: [],
  attributeFilter: [],
  typeFilter: [],
  colorFilter: [],
  cardTypeFilter: [],
  illustratorFilter: [],
  specialRequirementsFilter: [],
  blockFilter: [],
  restrictionsFilter: [],
  sourceFilter: [],
};

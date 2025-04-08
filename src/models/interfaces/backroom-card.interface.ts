export interface AA {
  id: string;
  illustrator: string;
  note: string;
  type: string;
}

export interface DigivolveCondition {
  color: string;
  cost: string;
  level: string;
}

export interface BackroomsCard {
  id: string;
  name: {
    english: string;
  };
  rarity: string;
  types: string[];
  ccs: {
    type: string;
    value: string;
  };
  navigationPoints: string;
  sanityPoints: string;
  attackDamage: string;
  health: string;
  cardImage: string;
  illustrator: string;
  cardNumber: string;
  notes: string;
  version: string;
  cardType: string;
}

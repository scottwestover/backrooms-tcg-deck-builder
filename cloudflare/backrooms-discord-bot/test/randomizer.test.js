import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  generateDeck,
  isMixedDeck,
  formatCardList,
  getDeckbuilderUrl,
  findArchetypeKeyByName,
} from '../src/lib/randomizer.js';
import archetypesData from '../data/archetypes.json' assert { type: 'json' };

describe('Randomizer Library', () => {
  describe('generateDeck', () => {
    it('should generate a simple deck with a valid structure', () => {
      const deck = generateDeck('simple');
      expect(deck).to.have.property('archetypeName').that.is.a('string');
      expect(deck).to.have.property('cards').that.is.an('array');
      expect(isMixedDeck(deck)).to.be.false;
    });

    it('should generate a mixed deck with a valid structure', () => {
      const deck = generateDeck('mixed');
      expect(deck).to.have.property('archetypeNames').that.is.an('object');
      expect(deck.archetypeNames).to.have.all.keys(
        'rooms',
        'items',
        'outcomes',
        'entities',
      );
      expect(deck).to.have.property('cards').that.is.an('array');
      expect(isMixedDeck(deck)).to.be.true;
    });
  });

  describe('formatCardList', () => {
    it('should format a list of cards into a string', () => {
      const cards = [
        { id: 'LL-001', count: 2 },
        { id: 'P-001', count: 1 },
      ];
      const formattedList = formatCardList(cards);
      expect(formattedList).to.include('2x Hallway');
      expect(formattedList).to.include('1x no clip or treat');
    });

    it('should handle an empty card list', () => {
      const formattedList = formatCardList([]);
      expect(formattedList).to.equal('No cards in this deck.');
    });
  });

  describe('getDeckbuilderUrl', () => {
    it('should create a correct URL for a simple deck', () => {
      const deck = {
        archetypeName: 'Pestilence',
        cards: [],
      };
      const url = getDeckbuilderUrl(deck);
      const archetypes = archetypesData.map((archetype) => ({
        ...archetype,
      }));
      const key = findArchetypeKeyByName('Pestilence', archetypes);
      expect(url).to.equal(
        `https://backrooms-tcg-deckbuilder.web.app/randomizer?rooms=${key}&items=${key}&entities=${key}&outcomes=${key}`,
      );
    });

    it('should create a correct URL for a mixed deck', () => {
      const deck = {
        archetypeNames: {
          rooms: 'Pestilence',
          items: 'Holiday Challenge 2023',
          entities: 'Suit Up!',
          outcomes: 'Hounds',
        },
        cards: [],
      };
      const url = getDeckbuilderUrl(deck);
      const archetypes = archetypesData.map((archetype) => ({
        ...archetype,
      }));
      const roomsKey = findArchetypeKeyByName('Pestilence', archetypes);
      const itemsKey = findArchetypeKeyByName(
        'Holiday Challenge 2023',
        archetypes,
      );
      const entitiesKey = findArchetypeKeyByName('Suit Up!', archetypes);
      const outcomesKey = findArchetypeKeyByName('Hounds', archetypes);
      expect(url).to.equal(
        `https://backrooms-tcg-deckbuilder.web.app/randomizer?rooms=${roomsKey}&items=${itemsKey}&entities=${entitiesKey}&outcomes=${outcomesKey}`,
      );
    });
  });
});

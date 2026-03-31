import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  parseFirestoreDocument,
  serializeFirestoreDocument,
} from '../src/lib/firestore.js';

describe('Firestore Utilities', () => {
  describe('parseFirestoreDocument', () => {
    it('should correctly parse a raw Firestore REST API document into a JS object', () => {
      const rawDoc = {
        name: 'projects/my-project/databases/(default)/documents/discordUsers/123',
        fields: {
          version: { integerValue: '1' },
          trials: {
            mapValue: {
              fields: {
                test_trial: {
                  mapValue: {
                    fields: {
                      completedScenario: { booleanValue: true },
                      completedChallenges: {
                        arrayValue: {
                          values: [
                            { stringValue: 'c1' },
                            { stringValue: 'c2' },
                          ],
                        },
                      },
                      completedAt: { timestampValue: '2026-03-18T10:00:00Z' },
                    },
                  },
                },
              },
            },
          },
          level: { integerValue: '5' },
          totalXp: { integerValue: '2500' },
          username: { stringValue: 'testuser' },
        },
        createTime: '2026-03-18T09:00:00Z',
        updateTime: '2026-03-18T09:30:00Z',
      };

      const expectedParsed = {
        version: 1,
        trials: {
          test_trial: {
            completedScenario: true,
            completedChallenges: ['c1', 'c2'],
            completedAt: new Date('2026-03-18T10:00:00Z'),
          },
        },
        level: 5,
        totalXp: 2500,
        username: 'testuser',
      };

      const parsedDoc = parseFirestoreDocument(rawDoc);
      expect(parsedDoc).to.deep.equal(expectedParsed);
    });

    it('should return null for a null or empty document', () => {
      expect(parseFirestoreDocument(null)).to.be.null;
      expect(parseFirestoreDocument({})).to.be.null;
      expect(parseFirestoreDocument({ fields: null })).to.be.null;
    });

    it('should handle documents with missing fields gracefully', () => {
      const rawDoc = {
        fields: {
          username: { stringValue: 'partial' },
          // Missing totalXp, level, trials
        },
      };
      const expectedParsed = {
        username: 'partial',
      };
      expect(parseFirestoreDocument(rawDoc)).to.deep.equal(expectedParsed);
    });

    it('should handle different data types correctly', () => {
      const rawDoc = {
        fields: {
          stringValueField: { stringValue: 'hello' },
          integerValueField: { integerValue: '123' },
          booleanValueField: { booleanValue: true },
          doubleValueField: { doubleValue: 123.45 },
          arrayValueField: {
            arrayValue: {
              values: [
                { stringValue: 'a' },
                { integerValue: '1' },
                { booleanValue: false },
              ],
            },
          },
          emptyArrayValueField: { arrayValue: {} }, // Empty array representation
        },
      };
      const expectedParsed = {
        stringValueField: 'hello',
        integerValueField: 123,
        booleanValueField: true,
        doubleValueField: 123.45,
        arrayValueField: ['a', 1, false],
        emptyArrayValueField: [],
      };
      expect(parseFirestoreDocument(rawDoc)).to.deep.equal(expectedParsed);
    });
  });

  describe('serializeFirestoreDocument', () => {
    it('should correctly serialize a JS object into raw Firestore REST API document format', () => {
      const now = new Date('2026-03-18T10:00:00Z');
      const flatJsObject = {
        version: 1,
        username: 'testuser',
        totalXp: 2500,
        level: 5,
        trials: {
          test_trial: {
            completedScenario: true,
            allChallengesCompleted: false,
            completedAt: now,
            completedChallenges: ['c1', 'c2'],
          },
        },
        stringValueField: 'hello',
        integerValueField: 123,
        booleanValueField: true,
        doubleValueField: 123.45,
        arrayValueField: ['a', 1, false],
        emptyArrayValueField: [],
      };

      const expectedSerialized = {
        fields: {
          version: { integerValue: '1' },
          username: { stringValue: 'testuser' },
          totalXp: { integerValue: '2500' },
          level: { integerValue: '5' },
          trials: {
            mapValue: {
              fields: {
                test_trial: {
                  mapValue: {
                    fields: {
                      completedScenario: { booleanValue: true },
                      allChallengesCompleted: { booleanValue: false },
                      completedAt: { timestampValue: now.toISOString() },
                      completedChallenges: {
                        arrayValue: {
                          values: [
                            { stringValue: 'c1' },
                            { stringValue: 'c2' },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          stringValueField: { stringValue: 'hello' },
          integerValueField: { integerValue: '123' },
          booleanValueField: { booleanValue: true },
          doubleValueField: { doubleValue: 123.45 },
          arrayValueField: {
            arrayValue: {
              values: [
                { stringValue: 'a' },
                { integerValue: '1' },
                { booleanValue: false },
              ],
            },
          },
          emptyArrayValueField: { arrayValue: { values: [] } },
        },
      };

      const serializedDoc = serializeFirestoreDocument(flatJsObject);
      expect(serializedDoc).to.deep.equal(expectedSerialized);
    });

    it('should handle empty objects', () => {
      const flatJsObject = {};
      const expectedSerialized = { fields: {} };
      expect(serializeFirestoreDocument(flatJsObject)).to.deep.equal(
        expectedSerialized,
      );
    });

    it('should handle nested empty objects and arrays', () => {
      const flatJsObject = {
        emptyMap: {},
        emptyArray: [],
      };
      const expectedSerialized = {
        fields: {
          emptyMap: { mapValue: { fields: {} } },
          emptyArray: { arrayValue: { values: [] } },
        },
      };
      expect(serializeFirestoreDocument(flatJsObject)).to.deep.equal(
        expectedSerialized,
      );
    });
  });
});

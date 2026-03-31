import { expect } from 'chai';
import { describe, it } from 'mocha';
import Fuse from 'fuse.js';

describe('Fuzzy Matching Configuration', () => {
  const mockItems = [
    { name: 'No Rare Cards Trial' },
    { name: 'The Silent Hunt' },
    { name: 'Level 1 Challenge' },
    { name: 'Challenge 101' },
    { name: 'From The Dark And Infinite Cold' },
    { name: 'The Infinite Abyss' },
  ];

  const fuseOptions = {
    keys: ['name'],
    threshold: 0.4, // Stricter than default 0.6
    minMatchCharLength: 3, // Require at least 3 characters to match
    includeScore: true,
  };

  it('should find an exact match with a good score', () => {
    const fuse = new Fuse(mockItems, fuseOptions);
    const results = fuse.search('No Rare Cards Trial');
    expect(results).to.not.be.empty; // Ensure results are not empty
    expect(results).to.have.lengthOf(1);
    expect(results[0].item.name).to.equal('No Rare Cards Trial');
    expect(results[0].score).to.be.closeTo(0, 0.1); // Score should be close to 0 for exact match
  });

  it('should find a close match with a minor typo', () => {
    const fuse = new Fuse(mockItems, fuseOptions);
    const results = fuse.search('No Rre Cards Trial'); // "Rre" instead of "Rare"
    expect(results).to.not.be.empty; // Ensure results are not empty
    expect(results).to.have.lengthOf(1);
    expect(results[0].item.name).to.equal('No Rare Cards Trial');
    expect(results[0].score).to.be.below(fuseOptions.threshold);
  });

  it('should find a match with partial input if confident enough', () => {
    const fuse = new Fuse(mockItems, fuseOptions);
    const results = fuse.search('Silent Hunt'); // Partial but good match
    expect(results).to.not.be.empty; // Ensure results are not empty
    expect(results).to.have.lengthOf(1);
    expect(results[0].item.name).to.equal('The Silent Hunt');
    expect(results[0].score).to.be.below(fuseOptions.threshold);
  });

  it('should NOT find a match for input shorter than minMatchCharLength', () => {
    const fuse = new Fuse(mockItems, fuseOptions);
    const results = fuse.search('a');
    expect(results).to.be.empty;

    const results2 = fuse.search('ch');
    expect(results2).to.be.empty;
  });

  it('should NOT find a match for truly irrelevant input', () => {
    const fuse = new Fuse(mockItems, fuseOptions);
    const results = fuse.search('zxcvb');
    expect(results).to.be.empty;
  });

  it('should find partial matches if threshold allows, even with minMatchCharLength', () => {
    const fuse = new Fuse(mockItems, fuseOptions);
    const results = fuse.search('Cards'); // "Cards" is a word in "No Rare Cards Trial"
    expect(results).to.not.be.empty;
    expect(results[0].item.name).to.equal('No Rare Cards Trial');
    expect(results[0].score).to.be.below(fuseOptions.threshold); // Ensure it's a valid match by score
  });

  it('should find "Challenge" related items with sufficient input', () => {
    const fuse = new Fuse(mockItems, fuseOptions);
    const results = fuse.search('Challenge');
    // Expecting to find both 'Level 1 Challenge' and 'Challenge 101' but the order may vary based on score
    const matchedNames = results.map((r) => r.item.name);
    expect(matchedNames).to.include('Level 1 Challenge');
    expect(matchedNames).to.include('Challenge 101');
    expect(results).to.have.lengthOf(2);
  });
});

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { calculateTrialResults } from '../src/lib/gamification.js';

describe('Gamification Library', () => {
  const mockTrial = {
    id: 'test_trial',
    name: 'Test Trial',
    challenges: [
      { id: 'c1', name: 'Challenge 1', xp: 100 },
      { id: 'c2', name: 'Challenge 2', xp: 100 },
      { id: 'c3', name: 'Challenge 3', xp: 150 },
    ],
  };
  const username = 'testuser';

  describe('calculateTrialResults', () => {
    it('should process a first-time completion for a new user', () => {
      const completed = [mockTrial.challenges[0]]; // Complete C1
      const results = calculateTrialResults(
        null,
        mockTrial,
        completed,
        username,
      );

      expect(results.isNoOp).to.be.undefined;
      expect(results.xpGained).to.equal(100 + 50); // 100 for C1 + 50 participation
      expect(results.newTotalXp).to.equal(150);
      expect(results.newLevel).to.equal(0);
      expect(results.achievementsEarned).to.have.lengthOf(1);
      expect(results.achievementsEarned[0].name).to.equal(
        'Scenario Participation',
      );

      const userTrials = results.updatedUser.trials;
      expect(userTrials[mockTrial.id]).to.exist;
      const progress = userTrials[mockTrial.id];
      expect(progress.completedScenario).to.be.true;
      expect(progress.completedChallenges).to.deep.equal(['c1']);
    });

    it('should process a subsequent completion', () => {
      const existingUser = {
        username: username,
        totalXp: 150,
        level: 0,
        trials: {
          [mockTrial.id]: {
            completedScenario: true,
            completedChallenges: ['c1'],
          },
        },
      };
      const completed = [mockTrial.challenges[1]]; // Complete C2
      const results = calculateTrialResults(
        existingUser,
        mockTrial,
        completed,
        username,
      );

      expect(results.xpGained).to.equal(100); // Just 100 for C2
      expect(results.newTotalXp).to.equal(250);
      expect(results.achievementsEarned).to.be.empty;

      const progress = results.updatedUser.trials[mockTrial.id];
      expect(progress.completedChallenges).to.have.members(['c1', 'c2']);
    });

    it('should award a full completion bonus', () => {
      const existingUser = {
        username: username,
        totalXp: 250,
        level: 0,
        trials: {
          [mockTrial.id]: {
            completedScenario: true,
            completedChallenges: ['c1', 'c2'],
          },
        },
      };
      const completed = [mockTrial.challenges[2]]; // Complete C3 (the last one)
      const results = calculateTrialResults(
        existingUser,
        mockTrial,
        completed,
        username,
      );

      expect(results.xpGained).to.equal(150 + 150); // 150 for C3 + 150 full completion
      expect(results.newTotalXp).to.equal(550);
      expect(results.newLevel).to.equal(1);
      expect(results.isFullCompletion).to.be.true;
      expect(results.achievementsEarned).to.be.empty;
    });

    it('should return no-op if no new challenges are completed but preserve user data', () => {
      const existingUser = {
        username: username,
        totalXp: 150,
        level: 0,
        trials: {
          [mockTrial.id]: {
            completedScenario: true,
            completedChallenges: ['c1'],
          },
          other_trial: {
            completedScenario: true,
            completedChallenges: ['x1'],
          },
        },
      };
      const completed = [mockTrial.challenges[0]]; // Re-submit C1
      const results = calculateTrialResults(
        existingUser,
        mockTrial,
        completed,
        username,
      );

      expect(results.isNoOp).to.be.true;
      expect(results.updatedUser).to.exist;
      expect(results.updatedUser.username).to.equal(existingUser.username);
      expect(results.updatedUser.totalXp).to.equal(existingUser.totalXp);
      expect(results.updatedUser.level).to.equal(existingUser.level);
      // Ensure other trials are preserved
      expect(results.updatedUser.trials['other_trial']).to.deep.equal(
        existingUser.trials['other_trial'],
      );
      // Ensure the current trial's progress is also preserved
      expect(results.updatedUser.trials[mockTrial.id]).to.deep.equal(
        existingUser.trials[mockTrial.id],
      );
    });
  });
});

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  calculateTrialResults,
  createTrialResponseEmbed,
} from '../src/lib/gamification.js';

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
      expect(results.isLevelUp).to.be.false;
      expect(results.isTrialFullyCompleted).to.be.false;

      const userTrials = results.updatedUser.trials;
      expect(userTrials[mockTrial.id]).to.exist;
      const progress = userTrials[mockTrial.id];
      expect(progress.completedScenario).to.be.true;
      expect(progress.completedChallenges).to.deep.equal(['c1']);
    });

    it('should process a subsequent completion without level up or full trial completion', () => {
      const existingUser = {
        username: username,
        totalXp: 150,
        level: 0,
        trials: {
          [mockTrial.id]: {
            completedScenario: true,
            completedChallenges: ['c1'],
            allChallengesCompleted: false,
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
      expect(results.isLevelUp).to.be.false;
      expect(results.isTrialFullyCompleted).to.be.false;

      const progress = results.updatedUser.trials[mockTrial.id];
      expect(progress.completedChallenges).to.have.members(['c1', 'c2']);
    });

    it('should award a full completion bonus and detect level up and full trial completion', () => {
      const existingUser = {
        username: username,
        totalXp: 250, // 250 XP is below 500 XP_PER_LEVEL for level 1
        level: 0,
        trials: {
          [mockTrial.id]: {
            completedScenario: true,
            completedChallenges: ['c1', 'c2'],
            allChallengesCompleted: false, // Not fully completed yet
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
      expect(results.isLevelUp).to.be.true;
      expect(results.isTrialFullyCompleted).to.be.true;

      const progress = results.updatedUser.trials[mockTrial.id];
      expect(progress.allChallengesCompleted).to.be.true;
    });

    it('should not detect full trial completion if already completed', () => {
      const existingUser = {
        username: username,
        totalXp: 550,
        level: 1,
        trials: {
          [mockTrial.id]: {
            completedScenario: true,
            completedChallenges: ['c1', 'c2', 'c3'],
            allChallengesCompleted: true, // Already fully completed
          },
        },
      };
      // Re-submit the same challenges (no new challenges, but simulates re-submission)
      const completed = [
        mockTrial.challenges[0],
        mockTrial.challenges[1],
        mockTrial.challenges[2],
      ];
      const results = calculateTrialResults(
        existingUser,
        mockTrial,
        completed,
        username,
      );

      expect(results.isNoOp).to.be.true;
      expect(results.updatedUser.totalXp).to.equal(existingUser.totalXp); // No XP gain
      expect(results.isLevelUp).to.be.false;
      expect(results.isTrialFullyCompleted).to.be.false;
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
      expect(results.isLevelUp).to.be.false; // No level up for no-op
      expect(results.isTrialFullyCompleted).to.be.false; // No full completion for no-op
    });
  });

  describe('createTrialResponseEmbed', () => {
    it('should correctly format the progress bar for level progress', () => {
      const mockResults = {
        isNoOp: false,
        xpGained: 150,
        newTotalXp: 1050,
        newLevel: 2,
        newlyCompletedChallenges: [],
        previouslyCompletedChallenges: [],
        allTrialChallenges: [],
        isFullCompletion: false,
        achievementsEarned: [],
        trialName: 'Test Trial',
        username: 'testuser',
        oldLevel: 1, // Simulating a level up from 1 to 2, or just being at level 2
        isLevelUp: true,
        isTrialFullyCompleted: false,
      };

      const embed = createTrialResponseEmbed(mockResults);
      const progressField = embed.fields.find(
        (field) => field.name === '🔥 XP & Level',
      );

      expect(progressField).to.exist;
      expect(progressField.value).to.include(
        'Run: 150 XP | Total: 1050 / 1500 XP',
      );
      // XP into current level (1050 - (2 * 500)) = 50
      // Progress percent = (50 / 500) * 100 = 10%
      expect(progressField.value).to.include('Level Progress: ▓░░░░░░░░░ 10%');
    });
  });
});

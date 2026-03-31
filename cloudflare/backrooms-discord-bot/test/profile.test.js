import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createProfileEmbed } from '../src/lib/profile.js';

// Mock data for trials
const mockTrials = [
  {
    id: 'trial1',
    name: 'The First Trial',
    challenges: ['challenge1_1', 'challenge1_2', 'challenge1_3'],
  },
  {
    id: 'trial2',
    name: 'The Second Trial',
    challenges: ['challenge2_1', 'challenge2_2'],
  },
  {
    id: 'trial3',
    name: 'The Third Trial',
    challenges: ['challenge3_1'],
  },
  {
    id: 'trial4',
    name: 'The Fourth Trial',
    challenges: ['challenge4_1', 'challenge4_2'],
  },
  {
    id: 'trial5',
    name: 'The Fifth Trial',
    challenges: ['challenge5_1'],
  },
  {
    id: 'trial6',
    name: 'The Sixth Trial',
    challenges: ['challenge6_1'],
  },
];

describe('createProfileEmbed', () => {
  it('should create a basic profile embed for a user with no trials', () => {
    const discordUser = {
      username: 'TestUser',
      totalXp: 0,
      level: 0,
      trials: {},
    };

    const embed = createProfileEmbed(discordUser, mockTrials);

    expect(embed.title).to.equal("🎮 **TestUser's Profile**");
    expect(embed.description).to.equal('**Level 0 | 0 XP**\n░░░░░░░░░░ 0% to next level');
    expect(embed.fields[0].value).to.equal('🏅 Scenario Participation: 0\n🥇 All Challenges Completed: 0');
    expect(embed.fields[1].value).to.equal('No trials attempted yet.');
    expect(embed.fields[2].value).to.equal('Total Challenges Completed: 0\nTotal Trials Completed: 0');
  });

  it('should create a profile embed for a user with completed and partially completed trials', () => {
    const discordUser = {
      username: 'TrialMaster',
      totalXp: 1200,
      level: 2,
      trials: {
        trial1: {
          completedChallenges: ['challenge1_1', 'challenge1_2', 'challenge1_3'],
          allChallengesCompleted: true,
          completedAt: 1678886400000, // March 15, 2023 12:00:00 PM GMT
        },
        trial2: {
          completedChallenges: ['challenge2_1'],
          allChallengesCompleted: false,
          completedAt: 1678799999000, // March 14, 2023 11:59:59 PM GMT
        },
      },
    };

    const embed = createProfileEmbed(discordUser, mockTrials);

    expect(embed.title).to.equal("🎮 **TrialMaster's Profile**");
    expect(embed.description).to.equal('**Level 2 | 1200 XP**\n▓▓▓▓░░░░░░ 40% to next level');
    expect(embed.fields[0].value).to.equal('🏅 Scenario Participation: 2\n🥇 All Challenges Completed: 1');
    expect(embed.fields[1].value).to.include('- The First Trial: 3/3 challenges completed ✅');
    expect(embed.fields[1].value).to.include('- The Second Trial: 1/2 challenges completed');
    expect(embed.fields[2].value).to.equal('Total Challenges Completed: 4\nTotal Trials Completed: 1');
  });

  it('should handle more than MAX_TRIALS_TO_DISPLAY trials', () => {
    const discordUser = {
      username: 'ManyTrials',
      totalXp: 5000,
      level: 10,
      trials: {
        trial1: { completedChallenges: ['c'], allChallengesCompleted: true, completedAt: 1 },
        trial2: { completedChallenges: ['c'], allChallengesCompleted: true, completedAt: 2 },
        trial3: { completedChallenges: ['c'], allChallengesCompleted: true, completedAt: 3 },
        trial4: { completedChallenges: ['c'], allChallengesCompleted: true, completedAt: 4 },
        trial5: { completedChallenges: ['c'], allChallengesCompleted: true, completedAt: 5 },
        trial6: { completedChallenges: ['c'], allChallengesCompleted: true, completedAt: 6 },
      },
    };

    const embed = createProfileEmbed(discordUser, mockTrials);
    expect(embed.fields[1].value).to.include('... and 1 more.');
  });

  it('should handle null userTrials', () => {
    const discordUser = {
      username: 'NullTrials',
      totalXp: 100,
      level: 0,
      trials: null,
    };

    const embed = createProfileEmbed(discordUser, mockTrials);
    expect(embed.fields[1].value).to.equal('No trials attempted yet.');
  });
});
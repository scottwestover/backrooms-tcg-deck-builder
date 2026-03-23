/**
 * This library contains the logic for generating a user's profile.
 */
import trials from '../../data/wander-trials.json' assert { type: 'json' };

const XP_PER_LEVEL = 500;

const MAX_TRIALS_TO_DISPLAY = 5;

/**
 * Creates the Discord embed for the user's profile.
 * @param {object} discordUser The user object from Firestore.
 * @returns {object} A Discord embed object.
 */
export function createProfileEmbed(discordUser) {
  const { username, totalXp, level, trials: userTrials } = discordUser;

  // Basic Info
  const xpForNextLevel = (level + 1) * XP_PER_LEVEL;
  const progressToNextLevelXp = totalXp - level * XP_PER_LEVEL;
  const progressPercent = Math.floor(
    (progressToNextLevelXp / XP_PER_LEVEL) * 100
  );
  const progressBar =
    '▓'.repeat(Math.floor(progressPercent / 10)) +
    '░'.repeat(10 - Math.floor(progressPercent / 10));

  // Trial Progress
  const completedTrials = Object.keys(userTrials || {}).length;
  let challengesCompleted = 0;
  let fullCompletions = 0;
  if (userTrials) {
    for (const trialId in userTrials) {
      const trialProgress = userTrials[trialId];
      if (trialProgress.completedChallenges) {
        challengesCompleted += trialProgress.completedChallenges.length;
      }
      if (trialProgress.allChallengesCompleted) {
        fullCompletions++;
      }
    }
  }

  let trialProgressString;
  const userTrialEntries = Object.entries(userTrials || {});

  if (userTrialEntries.length > 0) {
    trialProgressString = userTrialEntries
      .sort(([, a], [, b]) => b.completedAt - a.completedAt)
      .slice(0, MAX_TRIALS_TO_DISPLAY)
      .map(([trialId, progress]) => {
        const trial = trials.find((t) => t.id === trialId);
        if (!trial) return '';

        const challengeCount = trial.challenges.length;
        const completedCount = progress.completedChallenges.length;

        if (progress.allChallengesCompleted) {
          return `- ${trial.name}: ${completedCount}/${challengeCount} challenges completed ✅`;
        }
        return `- ${trial.name}: ${completedCount}/${challengeCount} challenges completed`;
      })
      .join('\n');

    if (userTrialEntries.length > MAX_TRIALS_TO_DISPLAY) {
      trialProgressString += `\n... and ${
        userTrialEntries.length - MAX_TRIALS_TO_DISPLAY
      } more.`;
    }
  } else {
    trialProgressString = 'No trials attempted yet.';
  }

  const embed = {
    title: `🎮 **${username}'s Profile**`,
    color: 0x5865f2, // Discord Blue
    description: `**Level ${level} | ${totalXp} XP**\n${progressBar} ${progressPercent}% to next level`,
    fields: [
      {
        name: '🏆 **Achievements**',
        value: `🏅 Scenario Participation: ${completedTrials}\n🥇 All Challenges Completed: ${fullCompletions}`,
        inline: false,
      },
      {
        name: '📜 **Wander Trials Progress**',
        value: trialProgressString,
        inline: false,
      },
      {
        name: '🔥 **Stats**',
        value:
          `Total XP: ${totalXp}\n` +
          `Total Challenges Completed: ${challengesCompleted}\n` +
          `Total Trials Completed: ${fullCompletions}`,
        inline: false,
      },
    ],
  };
  return embed;
}

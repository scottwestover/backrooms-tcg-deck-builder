/**
 * This library contains the core logic for the Wander Trials gamification system.
 */

const SCENARIO_PARTICIPATION_BONUS = 50;
const FULL_COMPLETION_BONUS = 150;
const XP_PER_LEVEL = 500;

/**
 * Processes a trial completion attempt, calculates XP, and determines achievements.
 */
export function calculateTrialResults(
  discordUser,
  trial,
  completedChallenges,
  username,
) {
  const now = new Date();

  // 1. Initialize user if they are new, or copy existing user data
  // All user data should be in flattened JS object format at this point
  const user = discordUser
    ? { ...discordUser, trials: discordUser.trials || {} }
    : {
        username: username,
        totalXp: 0,
        level: 0,
        trials: {},
        version: 1, // Start with version 1
      };

  // Capture old state for milestone detection
  const oldLevel = user.level;
  const oldFullCompletionStatus =
    user.trials[trial.id]?.allChallengesCompleted || false;

  // Get previous progress for this trial
  // Default to empty object if trial progress doesn't exist yet
  const trialProgress = user.trials[trial.id] || {};
  const previouslyCompletedIds = trialProgress.completedChallenges || [];

  // 2. Determine newly completed challenges (based on IDs)
  const newlyCompletedChallenges = completedChallenges.filter(
    (c) => !previouslyCompletedIds.includes(c.id),
  );

  if (newlyCompletedChallenges.length === 0) {
    // If no new challenges were completed, return a no-op result
    // Ensure that the original user object is still returned to prevent data loss
    return {
      isNoOp: true,
      updatedUser: user, // Return the original user object
      trialName: trial.name,
      // Provide previously completed challenges for the embed message
      previouslyCompleted: trial.challenges.filter((c) =>
        previouslyCompletedIds.includes(c.id),
      ),
      allTrialChallenges: trial.challenges,
      username: user.username, // Include username even for no-op
      oldLevel: oldLevel,
      oldFullCompletionStatus: oldFullCompletionStatus,
      isLevelUp: false, // No level up in no-op
      isTrialFullyCompleted: false, // No new full completion in no-op
    };
  }
  // 3. Calculate XP
  let xpGained = 0;
  const achievements = [];

  // XP for newly completed challenges
  const challengeXp = newlyCompletedChallenges.reduce(
    (sum, c) => sum + c.xp,
    0,
  );
  xpGained += challengeXp;

  // Scenario participation bonus (first time completing any challenge in this trial)
  if (!trialProgress.completedScenario) {
    xpGained += SCENARIO_PARTICIPATION_BONUS;
    achievements.push({
      name: 'Scenario Participation',
      xp: SCENARIO_PARTICIPATION_BONUS,
    });
  }

  // Check for full completion bonus
  const allChallengeIdsInTrial = trial.challenges.map((c) => c.id);
  const finalCompletedIds = [
    ...new Set([
      ...previouslyCompletedIds,
      ...newlyCompletedChallenges.map((c) => c.id),
    ]),
  ]; // Use Set to ensure unique IDs

  const isFullCompletion = allChallengeIdsInTrial.every((id) =>
    finalCompletedIds.includes(id),
  );

  if (isFullCompletion && !trialProgress.allChallengesCompleted) {
    xpGained += FULL_COMPLETION_BONUS;
  }

  // 4. Update user's total XP, level, and trial progress
  const newTotalXp = user.totalXp + xpGained;
  const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL);

  // Update specific trial progress
  const updatedTrialProgress = {
    ...trialProgress, // Carry over any existing properties
    completedScenario: true,
    allChallengesCompleted: isFullCompletion,
    completedAt: now,
    completedChallenges: finalCompletedIds, // Store just the IDs
  };

  // Update the user object
  const updatedUser = {
    ...user,
    username: username, // Ensure username is always current
    totalXp: newTotalXp,
    level: newLevel,
    trials: {
      ...user.trials, // Copy existing trials
      [trial.id]: updatedTrialProgress, // Update/add progress for this trial
    },
  };

  // Milestone detection
  const isLevelUp = newLevel > oldLevel;
  const isTrialFullyCompleted = isFullCompletion && !oldFullCompletionStatus;

  // Prepare data for the embed
  return {
    updatedUser, // This is now a flattened JS object
    xpGained,
    newTotalXp,
    newLevel,
    newlyCompletedChallenges,
    previouslyCompletedChallenges: trial.challenges.filter((c) =>
      previouslyCompletedIds.includes(c.id),
    ),
    allTrialChallenges: trial.challenges,
    isFullCompletion,
    achievementsEarned: achievements,
    trialName: trial.name,
    username: user.username, // Include username for announcements
    oldLevel: oldLevel,
    isLevelUp: isLevelUp,
    isTrialFullyCompleted: isTrialFullyCompleted,
  };
}

/**
 * Creates the Discord embed for the trial completion response.
 */
export function createTrialResponseEmbed(results) {
  if (results.isNoOp) {
    const description =
      'You already submitted these challenges. Keep going!\n\n' +
      results.previouslyCompleted.map((c) => `✅ ${c.name}`).join('\n');
    return {
      title: `"${results.trialName}" — No New Progress`,
      description,
      color: 0xfeb737, // Yellow
    };
  }

  const allCompleted = [
    ...results.previouslyCompletedChallenges,
    ...results.newlyCompletedChallenges,
  ];

  const completedField = {
    name: '✅ Challenges Completed',
    value: `${allCompleted.length} / ${results.allTrialChallenges.length} (+${results.newlyCompletedChallenges.reduce((sum, c) => sum + c.xp, 0)} XP)`,
    inline: false,
  };

  const achievementStrings = results.achievementsEarned.map(
    (a) => `🏅 ${a.name} (+${a.xp} XP)`,
  );

  if (results.isFullCompletion) {
    achievementStrings.push(
      `🏅 All Challenges Completed (+${FULL_COMPLETION_BONUS} XP)`,
    );
  } else {
    achievementStrings.push('❌ All Challenges Completed (locked)');
  }

  const achievementsField = {
    name: '🏆 Achievements',
    value: achievementStrings.join('\n'),
    inline: false,
  };

  const remainingChallenges = results.allTrialChallenges.filter(
    (c) => !allCompleted.map((ac) => ac.id).includes(c.id),
  );
  const remainingField = {
    name: '⏳ Remaining Challenges',
    value:
      remainingChallenges.length > 0
        ? remainingChallenges.map((c) => `🔲 ${c.name}`).join('\n')
        : 'None! You finished the trial! 🎉',
    inline: false,
  };

  const xpForCurrentLevelStart = results.newLevel * XP_PER_LEVEL;
  const xpIntoCurrentLevel = results.newTotalXp - xpForCurrentLevelStart;
  const progressPercent = Math.floor((xpIntoCurrentLevel / XP_PER_LEVEL) * 100);
  const progressBar =
    '▓'.repeat(Math.floor(progressPercent / 10)) +
    '░'.repeat(10 - Math.floor(progressPercent / 10));

  const progressField = {
    name: '🔥 XP & Level',
    value:
      `Run: ${results.xpGained} XP | Total: ${results.newTotalXp} / ${(results.newLevel + 1) * XP_PER_LEVEL} XP\n` +
      `Level Progress: ${progressBar} ${progressPercent}%`,
    inline: false,
  };

  return {
    title: `🎨 ${results.trialName} — Run Summary`,
    color: 0x5a9bd5,
    fields: [completedField, achievementsField, remainingField, progressField],
    footer: {
      text: 'Keep going! Complete all challenges for full XP and achievements.',
    },
  };
}

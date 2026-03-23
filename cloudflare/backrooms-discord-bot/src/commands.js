/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

export const DECK_RANDOM_COMMAND = {
  name: 'deck-random',
  description: 'Generate a random deck.',
  options: [
    {
      name: 'mode',
      description: 'The randomization mode to use.',
      type: 3,
      required: true,
      choices: [
        {
          name: 'Simple',
          value: 'simple',
        },
        {
          name: 'Mixed',
          value: 'mixed',
        },
      ],
    },
  ],
};

export const INVITE_COMMAND = {
  name: 'invite',
  description: 'Get an invite link to add the bot to your server',
};

export const COMPLETE_TRIAL_COMMAND = {
  name: 'complete-trial',
  description: 'Complete a Wander Trial to earn XP and achievements.',
  options: [
    {
      name: 'trial-name',
      description: 'The name of the trial you completed.',
      type: 3,
      required: true,
    },
  ],
};

export const PROFILE_COMMAND = {
  name: 'profile',
  description: 'View your profile.',
};

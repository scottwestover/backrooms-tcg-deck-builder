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

export const LIST_SCENARIOS_COMMAND = {
  name: 'list-scenarios',
  description: 'List all available wander trials (scenarios).',
};

export const SCENARIO_CHALLENGES_COMMAND = {
  name: 'scenario-challenges',
  description: 'View challenges for a specific scenario and their completion status.',
  options: [
    {
      name: 'scenario-name',
      description: 'The name of the scenario.',
      type: 3, // String type
      required: true,
      autocomplete: true,
    },
  ],
};

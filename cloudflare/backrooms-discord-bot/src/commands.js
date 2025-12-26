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
      type: 3, // STRING
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
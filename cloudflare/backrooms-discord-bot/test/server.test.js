import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import {
  InteractionResponseType,
  InteractionType,
  InteractionResponseFlags,
  MessageComponentTypes,
} from 'discord-interactions';
import {
  DECK_RANDOM_COMMAND,
  INVITE_COMMAND,
  LIST_SCENARIOS_COMMAND,
  SCENARIO_CHALLENGES_COMMAND,
  HELP_COMMAND,
  GETTING_STARTED_COMMAND,
} from '../src/commands.js';
import sinon from 'sinon';
import server from '../src/server.js';
import trials from '../data/wander-trials.json' assert { type: 'json' };
import { calculateTrialResults } from '../src/lib/gamification.js';

describe('Server', () => {
  let sandbox;

  describe('GET /', () => {
    it('should return a greeting message with the Discord application ID', async () => {
      const request = {
        method: 'GET',
        url: new URL('/', 'http://discordo.example'),
      };
      const env = { DISCORD_APPLICATION_ID: '123456789' };

      const response = await server.fetch(request, env);
      const body = await response.text();

      expect(body).to.equal('👋 123456789');
    });
  });

  describe('POST /', () => {
    let verifyDiscordRequestStub;
    let mockEnv;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      verifyDiscordRequestStub = sandbox.stub(server, 'verifyDiscordRequest');
      mockEnv = {
        DISCORD_PUBLIC_KEY: 'mock-public-key',
        DISCORD_APPLICATION_ID: '123456789',
        // Add other env variables as needed for specific tests
      };
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should return 401 if request signature is invalid (isValid: false)', async () => {
      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: false,
        interaction: null,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.text();
      expect(response.status).to.equal(401);
      expect(body).to.equal('Bad request signature.');
    });

    it('should return 401 if interaction is null (e.g., body parsing failed)', async () => {
      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: null,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.text();
      expect(response.status).to.equal(401);
      expect(body).to.equal('Bad request signature.');
    });

    it('should handle a PING interaction', async () => {
      const interaction = {
        type: InteractionType.PING,
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      const env = mockEnv;

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, env);
      const body = await response.json();
      expect(body.type).to.equal(InteractionResponseType.PONG);
    });

    it('should handle an invite command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: INVITE_COMMAND.name,
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      const env = mockEnv;

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, env);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.content).to.include(
        'https://discord.com/oauth2/authorize?client_id=123456789&scope=applications.commands',
      );
      expect(body.data.flags).to.equal(InteractionResponseFlags.EPHEMERAL);
    });

    it('should handle a deck-random command interaction for mixed deck', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: DECK_RANDOM_COMMAND.name,
          options: [{ name: 'mode', value: 'mixed' }],
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.embeds[0].title).to.equal('Mixed Deck');
      expect(body.data.embeds[0].description).to.include('Rooms:');
      expect(body.data.embeds[0].description).to.include('Items:');
      expect(body.data.embeds[0].description).to.include('Entities:');
      expect(body.data.embeds[0].description).to.include('Outcomes:');
      expect(body.data.components[0].components[0].label).to.equal(
        'Open in Deckbuilder',
      );
    });

    it('should handle a deck-random command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: DECK_RANDOM_COMMAND.name,
          options: [{ value: 'simple' }],
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.embeds[0].title).to.be.a('string');
      expect(body.data.embeds[0].description).to.be.a('string');
      expect(body.data.components[0].components[0].label).to.equal(
        'Open in Deckbuilder',
      );
    });

    it('should handle a list-scenarios command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: LIST_SCENARIOS_COMMAND.name,
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.embeds[0].title).to.equal('Available Wander Trials');
      expect(body.data.embeds[0].description).to.include(
        'Entities From Outer Space',
      );
      expect(body.data.embeds[0].description).to.include('Shades Of An Artist');
      expect(body.data.embeds[0].color).to.equal(0xfeb737);
    });

    it('should handle autocomplete for scenario-challenges command with partial input', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE,
        data: {
          name: SCENARIO_CHALLENGES_COMMAND.name,
          options: [{ name: 'scenario-name', value: 'shade', focused: true }],
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
      );
      expect(body.data.choices).to.be.an('array');
      expect(body.data.choices).to.have.lengthOf.at.least(1);
      expect(body.data.choices[0].name).to.include('Shades Of An Artist');
    });

    it('should handle scenario-challenges command and display completed challenges', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: SCENARIO_CHALLENGES_COMMAND.name,
          options: [{ name: 'scenario-name', value: 'Shades Of An Artist' }],
        },
        member: { user: { id: 'testuser123' } },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      // Mock getDiscordUser to return a user with some completed challenges
      sandbox.stub(server.firestoreService, 'getDiscordUser').resolves({
        trials: {
          2: {
            completedChallenges: ['trial_2_challenge_1', 'trial_2_challenge_3'],
          },
        },
      });

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.embeds[0].title).to.equal(
        'Shades Of An Artist Challenges',
      );
      expect(body.data.embeds[0].fields).to.be.an('array');
      expect(body.data.embeds[0].fields).to.have.lengthOf(4); // 4 challenges in 'Shades Of An Artist'

      // Verify completion status for specific challenges
      const challenge1 = body.data.embeds[0].fields.find(
        (f) => f.name === 'Four Faces In The Dark',
      );
      expect(challenge1.value).to.equal('✅ Completed');

      const challenge2 = body.data.embeds[0].fields.find(
        (f) => f.name === 'Three Faces In A Corner',
      );
      expect(challenge2.value).to.equal('❌ Not Completed');

      const challenge3 = body.data.embeds[0].fields.find(
        (f) => f.name === 'Two Faces In A Hallway',
      );
      expect(challenge3.value).to.equal('✅ Completed');
    });

    it('should handle a help command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: HELP_COMMAND.name,
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.embeds[0].title).to.equal('Bot Commands Help');
      expect(body.data.embeds[0].fields).to.be.an('array');
      expect(body.data.embeds[0].fields).to.have.lengthOf(7); // Check number of commands listed
      expect(body.data.flags).to.equal(InteractionResponseFlags.EPHEMERAL);
    });

    it('should handle a getting-started command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: GETTING_STARTED_COMMAND.name,
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.embeds[0].title).to.equal(
        'Getting Started with the Wander Trials Bot',
      );
      expect(body.data.embeds[0].fields).to.be.an('array');
      expect(body.data.embeds[0].fields).to.have.lengthOf(4); // Check number of steps
      expect(body.data.flags).to.equal(InteractionResponseFlags.EPHEMERAL);
    });

    it('should handle a COMPLETE_TRIAL_COMMAND when trial is found', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: 'complete-trial',
          options: [{ name: 'trial-name', value: 'Entities From Outer Space' }],
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.content).to.include(
        'Found trial: **Entities From Outer Space**',
      );
      expect(body.data.flags).to.equal(InteractionResponseFlags.EPHEMERAL);
      expect(body.data.components[0].type).to.equal(
        MessageComponentTypes.ACTION_ROW,
      );
      expect(body.data.components[0].components[0].type).to.equal(
        MessageComponentTypes.STRING_SELECT,
      );
      expect(body.data.components[0].components[0].custom_id).to.equal(
        'select_challenges_1',
      );
      expect(body.data.components[0].components[0].options).to.have.lengthOf(3);
    });

    it('should handle a COMPLETE_TRIAL_COMMAND when trial is NOT found', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: 'complete-trial',
          options: [{ name: 'trial-name', value: 'NonExistent Trial' }],
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(body.type).to.equal(
        InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      );
      expect(body.data.content).to.equal(
        'Trial "NonExistent Trial" not found.',
      );
      expect(body.data.flags).to.equal(InteractionResponseFlags.EPHEMERAL);
    });

    it('should handle an unknown command interaction', async () => {
      const interaction = {
        type: InteractionType.APPLICATION_COMMAND,
        data: {
          name: 'unknown',
        },
      };

      const request = {
        method: 'POST',
        url: new URL('/', 'http://discordo.example'),
      };

      verifyDiscordRequestStub.resolves({
        isValid: true,
        interaction: interaction,
      });

      const response = await server.fetch(request, mockEnv);
      const body = await response.json();
      expect(response.status).to.equal(400);
      expect(body.error).to.equal('Unknown Type');
    });

    describe('Community Achievement Announcements', () => {
      let updateDiscordUserStub;
      let fetchStub;

      const mockTrial = {...trials[0]};

      beforeEach(() => {
        // Stubs for functions called in the server
        updateDiscordUserStub = sandbox.stub(
          server.firestoreService,
          'updateDiscordUser',
        );
        sandbox
          .stub(server.firestoreService, 'serializeFirestoreDocument')
          .returnsArg(0); // Return the object as is

        // Mock global.fetch for Discord API calls
        fetchStub = sandbox.stub(global, 'fetch').resolves({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        });

        // Add announcement specific env variables
        mockEnv.ANNOUNCEMENT_CHANNEL_ID = 'mock-announcement-channel-id';
        mockEnv.SUPPORTED_DISCORD_SERVER_ID = 'mock-guild-id';
        mockEnv.DISCORD_TOKEN = 'mock-discord-token';
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('should send a level-up announcement when isLevelUp is true', async () => {
        sandbox
          .stub(server.firestoreService, 'getDiscordUser')
          .resolves({ username: 'testuser', totalXp: 400, level: 0, trials: {} });

        const interaction = {
          type: InteractionType.MESSAGE_COMPONENT,
          data: {
            custom_id: `select_challenges_${mockTrial.id}`,
            values: [mockTrial.challenges[0].id],
          },
          member: { user: { id: 'testuser123' } },
          guild_id: 'mock-guild-id',
        };
        const request = {
          method: 'POST',
          url: new URL('/', 'http://discordo.example'),
        };

        verifyDiscordRequestStub.resolves({
          isValid: true,
          interaction: interaction,
        });

        await server.fetch(request, mockEnv);

        expect(fetchStub.calledOnce).to.be.true;
        const [url, options] = fetchStub.getCall(0).args;
        expect(url).to.include(
          `/channels/${mockEnv.ANNOUNCEMENT_CHANNEL_ID}/messages`,
        );
        expect(options.method).to.equal('POST');
        expect(options.headers.Authorization).to.equal(
          `Bot ${mockEnv.DISCORD_TOKEN}`,
        );
        const body = JSON.parse(options.body);
        expect(body.embeds[0].title).to.include('⬆️ testuser reached Level 1!');
        expect(body.embeds[0].description).to.include('Total XP: 550');
      });

      it('should send a full trial completion announcement when isTrialFullyCompleted is true', async () => {
                sandbox
          .stub(server.firestoreService, 'getDiscordUser')
          .resolves({ username: 'testuser', totalXp: 500, level: 1, trials: {
            '1': {
              completedChallenges: [mockTrial.challenges[0].id, mockTrial.challenges[1].id]
            },
          } });

        const interaction = {
          type: InteractionType.MESSAGE_COMPONENT,
          data: {
            custom_id: `select_challenges_${mockTrial.id}`,
            values: [mockTrial.challenges[0].id, mockTrial.challenges[1].id, mockTrial.challenges[2].id],
          },
          member: { user: { id: 'testuser123' } },
          guild_id: 'mock-guild-id',
        };
        const request = {
          method: 'POST',
          url: new URL('/', 'http://discordo.example'),
        };

        verifyDiscordRequestStub.resolves({
          isValid: true,
          interaction: interaction,
        });

        await server.fetch(request, mockEnv);

        expect(fetchStub.calledOnce).to.be.true;
        const [url, options] = fetchStub.getCall(0).args;
        expect(url).to.include(
          `/channels/${mockEnv.ANNOUNCEMENT_CHANNEL_ID}/messages`,
        );
        expect(options.method).to.equal('POST');
        expect(options.headers.Authorization).to.equal(
          `Bot ${mockEnv.DISCORD_TOKEN}`,
        );
        const body = JSON.parse(options.body);
        expect(body.embeds[0].title).to.include(
          `🏆 testuser completed all challenges in "${mockTrial.name}"!`,
        );
        expect(body.embeds[0].description).to.include(
          'Wander Trial fully cleared!',
        );
      });

      it('should send both level-up and full trial completion announcements when both are true', async () => {
                        sandbox
          .stub(server.firestoreService, 'getDiscordUser')
          .resolves({ username: 'testuser', totalXp: 0, level: 0, trials: {} });
        const interaction = {
          type: InteractionType.MESSAGE_COMPONENT,
          data: {
            custom_id: `select_challenges_${mockTrial.id}`,
            values: [mockTrial.challenges[0].id, mockTrial.challenges[1].id, mockTrial.challenges[2].id],
          },
          member: { user: { id: 'testuser123' } },
          guild_id: 'mock-guild-id',
        };

        const request = {
          method: 'POST',
          url: new URL('/', 'http://discordo.example'),
        };

        verifyDiscordRequestStub.resolves({
          isValid: true,
          interaction: interaction,
        });

        await server.fetch(request, mockEnv);

        expect(fetchStub.calledTwice).to.be.true;

        // Check first call (Level Up)
        const [url1, options1] = fetchStub.getCall(0).args;
        expect(url1).to.include(
          `/channels/${mockEnv.ANNOUNCEMENT_CHANNEL_ID}/messages`,
        );
        const body1 = JSON.parse(options1.body);
        expect(body1.embeds[0].title).to.include(
          '⬆️ testuser reached Level 1!',
        );

        // Check second call (Trial Completion)
        const [url2, options2] = fetchStub.getCall(1).args;
        expect(url2).to.include(
          `/channels/${mockEnv.ANNOUNCEMENT_CHANNEL_ID}/messages`,
        );
        const body2 = JSON.parse(options2.body);
        expect(body2.embeds[0].title).to.include(
          `🏆 testuser completed all challenges in "${mockTrial.name}"!`,
        );
      });

      it('should not send announcements if ANNOUNCEMENT_CHANNEL_ID is not set', async () => {
        const interaction = {
          type: InteractionType.MESSAGE_COMPONENT,
          data: {
            custom_id: `select_challenges_${mockTrial.id}`,
            values: ['c1'],
          },
          member: { user: { id: 'testuser123' } },
          guild_id: 'mock-guild-id',
        };

        const request = {
          method: 'POST',
          url: new URL('/', 'http://discordo.example'),
        };

        verifyDiscordRequestStub.resolves({
          isValid: true,
          interaction: interaction,
        });
        mockEnv.ANNOUNCEMENT_CHANNEL_ID = undefined; // Unset the channel ID

        await server.fetch(request, mockEnv);

        expect(fetchStub.called).to.be.false;
      });

      it('should not send announcements if SUPPORTED_DISCORD_SERVER_ID is not set', async () => {
        const interaction = {
          type: InteractionType.MESSAGE_COMPONENT,
          data: {
            custom_id: `select_challenges_${mockTrial.id}`,
            values: ['c1'],
          },
          member: { user: { id: 'testuser123' } },
          guild_id: 'mock-guild-id',
        };

        const request = {
          method: 'POST',
          url: new URL('/', 'http://discordo.example'),
        };

        verifyDiscordRequestStub.resolves({
          isValid: true,
          interaction: interaction,
        });
        mockEnv.SUPPORTED_DISCORD_SERVER_ID = undefined; // Unset the server ID

        await server.fetch(request, mockEnv);

        expect(fetchStub.called).to.be.false;
      });

      it('should not send announcements if guild_id does not match SUPPORTED_DISCORD_SERVER_ID', async () => {
        const interaction = {
          type: InteractionType.MESSAGE_COMPONENT,
          data: {
            custom_id: `select_challenges_${mockTrial.id}`,
            values: ['c1'],
          },
          member: { user: { id: 'testuser123' } },
          guild_id: 'other-guild-id', // Mismatched guild ID
        };

        const request = {
          method: 'POST',
          url: new URL('/', 'http://discordo.example'),
        };

        verifyDiscordRequestStub.resolves({
          isValid: true,
          interaction: interaction,
        });

        await server.fetch(request, mockEnv);

        expect(fetchStub.called).to.be.false;
      });

      it('should not send announcements if neither milestone is met', async () => {
        const interaction = {
          type: InteractionType.MESSAGE_COMPONENT,
          data: {
            custom_id: `select_challenges_${mockTrial.id}`,
            values: ['c1'],
          },
          member: { user: { id: 'testuser123' } },
          guild_id: 'mock-guild-id',
        };

        const request = {
          method: 'POST',
          url: new URL('/', 'http://discordo.example'),
        };

        verifyDiscordRequestStub.resolves({
          isValid: true,
          interaction: interaction,
        });

        await server.fetch(request, mockEnv);

        expect(fetchStub.called).to.be.false;
      });
    });

    describe('All other routes', () => {
      it('should return a "Not Found" response', async () => {
        const request = {
          method: 'GET',
          url: new URL('/unknown', 'http://discordo.example'),
        };
        const response = await server.fetch(request, {});
        expect(response.status).to.equal(404);
        const body = await response.text();
        expect(body).to.equal('Not Found.');
      });
    });
  });
});

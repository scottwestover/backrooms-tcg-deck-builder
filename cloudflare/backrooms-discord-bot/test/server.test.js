import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
  InteractionResponseFlags,
  MessageComponentTypes,
} from 'discord-interactions';
import {
  DECK_RANDOM_COMMAND,
  INVITE_COMMAND,
} from '../src/commands.js';
import sinon from 'sinon';
import server from '../src/server.js';

describe('Server', () => {
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
      verifyDiscordRequestStub = sinon.stub(server, 'verifyDiscordRequest');
      mockEnv = {
        DISCORD_PUBLIC_KEY: 'mock-public-key',
        DISCORD_APPLICATION_ID: '123456789',
        // Add other env variables as needed for specific tests
      };
    });

    afterEach(() => {
      verifyDiscordRequestStub.restore();
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
      expect(body.data.content).to.equal('Trial "NonExistent Trial" not found.');
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

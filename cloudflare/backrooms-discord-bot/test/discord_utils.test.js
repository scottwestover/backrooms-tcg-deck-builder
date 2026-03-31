import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getDiscordUserId, getDiscordUserName } from '../src/lib/discord.js';

describe('Discord Utility Functions', () => {
  describe('getDiscordUserId', () => {
    it('should return the user ID from a server interaction', () => {
      const interaction = {
        member: { user: { id: 'serverUserId123' } },
        user: { id: 'dmUserId456' }, // This should be ignored in server context
      };
      expect(getDiscordUserId(interaction)).to.equal('serverUserId123');
    });

    it('should return the user ID from a direct message interaction', () => {
      const interaction = {
        user: { id: 'dmUserId456' },
      };
      expect(getDiscordUserId(interaction)).to.equal('dmUserId456');
    });

    it('should return undefined if no user ID is found', () => {
      const interaction = {
        member: { user: {} },
        user: {},
      };
      expect(getDiscordUserId(interaction)).to.be.undefined;
    });

    it('should return undefined for a null interaction', () => {
      expect(getDiscordUserId(null)).to.be.undefined;
    });

    it('should return undefined for an undefined interaction', () => {
      expect(getDiscordUserId(undefined)).to.be.undefined;
    });
  });

  describe('getDiscordUserName', () => {
    it('should return the nick from a server interaction', () => {
      const interaction = {
        member: {
          nick: 'ServerNick',
          user: { global_name: 'ServerGlobalName', username: 'ServerUsername' },
        },
        user: { username: 'DMUsername' },
      };
      expect(getDiscordUserName(interaction)).to.equal('ServerNick');
    });

    it('should return the global_name from a server interaction if nick is missing', () => {
      const interaction = {
        member: {
          user: { global_name: 'ServerGlobalName', username: 'ServerUsername' },
        },
        user: { username: 'DMUsername' },
      };
      expect(getDiscordUserName(interaction)).to.equal('ServerGlobalName');
    });

    it('should return the username from a server interaction if nick and global_name are missing', () => {
      const interaction = {
        member: { user: { username: 'ServerUsername' } },
        user: { username: 'DMUsername' },
      };
      expect(getDiscordUserName(interaction)).to.equal('ServerUsername');
    });

    it('should return the username from a direct message interaction', () => {
      const interaction = {
        user: { username: 'DMUsername' },
      };
      expect(getDiscordUserName(interaction)).to.equal('DMUsername');
    });

    it('should return undefined if no username is found', () => {
      const interaction = {
        member: { user: {} },
        user: {},
      };
      expect(getDiscordUserName(interaction)).to.be.undefined;
    });

    it('should return undefined for a null interaction', () => {
      expect(getDiscordUserName(null)).to.be.undefined;
    });

    it('should return undefined for an undefined interaction', () => {
      expect(getDiscordUserName(undefined)).to.be.undefined;
    });
  });
});

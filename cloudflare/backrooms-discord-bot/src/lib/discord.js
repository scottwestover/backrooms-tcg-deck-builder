export function getDiscordUserId(interaction) {
  // if invoked in a server context
  if (
    interaction &&
    interaction.member &&
    interaction.member.user &&
    interaction.member.user.id
  ) {
    return interaction.member.user.id;
  }
  // if invoked directly
  if (interaction && interaction.user && interaction.user.id) {
    return interaction.user.id;
  }
  return undefined;
}

export function getDiscordUserName(interaction) {
  if (!interaction) {
    return undefined;
  }
  // if invoked in a server context
  if (interaction && interaction.member && interaction.member.nick) {
    return interaction.member.nick;
  }
  if (interaction && interaction.member && interaction.member.user) {
    return (
      interaction.member.user.global_name || interaction.member.user.username
    );
  }
  // if invoked directly
  if (interaction && interaction.user && interaction.user.username) {
    return interaction.user.username;
  }
  return undefined;
}

export async function sendDiscordMessage(channelId, embed, env) {
  if (!channelId || !embed || !env || !env.DISCORD_TOKEN) {
    console.error('Missing required parameters for sendDiscordMessage');
    return;
  }

  const DISCORD_API_URL = 'https://discord.com/api/v10';

  try {
    const response = await fetch(
      `${DISCORD_API_URL}/channels/${channelId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${env.DISCORD_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embeds: [embed] }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Failed to send Discord message: ${response.status} ${response.statusText}`,
        errorData,
      );
    } else {
      console.log('Discord message sent successfully.');
    }
  } catch (error) {
    console.error('Error sending Discord message:', error);
  }
}

export function createLevelUpEmbed(username, newLevel, totalXp) {
  return {
    title: `⬆️ ${username} reached Level ${newLevel}!`,
    description: `Total XP: ${totalXp}\nKeep completing challenges to level up.`,
    color: 0x57f287, // Green
  };
}

export function createTrialCompletionEmbed(username, trialName) {
  return {
    title: `🏆 ${username} completed all challenges in "${trialName}"!`,
    description: `Wander Trial fully cleared!`,
    color: 0x992d22, // Red
  };
}

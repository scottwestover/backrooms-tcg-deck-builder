export function getDiscordUserId(interaction) {
    // if invoked in a server context
    if (interaction && interaction.member && interaction.member.user && interaction.member.user.id) {
        return interaction.member.user.id;
    }
    // if invoked directly
    if (interaction && interaction.user && interaction.user.id) {
        return interaction.user.id;
    }
    return undefined;
}

export function getDiscordUserName(interaction) {
    const displayName = interaction.member.nick || interaction.member.user.global_name || member.user.username;
    if (displayName) {
        return displayName;
    }

    // if invoked in a server context
    if (interaction && interaction.member && interaction.member.nick) {
        return interaction.member.nick;
    }
    if (interaction && interaction.member && interaction.member.global_name) {
        return interaction.member.global_name;
    }
    if (interaction && interaction.member && interaction.member.user && interaction.member.user.username) {
        return interaction.member.user.username;
    }
    // if invoked directly
    if (interaction && interaction.user && interaction.user.username) {
        return interaction.user.username;
    }
    return undefined;
}
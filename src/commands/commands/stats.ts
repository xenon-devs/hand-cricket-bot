import { Message, MessageEmbed } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import DBL from 'dblapi.js';

export function setStats(
  client: DiscordClient,
  dbl: DBL | null
) {
  return setCommand(
    client,
    'stats',
    'Stats about the bot.',
    '',
    async (msg: Message) => {
      const matchesPlayed = client.matchesDB.getMatches();

      const statsEmbed = new MessageEmbed()
        .setTitle('Hand Cricketer Stats')
        .addField('Servers', `\`${client.guilds.cache.array().length}\``, true)
        .addField('Users', `\`${client.guilds.cache.array().map(guild => guild.memberCount).reduce((a, b) => a + b)}\``, true)
        .addField('1P Matches Played', `\`${matchesPlayed.singlePlayer}\``)
        .addField('2P Matches Played', `\`${matchesPlayed.multiPlayer}\``)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('RED');

      if (dbl !== null) {
        const botStats = await dbl.getBot(client.user.id);
        statsEmbed.addField(`top.gg votes`, `\`${botStats.points}\``, true);

        if (botStats.invite) statsEmbed.addField('Vote and Invite', `[top.gg](https://top.gg/bot/${client.user.id})`, true);
      }

      msg.channel.send(statsEmbed);
    }
  )
}

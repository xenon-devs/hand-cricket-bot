import { Message, MessageEmbed } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import DBL from 'dblapi.js';

export function setStats(
  client: DiscordClient,
  dbl: DBL | null
) {
  client.onCommand('stats', '', async (msg: Message) => {
    const statsEmbed = new MessageEmbed()
      .setTitle('Hand Cricketer Stats')
      .addField('Servers', `\`${client.guilds.cache.array().length}\``, true)
      .addField('Users', `\`${client.guilds.cache.array().map(guild => guild.memberCount).reduce((a, b) => a + b)}\``, true)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('RED');

    if (dbl !== null) {
      const botStats = await dbl.getBot(client.user.id);
      statsEmbed.addField(`top.gg votes`, `\`${botStats.points}\``, true);

      if (botStats.invite) statsEmbed.addField('Vote and Invite', `[top.gg](https://top.gg/bot/${client.user.id})`, true);
    }

    msg.channel.send(statsEmbed);
  })

  return {
    name: 'stats',
    desc: `Stats about the bot.`
  }
}

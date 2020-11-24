import { Message, MessageEmbed } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { SinglePlayerMatch } from '../../game/single-player/single-player';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';

export function setOngoing(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>
) {
  return setCommand(
    client,
    'ongoing',
    'Lists the number of currently ongoing single and multi player matches.',
    '',
    (msg: Message) => {
      msg.channel.send(
        new MessageEmbed()
        .setTitle(`Ongoing Matches`)
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setColor('RED')
        .addFields([
          { name: 'Single Player', value: `\`${current1PMatches.size}\``, inline: true},
          { name: 'Multi Player', value: `\`${current2PMatches.size}\``, inline: true}
        ])
      )
    }
  )
}

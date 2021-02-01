import { Message, MessageEmbed, User, TextChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { SinglePlayerMatch } from '../../game/single-player/single-player';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';
import { GlobalMatch } from '../../game/global/global';
import { send } from '../../util/rate-limited-send';

export function setOngoing(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>,
  currentGlobalMatches: Map<string, GlobalMatch>,
  matchmakingQueue: User[]
) {
  return setCommand(
    client,
    'ongoing',
    'Lists the number of currently ongoing single and multi player matches.',
    '',
    (msg: Message) => {
      send(
        <TextChannel>msg.channel,
        new MessageEmbed()
        .setTitle(`Ongoing Matches`)
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()
        .setColor('RED')
        .addFields([
          { name: 'Single Player', value: `\`${current1PMatches.size}\``, inline: true},
          { name: 'Multi Player', value: `\`${current2PMatches.size}\``, inline: true},
          { name: 'Global Matches', value: `\`${currentGlobalMatches.size}\``, inline: true},
          { name: 'Matchmaking Queue', value: `\`${matchmakingQueue.length}\``, inline: true}
        ])
      )
    }
  )
}

import { MessageEmbed, Message, TextChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { version } from '../../../package.json';
import { send } from '../../util/rate-limited-send';

const lastUpdated = '27 Nov 2020';
const desc = `\
If you have *absolutey any* suggestions, you can let us know in the support server (link in help command) or on Github(link in help command).
`

const changes = [
  { name: 'Global Matches!', value: 'Now you can play against any player globally! See the help command' },
  { name: 'Leaderboard Reaction Menu', value: 'The leaderboard is now a reaction menu.' },
  { name: 'Leaderboard Expansion', value: 'The leaderboard now contains high scores for each of the three game modes - Test Match, Super Over and T-5' },
  { name: 'Next', value: 'Further Expansion of Leaderboard - More stats.' }
]

export function setNew(client: DiscordClient) {
  return setCommand(
    client,
    'new',
    'A list of changes to the bot.',
    '',
    (msg: Message) => {
      send(
        <TextChannel>msg.channel,
        new MessageEmbed()
        .setTitle(`What's New`)
        .setDescription(desc)
        .addFields(changes)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('BLUE')
        .setFooter(`Version: v${version} | Last Updated: ${lastUpdated}`, 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
        .setTimestamp()
      )
    }
  )
}

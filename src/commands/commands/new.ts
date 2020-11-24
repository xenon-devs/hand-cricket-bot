import { MessageEmbed, Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { version } from '../../../package.json';

const lastUpdated = '23 Nov 2020';
const desc = `\
If you have *absolutey any* suggestions, you can let us know in the support server (link in help command) or on Github(link in help command).
`

const changes = [
  { name: 'Leaderboard', value: 'We added a `leaderboard` command that shows discord\'s top Hand Cricketers :wink:' },
  { name: 'Matches Played', value: 'You can find out the number of matches played using the `stats` command.' },
  { name: 'Next', value: 'Someone suggested to add a feature to choose the number of overs, or test match. This feature is on our list.' }
]

export function setNew(client: DiscordClient) {
  return setCommand(
    client,
    'new',
    'A list of changes to the bot.',
    '',
    (msg: Message) => {
      msg.channel.send(
        new MessageEmbed()
        .setTitle(`What's New`)
        .setDescription(desc)
        .addFields(changes)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('BLUE')
        .setFooter(`Version: v${version} | Last Updated: ${lastUpdated}`)
        .setTimestamp()
      )
    }
  )
}

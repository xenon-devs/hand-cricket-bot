import { MessageEmbed, Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { version } from '../../../package.json';

const lastUpdated = '10 Nov 2020';
const desc = `\
If you have *absolutey any* suggestions, you can let us know in the support server (link in help command) or on Github(link in help command).
`

const changes = [
  { name: 'Commentary', value: 'Newer randomized comments have been added.' },
  { name: 'Next', value: 'Someone suggested to add a feature to choose the number of overs, or test match. This feature is on our list.' }
]

export function setNew(client: DiscordClient) {
  client.onCommand(
    'new',
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

  return {
    name: 'new',
    desc: `A list of changes to the bot.`
  }
}

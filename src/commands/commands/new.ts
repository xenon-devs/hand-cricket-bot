import { MessageEmbed, Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { version } from '../../../package.json';

const lastUpdated = '18 Oct 2020';
const desc = `\
Because of the AMAZING growth, we have refactored the bot's code. In simple language, it means that it becomes easier for us to add new features.
If you have *absolutey any* suggestions, you can let us know in the support server (link in help command) or on Github(link in help command).
`

const changes = [
  { name: 'Scoreboard', value: 'The scoreboard now displays the number of overs in each innings, has been cleaned up and is even displayed for single player matches' },
  { name: 'Commentary', value: 'Instead of the bot talking directly, there will be a commentator :wink:. This feature will be updated over time with randomized commentary etc.', },
  { name: 'Forfeit', value: 'A new `forfeit` command has been added to quit an ongoing match.', },
  { name: 'Misc', value: 'A few more small commands such as `new` and `ongoing` have been added' },
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
      .setDescription(`
**Last Updated**: ${lastUpdated}
${desc}
      `)
      .addFields(changes)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('BLUE')
      .setFooter(`Version: v${version}`)
      .setTimestamp()
        )
    }
  )

  return {
    name: 'new',
    desc: `A list of changes to the bot.`
  }
}

import { DiscordClient } from '../util/discord-client';
import { version } from '../../package.json';
import { MessageEmbed, Message } from 'discord.js';
import { ICommandMeta } from './command';

export function setHelp(
  client: DiscordClient,
  commandList: ICommandMeta[]
) {
  client.onCommand('help', '', async (msg: Message, prefix: string) => {
    const helpEmbed = new MessageEmbed()
      .setColor('#6633bb')
      .setTitle('Hand Cricketer Help')
      .setDescription(`\
**Custom Prefix**: You can use a custom prefix in a certain server by changing the nickname of the bot to \`[prefix] Name\`. Here the prefix can be anything such as \`!\`, \`?\` or \`.\` and the rest of the nickname doesn't matter and can be anything.

In the first half of October, we hosted nearly 2000 single and multi player matches! Also the bot is in 100 servers now! Invite it to your server or recommend it to your friend too!
`)
      .addField(`Following is a list of Hand Cricketer commands.`, '\u200b')
      .addFields(
        { name: `${prefix}help`, value: 'Help Command.' },
        ...commandList.map(command => {
          return {
            name: `${prefix}${command.name}`,
            value: command.desc,
            inline: true
          }
        })
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Version: v${version}`)
      .addField(`It's Open Source`, `[Github](https://github.com/HarshKhandeparkar/hand-cricket-bot)`, true);

      if (client.dblIntegration) {
        helpEmbed.addField('Invite to your server', `[Invite Link](https://top.gg/bot/${client.user.id})`, true);
        helpEmbed.addField('Liked it?', `[Vote](https://top.gg/bot/${client.user.id}/vote)`, true);
        const botStats = await client.dbl.getBot(client.user.id);

        if (botStats.support) helpEmbed.addField('Support Server', `[Join It!](https://discord.gg/${botStats.support})`, true);
      }

      msg.channel.send(helpEmbed);
  })
}

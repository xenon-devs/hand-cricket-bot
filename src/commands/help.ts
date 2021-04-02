import { DiscordClient } from '../util/discord-client';
import { version } from '../../package.json';
import { MessageEmbed, Message, TextChannel } from 'discord.js';
import { ICommandMeta } from './command';
import { send } from '../util/rate-limited-send';

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
      .addField('\u200b', '\u200b')
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Version: v${version} | By Team Xenon`, 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
      .addField(`It's Open Source`, `[Github Link](https://github.com/xenon-devs/hand-cricket-bot)`, true)
      .addField(`Play Among Us?`, `[Click to Add Among Us Bot Made by Team Xenon](https://top.gg/bot/757272442820362281)`, true);

      if (client.dblIntegration) {
        helpEmbed.addField('Add bot to your server', `[Click to Add](https://top.gg/bot/${client.user.id})`, true);
        helpEmbed.addField('Liked it?', `[Click to Vote](https://top.gg/bot/${client.user.id}/vote)`, true);
        helpEmbed.addField('Want to Swap cryptos with ease?', `[Try SwapCC](https://top.gg/bot/812942138622345277)`, true);

        const botStats = await client.dbl.getBot(client.user.id);
        if (botStats.support) helpEmbed.addField('Support Server', `[Click to Join](https://discord.gg/${botStats.support})`, true);
      }

      send(<TextChannel>msg.channel, helpEmbed);

      if (client.advertisement !== null) send(<TextChannel>msg.channel, client.advertisement);
  })
}

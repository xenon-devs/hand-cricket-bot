import { MessageEmbed, Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';

export function setRules(client: DiscordClient) {
  return setCommand(
    client,
    'rules',
    'Explain the rules of the game.',
    '',
    (msg: Message) => {
      const rulesEmbed = new MessageEmbed()
        .setColor('#116677')
        .setTitle('Extremely Official Rules of Hand Cricket')
        .setDescription('One player bowls and the other bats. The player has to type any number between 0 and 6(representing the number of fingers), once the player enters, the bot will generate a random number as it\'s output.')
        .addFields(
          { name: '1. ', value: 'If the number of fingers are equal, the batsman is out.', inline: true },
          { name: '2. ', value: 'If the number of fingers do not match, the number of fingers on the batsman is the number of runs scored.', inline: true },
          { name: '3. ', value: 'All rules of cricket apply.', inline: true }
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()

      msg.channel.send(rulesEmbed);
    }
  )
}

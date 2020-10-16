import { MessageEmbed, Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';

export function setRules(client: DiscordClient) {
  client.onCommand('rules', '', async (msg: Message) => {
    const rulesEmbed = new MessageEmbed()
      .setColor('#116677')
      .setTitle('Extremely Official Rules of Hand Cricket')
      .setDescription('One player bowls and the other bats. The player has to type any number between 0 and 6(representing the number of fingers), once the player enters, the bot will generate a random number as it\'s output.')
      .addFields(
        { name: '1. ', value: 'If the number of fingers are equal, the batsman is out.' },
        { name: '2. ', value: 'If the number of fingers do not match, the number of fingers on the batsman is the number of runs scored.' },
        { name: '3. ', value: 'All rules of cricket apply.' }
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()

    msg.channel.send(rulesEmbed);
  })

  return {
    name: 'rules',
    desc: `Explain the rules of the game.`
  }
}

import { MessageEmbed } from 'discord.js';
import { DiscordClient } from '../util/discord-client';

export async function getTournamentAdvertisementEmbed(client: DiscordClient) {
  if (client.dblIntegration) {
    const botInfo = await client.dbl.getBot(client.user.id);

    return new MessageEmbed()
      .setTitle(`Hand Cricket Tournament :trophy:`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`Hand Cricket Tournament`)
      .setTimestamp()
      .setColor('#4400cc')
      .setDescription(`
We are hosting a global Hand Cricket <:handcric:763782166202417173> tournament!
If you love the bot or the game, please consider participating. (it's free!)
If you are on the global leaderboard, PLEASE DO PARTICIPATE!
[Click](https://discord.gg/${botInfo.support}) to join the support server for more details and to participate.
`)
      .addField('To participate', `[Click](https://discord.gg/${botInfo.support}) to join support server`)
  }
}

import { MessageEmbed } from 'discord.js';
import { DiscordClient } from '../util/discord-client';

export async function getAdvertisementEmbed(client: DiscordClient) {
    return new MessageEmbed()
      .setTitle(`Global Matches!`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`New Feature`)
      .setTimestamp()
      .setColor('#4400cc')
      .setDescription(`
Now you can play matches against any player in any server globally! Just use the \`global\` command and see the magic!
You might have to wait for a while for a match to be found but as the popularity of this feature grows, you will find a match almost instantly.
`)
}

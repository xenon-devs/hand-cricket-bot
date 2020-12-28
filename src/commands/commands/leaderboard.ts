import { MessageEmbed, Message, TextChannel, DMChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { IHighScore } from '../../../src/db/high-score-db';
import { ReactionMenu } from '@xenon-devs/discordjs-reaction-menu';

const rankMappingFunction = (score: IHighScore, i: number) => {
  return {
    name: `#${i+1} ${score.tag}`,
    value: `\`${score.score}\` runs.`,
    inline: true
  }
}

export function setLeaderboard(client: DiscordClient) {
  return setCommand(
    client,
    'leaderboard',
    'Leaderboard of high scores.',
    '',
    (msg: Message) => {
      const scores = client.highScoreDB.getScores();

      const singlePlayerRankFields = scores.singlePlayer.map(rankMappingFunction);
      const multiPlayerRankFields = scores.multiPlayer.map(rankMappingFunction);

      const leaderboardMenu = new ReactionMenu(
        [
          {
            pageEmbed:  new MessageEmbed()
              .setTitle(`Hand Cricketer Leaderboard`)
              .setDescription(`Leaderboard of all Hand Cricketer players on discord. Click on the emojis below to navigate.`)
              .addFields([
                {name: '1.', value: 'Single Player High Scores'},
                {name: '2.', value: 'Multu Player High Scores'}
              ])
              .setThumbnail(client.user.displayAvatarURL())
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
          },
          {
            pageEmbed:  new MessageEmbed()
              .setTitle(`Hand Cricket Singleplayer High Scores`)
              .setDescription(
                scores.singlePlayer.length > 0 ?
                  'Following is the list of top single player high scores (in test match).' :
                  'No scores recorded yet.'
              )
              .addFields(singlePlayerRankFields)
              .setThumbnail(client.user.displayAvatarURL())
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
          },
          {
            pageEmbed:  new MessageEmbed()
              .setTitle(`Hand Cricket Multiplayer High Scores`)
              .setDescription(
                scores.multiPlayer.length > 0 ?
                  'Following is the list of top multi player high scores (in test match).' :
                  'No scores recorded yet.'
              )
              .addFields(multiPlayerRankFields)
              .setThumbnail(client.user.displayAvatarURL())
              .setColor('GREEN')
              .setTimestamp()
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
          }
        ],
        <TextChannel | DMChannel>msg.channel
      )

      leaderboardMenu.start(0);

      if (client.advertisement !== null) msg.channel.send(client.advertisement);
    }
  )
}

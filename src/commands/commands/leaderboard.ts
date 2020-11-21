import { MessageEmbed, Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';

export function setLeaderboard(client: DiscordClient) {
  client.onCommand(
    'leaderboard',
    '',
    (msg: Message) => {
      const scores = client.highScoreDB.getScores();

      msg.channel.send(
        new MessageEmbed()
        .setTitle(`Hand Cricketer Leaderboard`)
        .setDescription(`Leaderboard of all Hand Cricketer players on discord.`)
        .addField('Single Player', '\u200b', false)
        .addFields(
          scores.singlePlayer.map((score, i) => {
            return {
              name: `#${i+1} `,
              value: `${score.tag} with \`${score.score}\` runs.`
            }
          })
        )
        .addField('Multi Player', '\u200b', false)
        .addFields(
          scores.multiPlayer.map((score, i) => {
            return {
              name: `#${i+1} `,
              value: `${score.tag} with \`${score.score}\` runs.`
            }
          })
        )
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('GREEN')
        .setTimestamp()
      )
    }
  )

  return {
    name: 'leaderboard',
    desc: `Leaderboard of high scores.`
  }
}

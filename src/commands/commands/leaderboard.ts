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
        .addField(
          'Single Player',
          scores.singlePlayer.length > 0 ?
            'Following is the list of top single player batsmen.'
            : 'No scores recorded yet.',
          false)
        .addFields(
          scores.singlePlayer.map((score, i) => {
            return {
              name: `#${i+1} ${score.tag}`,
              value: `\`${score.score}\` runs.`,
              inline: true
            }
          })
        )
        .addField(
          'Multi Player',
          scores.multiPlayer.length > 0 ?
            'Following is the list of top multi player batsmen.' :
            'No scores recorded yet.',
          false
        )
        .addFields(
          scores.multiPlayer.map((score, i) => {
            return {
              name: `#${i+1} ${score.tag}`,
              value: `\`${score.score}\` runs.`,
              inline: true
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

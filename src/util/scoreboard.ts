import { MessageEmbed, User } from 'discord.js';
import { Players, MatchResult } from '../game/match';
import { DiscordClient } from './discord-client';

export function getScoreboard(
  client: DiscordClient,
  opponent: User,
  challenger: User,
  opener: Players,
  numInnings: number,
  result: MatchResult,
  openerScore: number,
  chaserScore: number,
  ballsPlayed: [number, number]
) {
  const scoreboard = new MessageEmbed()
    .setThumbnail(client.user.avatarURL())
    .setTitle('Scoreboard')
    .setTimestamp()
    .setFooter('Hand Cricketer', client.user.avatarURL())
    .setColor('BLUE')
    .setDescription(
      (
        numInnings === 2 ||
        result === MatchResult.CHALLENGER_FORFEITED ||
        result === MatchResult.OPPONENT_FORFEITED
      )  ? `Match End Score`: `Mid Innings Score`
    )

    if (opener) {
      scoreboard
      .addField('\u200b', '\u200b', true) // blank spacer
      .addField(`Opener`, opener ? (opener === Players.OPPONENT ? `<@${opponent.id}>` : `<@${challenger.id}>`) : ':question:', true)
      .addField(`Chaser`, opener ? (opener === Players.CHALLENGER ? `<@${opponent.id}>` : `<@${challenger.id}>`) : ':question:', true)
    }

    if (numInnings > 0) {
      scoreboard.addField(`Opener's score`, openerScore, true);
      scoreboard.addField(`Balls played in 1st innings`, ballsPlayed[0], true);
      scoreboard.addField('\u200b', '\u200b', true); // blank spacer
    }

    if (numInnings > 1) {
      scoreboard.addField(`Chaser's score`, chaserScore, true);
      scoreboard.addField('Balls played in 2nd innings', ballsPlayed[1], true);
      scoreboard.addField('\u200b', '\u200b', true); // blank spacer
    }

    switch (result) {
      case MatchResult.TIE:
        scoreboard.addField('Result', 'It was a tie :(', false);
        break;
      case MatchResult.OPPONENT_WON:
        scoreboard.addField('Result', `<@${opponent.id}> won! :trophy:`, false);
        break;
      case MatchResult.CHALLENGER_WON:
        scoreboard.addField('Result', `<@${challenger.id}> won! :trophy:`, false);
        break;
      case MatchResult.CHALLENGER_FORFEITED:
        scoreboard.addField('Result', `<@${challenger.id}> forfeited :expressionless:`, false);
        break;
      case MatchResult.OPPONENT_FORFEITED:
        scoreboard.addField('Result', `<@${opponent.id}> forfeited :expressionless:`, false);
        break;
    }

    return scoreboard;
}

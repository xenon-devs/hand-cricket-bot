import { MessageEmbed } from 'discord.js';
import { Players, MatchResult, Match } from './match';

export function getScoreboard(
  this: Match
) {
  const scoreboard = new MessageEmbed()
    .setThumbnail(this.client.user.avatarURL())
    .setTitle('Scoreboard')
    .setTimestamp()
    .setFooter('Hand Cricketer', this.client.user.avatarURL())
    .setColor('BLUE')
    .setDescription(
      (
        this.numInnings === 2 ||
        this.result === MatchResult.CHALLENGER_FORFEITED ||
        this.result === MatchResult.OPPONENT_FORFEITED ||
        this.result === MatchResult.CHALLENGER_LEFT ||
        this.result === MatchResult.OPPONENT_LEFT
      )  ? `Match End Score`: `Mid Innings Score`
    )

    if (this.opener) {
      scoreboard
      .addField(`Opener`, this.opener ? (this.opener === Players.OPPONENT ? `<@${this.opponent.id}>` : `<@${this.challenger.id}>`) : ':question:', true)
      .addField(`Chaser`, this.opener ? (this.opener === Players.CHALLENGER ? `<@${this.opponent.id}>` : `<@${this.challenger.id}>`) : ':question:', true)
      .addField('\u200b', '\u200b', true) // blank spacer
    }

    if (this.numInnings > 0) {
      scoreboard.addField(`Opener's score`, this.openerScore, true);
      scoreboard.addField(`Overs played in 1st innings`, `${Math.floor(this.ballsPlayed[0]/6)}.${this.ballsPlayed[0]%6}`, true);
      scoreboard.addField('\u200b', '\u200b', true); // blank spacer
    }

    if (this.numInnings > 1) {
      scoreboard.addField(`Chaser's score`, this.chaserScore, true);
      scoreboard.addField('Overs played in 2nd innings', `${Math.floor(this.ballsPlayed[1]/6)}.${this.ballsPlayed[1]%6}`, true);
      scoreboard.addField('\u200b', '\u200b', true); // blank spacer
    }

    switch (this.result) {
      case MatchResult.TIE:
        scoreboard.addField('Result', 'It was a tie :(', false);
        break;
      case MatchResult.OPPONENT_WON:
        scoreboard.addField('Result', `<@${this.opponent.id}> won! :trophy:`, false);
        break;
      case MatchResult.CHALLENGER_WON:
        scoreboard.addField('Result', `<@${this.challenger.id}> won! :trophy:`, false);
        break;
      case MatchResult.CHALLENGER_FORFEITED:
        scoreboard.addField('Result', `<@${this.challenger.id}> forfeited :expressionless:`, false);
        break;
      case MatchResult.OPPONENT_FORFEITED:
        scoreboard.addField('Result', `<@${this.opponent.id}> forfeited :expressionless:`, false);
        break;
      case MatchResult.CHALLENGER_LEFT:
        scoreboard.addField('Result', `<@${this.challenger.id}> left the match :(`, false);
        break;
      case MatchResult.OPPONENT_LEFT:
        scoreboard.addField('Result', `<@${this.opponent.id}> left the match :(`, false);
        break;
    }

    if (this.client.dblIntegration) {
      if(this.result === MatchResult.CHALLENGER_WON || this.result === MatchResult.OPPONENT_WON || this.result === MatchResult.TIE) scoreboard.addField('If you enjoyed', `Please [vote](https://top.gg/bot/${this.client.user.id}).`);
    }

    return scoreboard;
}

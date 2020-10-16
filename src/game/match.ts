import { User, TextChannel, MessageEmbed, ClientUser, DMChannel } from 'discord.js';
import { DiscordClient } from '../util/discord-client';
import { ErrorMessages } from '../util/ask';

export enum Players {
  CHALLENGER = 'challenger',
  OPPONENT = 'opponent'
}
export enum MatchResult {
  TIE = 'tie',
  CHALLENGER_WON = 'challenger_won',
  OPPONENT_WON = 'opponent_won',
  CHALLENGER_FORFEITED = 'challenger_forfeited',
  OPPONENT_FORFEITED = 'opponent_forfeited'
}
export enum RoundResult {
  BATSMAN_SCORED = 'batsman_scored',
  BATSMAN_OUT = 'batsman_out'
}

export class Match {
  challenger: User;
  opponent: User | ClientUser;
  stadium: TextChannel | DMChannel;
  client: DiscordClient;
  matchEndedCb: () => void;

  opener: Players;
  result: MatchResult;
  /** Balls played in each innings */
  ballsPlayed: [number, number] = [0, 0];
  /** Number of innings that were completed */
  numInnings: number = 0;

  openerScore: number = 0;
  chaserScore: number = 0;

  constructor(client: DiscordClient, stadium: TextChannel | DMChannel, challenger: User, matchEndedCb: () => void) {
    this.client = client;
    this.challenger = challenger;
    this.stadium = stadium;
    this.matchEndedCb = matchEndedCb;
  }

  startMatch() { // To be overriden

  }

  forfeit(forfeiterId: string) {
    if (this.opponent.id === forfeiterId) {
      this.result = MatchResult.OPPONENT_FORFEITED;
      this.stadium.send(this.getScoreBoard());
      return this.matchEndedCb();
    }
    else if (this.challenger.id === forfeiterId) {
      this.result = MatchResult.CHALLENGER_FORFEITED;
      this.stadium.send(this.getScoreBoard());
      return this.matchEndedCb();
    }
  }

  getScoreBoard() {
    const scoreboard = new MessageEmbed()
    .setThumbnail(this.client.user.avatarURL())
    .setTitle('Scoreboard')
    .setTimestamp()
    .setFooter('Stats generated by Hand Cricketer', this.client.user.avatarURL())
    .addField(`Opener`, `<@${ this.opener === Players.OPPONENT ? this.opponent.id : this.challenger.id }>`, true)
    .addField(`Chaser`, `<@${ this.opener === Players.CHALLENGER ? this.opponent.id : this.challenger.id }>`, true)
    .addField('\u200b', '\u200b', true) // blank spacer
    .setColor('BLUE')
    .setDescription(this.numInnings === 1 ? `Mid Innings Score` : `Match End Score`);

    scoreboard.addField(`Opener's score`, this.openerScore, true);
    scoreboard.addField(`Balls played in 1st innings`, this.ballsPlayed[0], true);
    scoreboard.addField('\u200b', '\u200b', true); // blank spacer

    if (this.numInnings > 1) scoreboard.addField(`Chaser's score`, this.chaserScore, true);
    if (this.numInnings > 1) {
      scoreboard.addField('Balls played in 2nd innings', this.ballsPlayed[1], true);
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
    }

    return scoreboard;
  }

  async getChallengerFingers(): Promise<ErrorMessages | number> { // To be overriden
    return 3;
  }

  async getOpponentFingers(): Promise<ErrorMessages | number> { // To be overriden
    return ErrorMessages.DID_NOT_ANSWER;
  }

  async play() {
    const [challengerFingers, opponentFingers] = await Promise.all([this.getChallengerFingers(), this.getOpponentFingers()]);

    if (challengerFingers === ErrorMessages.DID_NOT_ANSWER) {
      this.matchEndedCb();
      return this.comment(`Coward challenger <@${this.challenger.id}> did not play. Match Ended.`);
    }
    if (opponentFingers === ErrorMessages.DID_NOT_ANSWER) {
      this.matchEndedCb();
      return this.comment(`Coward opponent <@${this.opponent.id}> did not play. Match Ended.`);
    }

    this.ballsPlayed[this.numInnings]++;

    const openerFingers = (this.opener === Players.CHALLENGER) ? challengerFingers : opponentFingers;
    const chaserFingers = (this.opener === Players.CHALLENGER) ? opponentFingers : challengerFingers;

    this.calculateRoundResult(
      (this.numInnings === 0) ? openerFingers : chaserFingers,
      (this.numInnings === 0) ? chaserFingers : openerFingers
    )
  }

  matchOver() {
    if (this.openerScore > this.chaserScore) this.result = this.opener === Players.CHALLENGER ? MatchResult.CHALLENGER_WON : MatchResult.OPPONENT_WON;
    else if (this.openerScore === this.chaserScore) this.result = MatchResult.TIE;
    else if (this.openerScore < this.chaserScore) this.result = this.opener === Players.CHALLENGER ? MatchResult.OPPONENT_WON : MatchResult.CHALLENGER_WON;

    this.stadium.send(this.getScoreBoard());
    return this.matchEndedCb();
  }

  inningsOver() {
    this.numInnings++;

    if (this.numInnings === 2) this.matchOver();
    if (this.numInnings === 1) {
      this.stadium.send(this.getScoreBoard());
      this.comment(`Next innings starting in 5s`);
      setTimeout(() => this.play(), 5000);
    }
  }

  /**
   * @param batsman Which player is the batsman
   * @param batsmanPlayed Number of fingers
   * @param bowlerPlayed Number of fingers
   */
  calculateRoundResult(batsmanPlayed: number, bowlerPlayed: number) {
    if (batsmanPlayed === bowlerPlayed) this.inningsOver();
    else {
      if (this.numInnings === 1) this.chaserScore += batsmanPlayed;
      else this.openerScore += batsmanPlayed;

      if (this.numInnings === 1 && this.chaserScore > this.openerScore) this.inningsOver();
      else this.play();
    }
  }

  comment(commentry: string) {
    this.stadium.send(`**Commentator**: ${commentry}`);
  }
}

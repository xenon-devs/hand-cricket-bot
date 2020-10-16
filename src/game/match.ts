import { User, TextChannel, ClientUser, DMChannel } from 'discord.js';
import { DiscordClient } from '../util/discord-client';
import { ErrorMessages } from '../util/ask';
import { getScoreboard } from '../util/scoreboard';

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
  /** Fired when the match ended, whether due to an error or otherwise */
  matchEndedCb: () => void;

  opener: Players;
  result: MatchResult;
  /** Balls played in each innings */
  ballsPlayed: [number, number] = [0, 0];
  /** Number of innings that were completed */
  numInnings: number = 0;

  openerScore: number = 0;
  chaserScore: number = 0;

  associatedListeners: string[] = []; // Array of all associated onMsg listener names

  constructor(
    client: DiscordClient,
    stadium: TextChannel | DMChannel,
    challenger: User,
    matchEndedCb: () => void
  ) {
    this.client = client;
    this.challenger = challenger;
    this.stadium = stadium;
    this.matchEndedCb = matchEndedCb;
  }

  startMatch() { // To be overriden

  }

  forfeit(forfeiterId: string) {
    if (this.challenger.id === forfeiterId) {
      this.result = MatchResult.CHALLENGER_FORFEITED;
      this.stadium.send(this.getScoreBoard());
      this.associatedListeners.forEach(handlerName => this.client.offMsg(handlerName));
      return this.matchEndedCb();
    }
    else if (this.opponent) {
      if (this.opponent.id === forfeiterId) {
        this.result = MatchResult.OPPONENT_FORFEITED;
        this.stadium.send(this.getScoreBoard());
        this.associatedListeners.forEach(handlerName => this.client.offMsg(handlerName));
        return this.matchEndedCb();
      }
    }
  }

  getScoreBoard() {
    return getScoreboard(
      this.client,
      this.opponent,
      this.challenger,
      this.opener,
      this.numInnings,
      this.result,
      this.openerScore,
      this.chaserScore,
      this.ballsPlayed
    )
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
  calculateRoundResult(
    batsmanPlayed: number,
    bowlerPlayed: number
  ) {
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

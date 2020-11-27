import { User, TextChannel, ClientUser, DMChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { ErrorMessages } from '../../util/ask';

import { getScoreboard } from './scoreboard';
import { play } from './play';
import { forfeit } from './forfeit';
import { getRandomComment, COMMENT_CATEGORIES } from './random-comment';

export enum Players {
  CHALLENGER = 'challenger',
  OPPONENT = 'opponent'
}
export enum MatchResult {
  TIE = 'tie',
  CHALLENGER_WON = 'challenger_won',
  OPPONENT_WON = 'opponent_won',
  CHALLENGER_FORFEITED = 'challenger_forfeited',
  OPPONENT_FORFEITED = 'opponent_forfeited',
  CHALLENGER_LEFT = 'challenger_left',
  OPPONENT_LEFT = 'opponent_left'
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

  protected getScoreBoard = getScoreboard;
  protected play = play;
  public forfeit = forfeit;
  protected COMMENT_CATEGORIES = COMMENT_CATEGORIES;
  protected getRandomComment = getRandomComment;

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

  protected async getChallengerFingers(): Promise<ErrorMessages | number> { // To be overriden
    return 3;
  }

  protected async getOpponentFingers(): Promise<ErrorMessages | number> { // To be overriden
    return ErrorMessages.DID_NOT_ANSWER;
  }

  protected matchOver() {
    if (this.openerScore > this.chaserScore) this.result = this.opener === Players.CHALLENGER ? MatchResult.CHALLENGER_WON : MatchResult.OPPONENT_WON;
    else if (this.openerScore === this.chaserScore) this.result = MatchResult.TIE;
    else if (this.openerScore < this.chaserScore) this.result = this.opener === Players.CHALLENGER ? MatchResult.OPPONENT_WON : MatchResult.CHALLENGER_WON;

    // Handle high scores leaderboard
    if (this.result == MatchResult.CHALLENGER_WON || this.result === MatchResult.OPPONENT_WON) {
      const winnerScore = Math.max(this.openerScore, this.chaserScore);
      const winner = this.result === MatchResult.CHALLENGER_WON ? this.challenger : this.opponent;

      if (!winner.bot) {
        this.client.highScoreDB.addHighScore(
          {
            score: winnerScore,
            tag: winner.tag
          },
          !this.opponent.bot // Multiplayer if opponent is not bot
        )
      }
    }

    if(this.result == MatchResult.CHALLENGER_WON || this.result === MatchResult.OPPONENT_WON) {
      this.client.matchesDB.addMatch(!this.opponent.bot /* Multiplayer if opponent is not bot*/);
    }

    this.stadium.send(this.getScoreBoard());
    if (this.client.tourneyAd !== null) this.stadium.send(this.client.tourneyAd);
    return this.matchEndedCb();
  }

  protected inningsOver() {
    this.numInnings++;

    if (this.numInnings === 2) this.matchOver();
    if (this.numInnings === 1) {
      this.stadium.send(this.getScoreBoard());
      this.comment(`Next innings starting in 5s`);
      setTimeout(() => this.play(), 5000);
    }
  }

  protected comment(commentry: string) {
    this.stadium.send(`**Commentator**: ${commentry}`);
  }

  /**
   * @param batsman Which player is the batsman
   * @param batsmanPlayed Number of fingers
   * @param bowlerPlayed Number of fingers
   */
  protected calculateRoundResult(
    batsmanPlayed: number,
    bowlerPlayed: number
  ) {
    if (batsmanPlayed === bowlerPlayed) this.inningsOver();
    else {
      if (this.numInnings === 1) this.chaserScore += batsmanPlayed; // randomize
      else this.openerScore += batsmanPlayed; // 6s and 4s need msgs

      if (this.numInnings === 1 && this.chaserScore > this.openerScore) this.inningsOver();
      else this.play();
    }
  }

}

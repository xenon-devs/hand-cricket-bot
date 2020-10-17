import { User, TextChannel, ClientUser, DMChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { ErrorMessages } from '../../util/ask';

import { getScoreboard } from './scoreboard';
import { calculateRoundResult } from './calculate-round-result';
import { play } from './play';
import { forfeit } from './forfeit';

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

  protected calculateRoundResult = calculateRoundResult;
  protected getScoreBoard = getScoreboard;
  protected play = play;
  public forfeit = forfeit;

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

  protected startMatch() { // To be overriden

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

    this.stadium.send(this.getScoreBoard());
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
}

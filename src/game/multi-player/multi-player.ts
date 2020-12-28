import { TextChannel, User } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { HighScoreType } from '../../db/high-score-db';
import { getPlayerFingersDM } from '../../util/get-player-fingers';
import { Match, Players, GameMode } from '../match/match';

import { selectOpponent } from './select-opponent';
import { startMatch } from './start-match';

export class MultiPlayerMatch extends Match {
  protected selectOpponent = selectOpponent;
  protected startMatch = startMatch;

  constructor(
    client: DiscordClient,
    stadium: TextChannel,
    challenger: User,
    matchEndedCb: () => void
  ) {
    super(client, stadium, challenger, matchEndedCb);

    this.start();
  }

  start() {
    this.selectOpponent();
  }

  inningsOver() {
    this.opponent.send(`Innings over.`);
    this.challenger.send(`Innings over.`);

    super.inningsOver();
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
    const batsman = (
      this.opener === Players.CHALLENGER && this.numInnings === 0 ||
      this.opener === Players.OPPONENT && this.numInnings === 1
    ) ? this.challenger : this.opponent;

    const bowler = batsman === this.challenger ? this.opponent : this.challenger;

    batsman.send(`Bowler: ${bowlerPlayed}!`); // randomize
    bowler.send(`Batsman: ${batsmanPlayed}!`); // randomize

    if (batsmanPlayed !== bowlerPlayed) {
      if (batsmanPlayed === 6) {
        const randomSixComment = this.getRandomComment(this.COMMENT_CATEGORIES.SIX);
        this.challenger.send(`**Commentator**: ${randomSixComment}`);
        this.opponent.send(`**Commentator**: ${randomSixComment}`);
      }
      else if (batsmanPlayed === 4) {
        const randomBoundaryComment = this.getRandomComment(this.COMMENT_CATEGORIES.BOUNDARY);
        this.challenger.send(`**Commentator**: ${randomBoundaryComment}`);
        this.opponent.send(`**Commentator**: ${randomBoundaryComment}`);
      }
    }
    else {
      const outComment = this.getRandomComment(this.COMMENT_CATEGORIES.OUT);
      this.challenger.send(`**Commentator**: ${outComment}`);
      this.opponent.send(`**Commentator**: ${outComment}`);
    }

    super.calculateRoundResult(batsmanPlayed, bowlerPlayed);
  }

  async getChallengerFingers() {
    return getPlayerFingersDM(this.client, this.challenger, (handlerName) => this.associatedListeners.push(handlerName));
  }

  async getOpponentFingers() {
    return getPlayerFingersDM(this.client, this.opponent, (handlerName) => this.associatedListeners.push(handlerName));
  }

  protected sendScoreBoard() {
    this.stadium.send(this.generateScoreBoard());
    this.opponent.send(this.scoreboard);
    this.challenger.send(this.scoreboard);
  }

  updateDB(
    winner: User,
    winnerScore: number
  ) {
    let highScoreType: HighScoreType;

    switch (this.gameMode) {
      case GameMode.SUPER_OVER:
        highScoreType = HighScoreType.MULTI_SUPER_OVER;
        break;
      case GameMode.T_5:
        highScoreType = HighScoreType.MULTI_T5;
        break;
      case GameMode.TEST_MATCH:
        highScoreType = HighScoreType.MULTI_TEST;
        break;
    }

    this.client.highScoreDB.addHighScore(
      {
        score: winnerScore,
        tag: winner.tag
      },
      highScoreType
    )

    this.client.matchesDB.addMatch('multiPlayer');
  }
}

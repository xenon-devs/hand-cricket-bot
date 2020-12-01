import { Match, Players, MatchResult } from './match';
import { ErrorMessages } from '../../util/ask';

export async function play(this: Match) {
  const [challengerFingers, opponentFingers] = await Promise.all([this.getChallengerFingers(), this.getOpponentFingers()]);

  if (challengerFingers === ErrorMessages.DID_NOT_ANSWER) {
    this.result = MatchResult.CHALLENGER_LEFT;
    this.stadium.send(this.getScoreBoard());
    return this.matchEndedCb();
  }
  if (opponentFingers === ErrorMessages.DID_NOT_ANSWER) {
    this.result = MatchResult.CHALLENGER_LEFT;
    this.stadium.send(this.getScoreBoard());
    return this.matchEndedCb();
  }

  this.ballsPlayed[this.numInnings]++;

  const openerFingers = (this.opener === Players.CHALLENGER) ? challengerFingers : opponentFingers;
  const chaserFingers = (this.opener === Players.CHALLENGER) ? opponentFingers : challengerFingers;

  this.lastChallengerFingers = challengerFingers;
  this.lastOpponentFingers = opponentFingers;

  this.calculateRoundResult(
    (this.numInnings === 0) ? openerFingers : chaserFingers,
    (this.numInnings === 0) ? chaserFingers : openerFingers
  )
}

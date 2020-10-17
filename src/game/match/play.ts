import { Match, Players } from './match';
import { ErrorMessages } from '../../util/ask';

export async function play(this: Match) {
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

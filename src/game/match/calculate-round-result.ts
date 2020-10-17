import { Match } from './match';

/**
 * @param batsman Which player is the batsman
 * @param batsmanPlayed Number of fingers
 * @param bowlerPlayed Number of fingers
 */
export function calculateRoundResult(
  this: Match,
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

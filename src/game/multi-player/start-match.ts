import { Players } from '../match/match';
import { toss } from '../../util/toss';
import { MultiPlayerMatch } from './multi-player';
import { askBatBowl, BatBowl } from '../../util/ask-bat-bowl';

export async function startMatch(this: MultiPlayerMatch) {
  try {
    const tossAnswer = await toss(this.opponent, this.client, this.stadium, (handlerName) => this.associatedListeners.push(handlerName));

    let tossWinner: Players;
    if (tossAnswer === Math.floor(Math.random()*2)) tossWinner = Players.OPPONENT;
    else tossWinner = Players.CHALLENGER;

    try {
      const batBowl = await askBatBowl(
        tossWinner === Players.CHALLENGER ? this.challenger : this.opponent,
        this.client,
        this.stadium,
        (handlerName) => this.associatedListeners.push(handlerName)
      )

      if (batBowl === BatBowl.BAT) this.opener = tossWinner;
      else this.opener = tossWinner === Players.CHALLENGER ? Players.OPPONENT : Players.CHALLENGER;

      this.comment(`${tossWinner === Players.CHALLENGER ? 'Challenger' : 'Opponent'}\
<@${tossWinner === Players.CHALLENGER ? this.challenger.id : this.opponent.id}> won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
      this.comment(`Match starting in 2s`);
      setTimeout(() => this.play(), 2000);
    }
    catch (e) {
      this.matchEndedCb();
      this.comment(`The challenger walked out of the stadium.`);
      return e;
    }
  }
  catch (e) {
    this.matchEndedCb();
    this.comment(`The challenger never entered the stadium.`);
    return e;
  }
}

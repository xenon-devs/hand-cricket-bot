import { Players } from '../match/match';
import { SinglePlayerMatch } from './single-player';
import { toss } from '../../util/toss';
import { askBatBowl, BatBowl } from '../../util/ask-bat-bowl';

export async function startMatch(this: SinglePlayerMatch) {
  await this.askGameMode();

  try {
    const tossAnswer = await toss(this.challenger, this.client, this.stadium, (handlerName) => this.associatedListeners.push(handlerName));

    if (tossAnswer === Math.floor(Math.random()*2)) {
      try {
        const batBowl = await askBatBowl(this.challenger, this.client, this.stadium, (handlerName) => this.associatedListeners.push(handlerName));
        if (batBowl === BatBowl.BAT) this.opener = Players.CHALLENGER;
        else this.opener = Players.OPPONENT;

        this.comment(`Challenger <@${this.challenger.id}> won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
        this.comment(`Match starting in 2s`);
        setTimeout(() => this.play(), 2000);
      }
      catch (e) {
        this.matchEndedCb();
        this.comment(`The challenger walked out of the stadium.`); // randomize
        return e;
      }
    }
    else {
      const batBowl = Math.random() >= 0.5 ? BatBowl.BAT : BatBowl.BOWL;
      if (batBowl === BatBowl.BAT) this.opener = Players.OPPONENT;
      else this.opener = Players.CHALLENGER;

      this.comment(`Opponent <@${this.opponent.id}> won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
      this.comment(`Match starting in 2s`);
      setTimeout(() => this.play(), 2000);
    }
  }
  catch (e) {
    this.matchEndedCb();
    this.comment(`The challenger never entered the stadium.`); // randomize
    return e;
  }
}

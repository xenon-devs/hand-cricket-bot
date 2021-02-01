import { Players } from '../match/match';
import { toss } from '../../util/toss';
import { GlobalMatch } from './global';
import { askBatBowl, BatBowl } from '../../util/ask-bat-bowl';
import { DMChannel } from 'discord.js';
import { send } from '../../util/rate-limited-send';

export async function startMatch(this: GlobalMatch) {
  try {
    const challengerChannel = <DMChannel>(await send(this.challenger, `Your opponent, ${this.opponent.username} is playing the toss.`)).channel;
    const opponentChannel = <DMChannel>(await send(this.opponent, `You will play the toss.`)).channel;

    const tossAnswer = await toss(
      this.opponent,
      this.client,
      opponentChannel,
      (handlerName) => this.associatedListeners.push(handlerName)
    )

    let tossWinner: Players;
    if (tossAnswer === Math.floor(Math.random()*2)) tossWinner = Players.OPPONENT;
    else tossWinner = Players.CHALLENGER;

    this.comment(`**${tossWinner === Players.CHALLENGER ? this.challenger.username : this.opponent.username}** won the toss.`);

    try {
      const batBowl = await askBatBowl(
        tossWinner === Players.CHALLENGER ? this.challenger : this.opponent,
        this.client,
        tossWinner === Players.CHALLENGER ? challengerChannel : opponentChannel,
        (handlerName) => this.associatedListeners.push(handlerName)
      )

      if (batBowl === BatBowl.BAT) this.opener = tossWinner;
      else this.opener = tossWinner === Players.CHALLENGER ? Players.OPPONENT : Players.CHALLENGER;

      this.comment(`**${tossWinner === Players.CHALLENGER ? this.challenger.username : this.opponent.username}** won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
      this.comment(`Match starting in 2s`);
      setTimeout(() => this.play(), 2000);
    }
    catch (e) {
      this.matchEndedCb();
      this.comment(`**${this.challenger.username}** walked out of the stadium. The match ended.`); // randomize
      return e;
    }
  }
  catch (e) {
    this.matchEndedCb();
    this.comment(`**${this.challenger.username}** never entered the stadium. The match ended.`); // randomize
    return e;
  }
}

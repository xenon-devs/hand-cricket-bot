import { Match, Players } from './match';
import { DiscordClient } from '../util/discord-client';
import { TextChannel, User } from 'discord.js';
import { ErrorMessages, ask } from '../util/ask';
import { toss } from '../util/toss';
import { askBatBowl, BatBowl } from '../util/ask-bat-bowl';
import { getPlayerFingers } from '../util/get-player-fingers';

export class SinglePlayerMatch extends Match {
  constructor(client: DiscordClient, stadium: TextChannel, challenger: User) {
    super(client, stadium, challenger);
    this.opponent = this.client.user;

    this.startMatch();
  }

  async startMatch() {
    try {
      const tossAnswer = await toss(this.challenger, this.client, this.stadium);

      if (tossAnswer === Math.floor(Math.random()*2)) {
        try {
          const batBowl = await askBatBowl(this.challenger, this.client, this.stadium);
          if (batBowl === BatBowl.BAT) this.opener = Players.CHALLENGER;
          else this.opener = Players.OPPONENT;

          this.comment(`Challenger won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
          this.play();
        }
        catch (e) {
          this.comment(`The challenger walked out of the stadium.`);
          return e;
        }
      }
      else {
        const batBowl = Math.random() >= 0.5 ? BatBowl.BAT : BatBowl.BOWL;
        if (batBowl === BatBowl.BAT) this.opener = Players.OPPONENT;
        else this.opener = Players.CHALLENGER;

        this.comment(`Opponent won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
        this.play();
      }
    }
    catch (e) {
      this.comment(`The challenger never entered the stadium.`);
      return e;
    }
  }

  async getChallengerFingers(): Promise<ErrorMessages | number> {
    return getPlayerFingers(this.client, this.stadium, this.challenger);
  }

  async getOpponentFingers(): Promise<ErrorMessages | number> {
    const fingers =  Math.min(Math.floor(Math.random()*7), 6);

    this.stadium.send(`${fingers}!`);
    return fingers;
  }
}

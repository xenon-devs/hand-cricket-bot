import { Match, Players } from '../util/match';
import { DiscordClient } from '../util/discord-client';
import { TextChannel, User } from 'discord.js';
import { ErrorMessages, ask } from '../util/ask';
import { toss } from '../util/toss';
import { askBatBowl, BatBowl } from '../util/ask-bat-bowl';

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
          if (batBowl === BatBowl.BAT) this.opener = this.currentBatsman = Players.CHALLENGER;
          else this.opener = this.currentBatsman = Players.OPPONENT;

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
        if (batBowl === BatBowl.BAT) this.opener = this.currentBatsman = Players.OPPONENT;
        else this.opener = this.currentBatsman = Players.CHALLENGER;

        this.comment(`Opponent won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
        this.play();
      }
    }
    catch (e) {
      this.comment(`The challenger never entered the stadium.`);
      return e;
    }
  }

  async getChallengerFingers(askString: string = `Show your fingers... *Using keyboard stupid*`): Promise<ErrorMessages | number> {
    try {
      const fingers = (await ask(this.client, this.challenger, this.stadium, askString, 60000)).answer.trim();
      if (parseInt(fingers) <= 6 && parseInt(fingers) >= 0) return parseInt(fingers);
      else return await this.getChallengerFingers(`:clap: :clap:. Answer again now.`);
    }
    catch (e) {
      return e;
    }
  }
  async getOpponentFingers(): Promise<ErrorMessages | number> {
    const fingers =  Math.min(Math.floor(Math.random()*7), 6);

    this.stadium.send(`${fingers}!`);
    return fingers;
  }
}

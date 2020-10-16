import { Match, Players } from './match';
import { DiscordClient } from '../util/discord-client';
import { TextChannel, User, DMChannel } from 'discord.js';
import { ErrorMessages } from '../util/ask';
import { toss } from '../util/toss';
import { askBatBowl, BatBowl } from '../util/ask-bat-bowl';
import { getPlayerFingers } from '../util/get-player-fingers';

export class SinglePlayerMatch extends Match {
  constructor(client: DiscordClient, stadium: TextChannel | DMChannel, challenger: User, matchEndedCb: () => void) {
    super(client, stadium, challenger, matchEndedCb);
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

          this.comment(`Challenger <@${this.challenger.id}> won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
          this.comment(`Match starting in 2s`);
          setTimeout(() => this.play(), 2000);
        }
        catch (e) {
          this.matchEndedCb();
          this.comment(`The challenger walked out of the stadium.`);
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
      this.comment(`The challenger never entered the stadium.`);
      return e;
    }
  }

  calculateRoundResult(batsmanPlayed: number, bowlerPlayed: number) {
    const opponentScore = (this.numInnings === 0 && this.opener === Players.OPPONENT || this.numInnings === 1 && this.opener === Players.CHALLENGER) ? batsmanPlayed : bowlerPlayed; // Bot's score
    this.stadium.send(`${opponentScore}!`);

    super.calculateRoundResult(batsmanPlayed, bowlerPlayed);
  }

  async getChallengerFingers(): Promise<ErrorMessages | number> {
    return getPlayerFingers(this.client, this.stadium, this.challenger);
  }

  async getOpponentFingers(): Promise<ErrorMessages | number> {
    const fingers =  Math.min(Math.floor(Math.random()*7), 6);

    return fingers;
  }
}

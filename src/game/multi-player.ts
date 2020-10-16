import { Match, Players } from './match';
import { DiscordClient } from '../util/discord-client';
import { TextChannel, User } from 'discord.js';
import { ask } from '../util/ask';
import { toss } from '../util/toss';
import { askBatBowl, BatBowl } from '../util/ask-bat-bowl';
import { getPlayerFingersDM } from '../util/get-player-fingers';

export class MultiPlayerMatch extends Match {
  constructor(client: DiscordClient, stadium: TextChannel, challenger: User) {
    super(client, stadium, challenger);

    this.selectOpponent();
  }

  async selectOpponent() {
    try {
      const opponentAnswer = await ask(this.client, this.challenger, this.stadium, `Whom do you want to challenge? (@mention)`);
      if (opponentAnswer.msg.mentions.users.array()[0]) {
        const potentialOpponent = opponentAnswer.msg.mentions.users.array()[0];

        if (potentialOpponent.id === this.challenger.id) return this.comment(`Challenger <@${this.challenger.id}> tried to battle themself. Wow, cowardness at its max.`);

        try {
          const doesAccept = await ask(this.client, potentialOpponent, this.stadium, `Do you accept the challenge? (yes/no)`);

          switch (doesAccept.answer.trim().toLowerCase()) {
            case 'yes':
              this.comment(`<@${potentialOpponent.id}> has accepted the challenge!`);
              this.opponent = potentialOpponent;
              this.startMatch();

              break;
            default:
              this.comment(`<@${potentialOpponent.id}> doesn't consider <@${this.challenger.id}> worthy of competing with.`);
          }
        }
        catch (e) {
          this.comment(`<@${potentialOpponent.id}> didn't have the courage to reply.`);
        }
      }
      else this.comment(`Challenger <@${this.challenger.id}> either couldn't find a worthy opponent or got scared and ran away.`);
    }
    catch (e) {
      this.comment(`Challenger <@${this.challenger.id}> ran straight to the loo.`);
    }
  }

  async startMatch() {
    try {
      const tossAnswer = await toss(this.opponent, this.client, this.stadium);

      let tossWinner: Players;
      if (tossAnswer === Math.floor(Math.random()*2)) tossWinner = Players.OPPONENT;
      else tossWinner = Players.CHALLENGER;

      try {
        const batBowl = await askBatBowl(
          tossWinner === Players.CHALLENGER ? this.challenger : this.opponent,
          this.client,
          this.stadium
        )

        if (batBowl === BatBowl.BAT) this.opener = tossWinner;
        else this.opener = tossWinner === Players.CHALLENGER ? Players.OPPONENT : Players.CHALLENGER;

        this.comment(`${tossWinner === Players.CHALLENGER ? 'Challenger' : 'Opponent'}\
 <@${tossWinner === Players.CHALLENGER ? this.challenger.id : this.opponent.id}> won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
        this.comment(`Match starting in 5s`);
        setTimeout(() => this.play(), 5000);
      }
      catch (e) {
        this.comment(`The challenger walked out of the stadium.`);
        return e;
      }
    }
    catch (e) {
      this.comment(`The challenger never entered the stadium.`);
      return e;
    }
  }

  inningsOver() {
    this.opponent.send(`Innings over, see score board in <#${this.stadium.id}>`);
    this.challenger.send(`Innings over, see score board in <#${this.stadium.id}>`);

    super.inningsOver();
  }

  /**
   * @param batsman Which player is the batsman
   * @param batsmanPlayed Number of fingers
   * @param bowlerPlayed Number of fingers
   */
  calculateRoundResult(batsmanPlayed: number, bowlerPlayed: number) {
    const batsman = (this.numInnings === 0 && this.opener === Players.CHALLENGER) ? this.challenger : this.opponent;
    const bowler = (this.numInnings === 0 && this.opener === Players.CHALLENGER) ? this.opponent : this.challenger;

    batsman.send(`${bowlerPlayed}!`);
    bowler.send(`${batsmanPlayed}!`);

    super.calculateRoundResult(batsmanPlayed, bowlerPlayed);
  }

  async getChallengerFingers() {
    return getPlayerFingersDM(this.client, this.challenger);
  }

  async getOpponentFingers() {
    return getPlayerFingersDM(this.client, this.opponent);
  }
}

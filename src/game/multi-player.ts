import { Match, Players } from './match';
import { DiscordClient } from '../util/discord-client';
import { TextChannel, User } from 'discord.js';
import { ErrorMessages, ask } from '../util/ask';
import { toss } from '../util/toss';
import { askBatBowl, BatBowl } from '../util/ask-bat-bowl';
import { getPlayerFingers } from '../util/get-player-fingers';

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
\ \ \ \ <@${tossWinner === Players.CHALLENGER ? this.challenger.id : this.opponent.id}> won the toss and chose to ${batBowl === BatBowl.BAT ? 'bat' : 'bowl'}`);
        this.play();
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

  async getChallengerFingers(): Promise<ErrorMessages | number> {
    return getPlayerFingers(this.client, this.stadium, this.challenger);
  }

  async getOpponentFingers(): Promise<ErrorMessages | number> {
    return getPlayerFingers(this.client, this.stadium, this.opponent);
  }
}

import { Match, Players } from '../../util/match';
import { DiscordClient } from '../../util/DiscordClient';
import { TextChannel, User } from 'discord.js';

export class SinglePlayerMatch extends Match {
  constructor(client: DiscordClient, stadium: TextChannel, challenger: User) {
    super(client, stadium, challenger);
    this.opponent = client.user;
  }

  startMatch() {
    this.toss(this.challenger, this.client, this.stadium, (botWonToss: boolean) => {
      this.opener = botWonToss ? Players.OPPONENT : Players.CHALLENGER;
      this.currentBatsman = botWonToss ? Players.OPPONENT : Players.CHALLENGER;


    })
  }
}

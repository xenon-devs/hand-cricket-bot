import { Match, Players } from '../match/match';
import { DiscordClient } from '../../util/discord-client';
import { TextChannel, User, DMChannel } from 'discord.js';
import { ErrorMessages } from '../../util/ask';
import { getPlayerFingers } from '../../util/get-player-fingers';

import { startMatch } from './start-match';

export class SinglePlayerMatch extends Match {
  private startMatch = startMatch;

  constructor(
    client: DiscordClient,
    stadium: TextChannel | DMChannel,
    challenger: User,
    matchEndedCb: () => void
  ) {
    super(client, stadium, challenger, matchEndedCb);
    this.opponent = this.client.user;

    this.startMatch();
  }

  calculateRoundResult(
    batsmanPlayed: number,
    bowlerPlayed: number
  ) {
    const opponentScore = (this.numInnings === 0 && this.opener === Players.OPPONENT || this.numInnings === 1 && this.opener === Players.CHALLENGER) ? batsmanPlayed : bowlerPlayed; // Bot's score
    this.stadium.send(`${opponentScore}!`);

    if (batsmanPlayed !== bowlerPlayed) {
      if (batsmanPlayed === 6) this.comment(this.getRandomComment(this.COMMENT_CATEGORIES.SIX));
      else if (batsmanPlayed === 4) this.comment(this.getRandomComment(this.COMMENT_CATEGORIES.BOUNDARY));
    }
    else this.comment(this.getRandomComment(this.COMMENT_CATEGORIES.OUT));

    super.calculateRoundResult(batsmanPlayed, bowlerPlayed);
  }

  async getChallengerFingers(): Promise<ErrorMessages | number> {
    return getPlayerFingers(this.client, this.stadium, this.challenger, (handlerName) => this.associatedListeners.push(handlerName));
  }

  async getOpponentFingers(): Promise<ErrorMessages | number> {
    const fingers =  Math.min(Math.floor(Math.random()*7), 6);

    return fingers;
  }
}

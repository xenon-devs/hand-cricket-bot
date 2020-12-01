import { Match, Players, MatchResult } from '../match/match';
import { DiscordClient } from '../../util/discord-client';
import { TextChannel, User, DMChannel } from 'discord.js';
import { ErrorMessages, ask } from '../../util/ask';
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

  async inningsOver() {
    if (
      this.client.dblIntegration &&
      (
        (this.opener === Players.CHALLENGER && this.numInnings === 0) ||
        (this.opener === Players.CHALLENGER && this.numInnings === 1 && this.chaserScore >= this.openerScore) ||
        (this.opener === Players.OPPONENT && this.numInnings === 1 && this.chaserScore <= this.openerScore)
      )
    ) {
      const hasVoted = await this.client.dbl.hasVoted(this.challenger.id);

      if (!hasVoted) {
        try {
          const answer = await ask(
            this.client,
            this.challenger,
            this.stadium,
            `Congratulations! You got a free hit on this ball! You can only get one every 12h. You will have to vote on top.gg(for free) to continue playing the game. Would you like to take it (yes/no)?`,
            60 * 1000,
            () => {}
          )

          if (answer.answer.trim().toLowerCase() === 'yes') {
            this.stadium.send(`<@${this.challenger.id}> Click on the link below. Sign in with your discord account, vote and come back in 5 min. \n https://top.gg/bot/${this.client.user.id}/vote`);

            try {
              const answer = await ask(
                this.client,
                this.challenger,
                this.stadium,
                `Type anything once you have voted.`,
                5 * 60 * 1000,
                () => {}
              )

              if (answer) {
                const hasVoted = await this.client.dbl.hasVoted(this.challenger.id);

                if (hasVoted) {
                  this.comment('FREE HIT! The player will continue playing.');

                  if (this.opener === Players.CHALLENGER && this.numInnings === 1) this.chaserScore -= this.lastOpponentFingers;

                  this.result === MatchResult.ONGOING;
                  this.play();
                }
                else {
                  this.stadium.send('Looks like you did not vote.');
                  super.inningsOver();
                }
              }
              else super.inningsOver();
            }
            catch {
              super.inningsOver();
            }
          }
          else super.inningsOver();
        }
        catch {
          super.inningsOver();
        }
      }
    }
    else super.inningsOver();
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

import { MultiPlayerMatch } from './multi-player';
import { ask } from '../../util/ask';

export async function selectOpponent(this: MultiPlayerMatch) {
  try {
    const opponentAnswer = await ask(
      this.client,
      this.challenger,
      this.stadium,
      `Whom do you want to challenge? (@mention)`,
      20000,
       (handlerName) => this.associatedListeners.push(handlerName)
    )
    if (opponentAnswer.msg.mentions.users.array()[0]) {
      const potentialOpponent = opponentAnswer.msg.mentions.users.array()[0];

      if (potentialOpponent.id === this.challenger.id) {
        this.matchEndedCb();
        return this.comment(`Challenger <@${this.challenger.id}> tried to battle themself.`);
      }

      try {
        this.comment(`Challenger <@${this.challenger.id}> challenged <@${this.opponent.id}> to a ${this.gameMode}`);
        const doesAccept = await ask(
          this.client, potentialOpponent,
          this.stadium,
          `Do you accept the challenge? (yes/no)`,
          20000,
          (handlerName) => this.associatedListeners.push(handlerName)
        )

        switch (doesAccept.answer.trim().toLowerCase()) {
          case 'yes':
            this.comment(`<@${potentialOpponent.id}> has accepted the challenge!`);
            this.opponent = potentialOpponent;
            this.startMatch();

            break;
          default:
            this.matchEndedCb();
            this.comment(this.getRandomComment(this.COMMENT_CATEGORIES.FORFEIT, { forfeiterId: potentialOpponent.id }));
        }
      }
      catch (e) {
        this.matchEndedCb();
        this.comment(this.getRandomComment(this.COMMENT_CATEGORIES.FORFEIT, { forfeiterId: potentialOpponent.id }));
      }
    }
    else {
      this.matchEndedCb();
      this.comment(this.getRandomComment(this.COMMENT_CATEGORIES.FORFEIT, { forfeiterId: this.challenger.id }));
    }
  }
  catch (e) {
    this.matchEndedCb();
    this.comment(this.getRandomComment(this.COMMENT_CATEGORIES.FORFEIT, { forfeiterId: this.challenger.id }));
  }
}

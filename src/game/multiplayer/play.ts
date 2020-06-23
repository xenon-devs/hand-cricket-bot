import askDM from '../../util/askDM';
import { Client, TextChannel, User } from 'discord.js';

export type playCb = (outputObj: {
  bothAnswered: boolean,
  batsmansAnswer?: number, // Only present if bothAnswered is true
  bowlersAnswer?: number
}) => void

/**
 * @description Asks both the players to play (type finger numbers) in DM and waits for the reply.
 * @param client The main discord.js client object
 * @param stadium The stadium AKA discord channel where the match initially started.
 * @param batsman The batsman's User object.
 * @param bowler The bowler's User object.
 * @param cb A callback that fires when both players answered (and also when one or both didn't answer but with an error).
 */
function play(
  client: Client,
  stadium: TextChannel,
  batsman: User,
  bowler: User,
  cb: playCb
) {
  let playersAnswered = 0;
  let batsmansAnswer: number, bowlersAnswer: number;

  const answerHandler = (player: User, ans: string, isBatsman: boolean) => {
    const answerNumber = Number(ans); // Convert string to number

    if (answerNumber > 6 || answerNumber < 0 || isNaN(Number(answerNumber))) {
      askDM(client, player, `Do you have *${ans}* fingers? Really?`, (ans: string) => answerHandler(player, ans, isBatsman), () => {
        stadium.send(`Coward <@${player.id}> didn't respond so the match ended.`);

        if (!isBatsman) batsman.send(`Your coward opponent didn't respond so the match ended.`);
        else  bowler.send(`Your coward opponent didn't respond so the match ended.`);

        cb({
          bothAnswered: false
        })
      })
    }
    else {
      playersAnswered++;
      if (isBatsman) batsmansAnswer = answerNumber;
      else bowlersAnswer = answerNumber;

      if (playersAnswered == 2) cb({
        bothAnswered: true,
        batsmansAnswer,
        bowlersAnswer
      })
    }
  }

  askDM(client, batsman, 'Show me your fingers!... *Using keyboard stupid*', (ans: string) => answerHandler(batsman, ans, true), () => {
    stadium.send(`Coward <@${batsman.id}> didn't respond so the match ended.`);
    bowler.send(`Your coward opponent didn't respond so the match ended.`);

    cb({
      bothAnswered: false
    })
  })

  askDM(client, bowler, 'Show me your fingers!... *Using keyboard stupid*', (ans: string) => answerHandler(bowler, ans, false), () => {
    stadium.send(`Coward <@${bowler.id}> didn't respond so the match ended.`);
    batsman.send(`Your coward opponent didn't respond so the match ended.`);

    cb({
      bothAnswered: false
    })
  })
}

export default play;
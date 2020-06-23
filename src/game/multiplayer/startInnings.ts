import play, { playCb } from  './play';
import { TextChannel, Client, User } from 'discord.js';

type inningsCallback = (outputObj: {
  score: number,
  chaseWon?: boolean
}) => void

/**
 * @description Starts an innings and handles it till the end.
 * @param client The main discord.js client object.
 * @param stadium The stadium AKA the discord channel where the match was started.
 * @param batsman The discord.js User object for the batsman.
 * @param bowler The discord.js User object for the bowler.
 * @param isChase Wheter it is the first innings or the chase.
 * @param chaseTarget Thevtarget score to chase, if it is a chase.
 * @param cb Callback that is fired at the end of the innings.
 */
function startInnings(
  client: Client,
  stadium: TextChannel,
  batsman: User,
  bowler: User,
  isChase: boolean,
  chaseTarget: number,
  cb: inningsCallback = console.log
) {
  stadium.send(`Starting innings in 5s, be ready in DM, <@${batsman.id}> is going to bat.`);

  batsman.send('You will be batting in 5s');
  bowler.send('You will be bowling in 5s');

  let score = 0;

  const playCbHandler: playCb = (out) => {
    if (out.bothAnswered) {
      if (out.batsmansAnswer == out.bowlersAnswer) {
        batsman.send(`Opponent showed ${out.bowlersAnswer}. You are out! What are you doing?`);
        bowler.send(`Opponent showed ${out.batsmansAnswer}. Clean bowled! Great!`);

        cb({score});
      }
      else {
        score += out.batsmansAnswer;
        batsman.send(`Opponent showed ${out.bowlersAnswer}. You scored ${out.batsmansAnswer} runs! Keep it up!`);
        bowler.send(`Opponent showed ${out.batsmansAnswer}. Your opponent scored ${out.batsmansAnswer} runs. What are you doing????`);

        play(client, stadium, batsman, bowler, playCbHandler);
      }
    }
  }

  setTimeout(() => {
    stadium.send('Match started.');
    play(client, stadium, batsman, bowler, playCbHandler);
  }, 5000)
}

export default startInnings;
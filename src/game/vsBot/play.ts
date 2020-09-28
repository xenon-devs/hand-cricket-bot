import ask from '../../util/ask';
import getRandomFingers from './getRandomFingers';
import { User, TextChannel } from 'discord.js';
import DiscordClient from '../../util/DiscordClient';

type playCallback = (outputObj: {botLost: boolean, addBotScore?: number, addPlayerScore?: number}) => void;

const showFingersHandler = (
  answer: string,
  client: DiscordClient,
  player: User,
  channel: TextChannel,
  difficulty: number,
  cb: Function
) => {
  let fingers = Number(answer.toLowerCase().trim());
  if (isNaN(fingers) || fingers > 6 || fingers < 0) ask(client, player, channel, `Do you have *${answer}* fingers? Really?`, answer => showFingersHandler(answer, client, player, channel, difficulty, cb))
  else {
    if (fingers > 6) fingers = 6;
    if (fingers < 0) fingers = 0;

    cb(fingers);
  }
}

/**
 * @description Asks the player to show fingers and waits for the reply.
 * @param client The main discord.js Client object.
 * @param player The User object for the player who is playing.
 * @param channel The channel in which the match is happening.
 * @param isBotBatting Whether the bot is batting.
 * @param difficulty A number signifying the difficulty (0 -> easy; 1 -> medium; 2 -> hard)
 * @param playerMoveHistory An array containing all of the player's past moves.
 * @param cb The callback that is fired when the player answers.
 */
function play(
  client: DiscordClient,
  player: User,
  channel: TextChannel,
  isBotBatting: boolean,
  difficulty: number,
  playerMoveHistory: number[],
  cb: playCallback
) {
  ask(
    client,
    player,
    channel,
    `Show your fingers.. *Using keyboard stupid*`,
    answer => showFingersHandler(
      answer,
      client,
      player,
      channel,
      difficulty,
      (playerFingers: number) =>
      {
        const botFingers = getRandomFingers(playerFingers, isBotBatting, difficulty, playerMoveHistory);

        playerMoveHistory.push(playerFingers);


        channel.send(`${botFingers}!`);

        if (isBotBatting) {
          if (botFingers === playerFingers) return cb({
            botLost: true
          })
          else return cb({
            botLost: false,
            addBotScore: botFingers
          })
        }
        else {
          if (botFingers === playerFingers) return cb({
            botLost: false
          })
          else return cb({
            botLost: true,
            addPlayerScore: playerFingers
          })
        }
      }
    )
  )
}

export default play;

import toss from '../../util/toss';
import ask from'../../util/ask';
import askBatBowl from '../../util/askBatBowl';
import startInnings from './startInnings';
import { TextChannel, Message } from 'discord.js';
import DiscordClient from '../../util/DiscordClient';

/**
 * @description Starts a new match v/s bot.
 * @param client The main discord.js Client object.
 * @param channel The channel in which the match is happening.
 * @param msg The command message that triggered the match.
 */
function startGame(
  client: DiscordClient,
  channel: TextChannel,
  msg: Message
) {
  const player = msg.author;

  ask(client, player, channel, 'Difficult Level(`easy`, `medium`, or `hard` ?)', answer => {
    let difficulty: number;

    switch(answer.trim().toLowerCase()) {
      case 'easy':
        difficulty = 0;
        break;
      case 'medium':
        difficulty = 1;
        break;
      case 'hard':
        difficulty = 2;
        break;
      default:
        channel.send('You didn\'t specify a difficulty, defaulting to `HARD`')
        difficulty = 2;
    }

    channel.send('Game Starting in 3 seconds.');

    setTimeout(() => toss(player, client, channel, (tossWon: boolean) => {
      if (tossWon) {
        const batBowl = ['bat', 'bowl'];
        const myTurn = batBowl[Math.floor(Math.random()*2)];

        channel.send(`I\'m going to ${myTurn}`);
        startInnings(client, channel, player, myTurn === 'bat', difficulty);
      }
      else {
        askBatBowl(client, player, channel, (answer: string) => {
          if (answer == 'bat') startInnings(client, channel, player, false, difficulty);
          else startInnings(client, channel, player, true, difficulty);
        })
      }
    }), 3000)

  })
}

export default startGame;

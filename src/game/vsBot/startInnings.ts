import play from './play';
import { Client, TextChannel, User } from 'discord.js';

/**
 * @description Handles a full innings.
 * @param client The main discord.js Client object.
 * @param channel The channel in which the match is happening.
 * @param player The User object for the player who is playing.
 * @param botIsBatting Whether the bot is batting.
 * @param difficulty A number signifying the difficulty (0 -> easy; 1 -> medium; 2 -> hard)
 * @param chase Whether it is the chase innings or not.
 * @param chaseTarget The target score to chase.
 */
function startInnings(
  client: Client,
  channel: TextChannel,
  player: User,
  botIsBatting: boolean,
  difficulty: number,
  chase: boolean = false,
  chaseTarget?: number
) {
  channel.send('Starting Innings');
  let playerMoveHistory: number[] = [];
  let botScore = 0, playerScore = 0, isBatsmanPlaying = true;

  if (chase) {
    if (botIsBatting) {
      playerScore = chaseTarget;
      channel.send(`Bot needs to score ${chaseTarget} runs to win.`);
    }
    else {
      botScore = chaseTarget;
      channel.send(`<@${player.id}> needs to score ${chaseTarget} runs to win.`);
    }
  }

  if (botIsBatting) channel.send(`<@${player.id}> is going to bowl.`);
  else channel.send(`<@${player.id}> is going to bat.`);

  if (isBatsmanPlaying) {
    const playTurn = () => {
      play(client, player, channel, botIsBatting, difficulty, playerMoveHistory, (playResult) => {
        if (botIsBatting) {
          if (playResult.botLost) {
            if (chase && chaseTarget > botScore) channel.send(`Bot couldn\'t chase the target. <@${player.id}> won the match :trophy:!`);
            else {
              channel.send('Bot is finally out.Heading over to the next innings.');
              startInnings(client, channel, player, false, difficulty, true, botScore + 1);
            }
          }
          else {
            botScore += playResult.addBotScore;

            if (chase && chaseTarget <= botScore) {
              channel.send(`Bot won the match :trophy:!`);
            }
            else playTurn();
          }
        }
        else {
          if (playResult.botLost) {
            playerScore += playResult.addPlayerScore;

            if (chase && chaseTarget <= playerScore) {
              channel.send(`<@${player.id}> won the match :trophy:!`);
            }
            else playTurn();
          }
          else {
            if (chase && chaseTarget > playerScore) {
              channel.send(`<@${player.id}> couldn\'t chase the target. Bot won the match :trophy:!`);
            }
            else {
              if (difficulty === Infinity) channel.send('Player is out. (Obviously :smirk:). Heading over to the next innings (to land the death blow)')
              else channel.send('Player is finally out. Heading over to the next innings.');
              startInnings(client, channel, player, true, difficulty, true, playerScore + 1);
            }
          }
        }
      })
    }
    playTurn();
  }
}

export default startInnings;
import ask from './ask';
import { TextChannel, User } from 'discord.js';
import DiscordClient from './DiscordClient';

const completeToss = (playerToss: string, cb?: (tossWon: boolean) => void) => {
  const myToss = Math.floor(Math.random()*2);
  
  const toss = playerToss === 'heads' ? 0 : 1;

  if (toss === myToss) cb(false);
  else cb(true);
}

const onTossDone = (tossWon: boolean, channel: TextChannel, cb?: Function) => {
  if (!tossWon) channel.send('You won the toss, but that doesn\'t mean you\'ll win the match');
  else channel.send('You lost the toss.');

  cb(tossWon);
}

const tossCheckHandler = (client: DiscordClient, player: User, channel: TextChannel, answer: string, cb?: Function) => {
  switch(answer.trim().toLowerCase()) {
    case 'heads':
      completeToss('heads', tossWon => onTossDone(tossWon, channel, cb))
      break;
    case 'tails':
      completeToss('tails', tossWon => onTossDone(tossWon, channel, cb))
      break;
    default:
      ask(client, player, channel,'Can\'t you answer heads or tails? Useless fellow.',  answer => tossCheckHandler(client, player, channel, answer, cb))
      break; 
  }
}

/**
 * 
 * @param {User} player Discord.js User object of the player who selects the toss.
 * @param {Client} client The main discord.js client object.
 * @param {TextChannel} channel The channel in which the coin is flipped.
 * @param {function} cb A callback that is run when the toss completes. The only parameter is a boolean which is true when the player loses (bot wins).
 */
const toss = (player: User, client: DiscordClient, channel: TextChannel, cb?: Function) => {
  channel.send('TOSS:');  
  ask(client, player, channel, 'Heads or Tails?', (answer: string) => tossCheckHandler(client, player, channel, answer, cb));
}

export default toss;
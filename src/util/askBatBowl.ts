import ask from './ask';
import { TextChannel, User } from 'discord.js';
import DiscordClient from './DiscordClient';

/**
 * @description Asks the toss winning player whether they want to bat or bowl and waits for the reply.
 * @param {DiscordClient} client The main discord.js Client object.
 * @param {User} askTo Discord.js user to ask to.
 * @param {TextChannel} channel Discord.js text channel object to ask in.
 * @param {fucntion} cb Callback upon receiving the answer. With the only parameter being 'bat'|'bowl'.
 */
function askBatBowl(
  client: DiscordClient,
  askTo: User,
  channel: TextChannel,
  cb: Function = console.log
) {
  const askBatBowlHandler = (client: DiscordClient, askTo: User, channel: TextChannel, answer: string) => {
    switch(answer.trim().toLowerCase()) {
      case 'bat':
        cb('bat');
        break;
      case 'bowl':
        cb('bowl');
        break;
      default:
        ask(client, askTo, channel,'Can\'t you answer bat or bowl? Useless fellow.',  answer => askBatBowlHandler(client, askTo, channel, answer))
        break; 
    }
  }
  
  ask(client, askTo, channel, 'Want to bat or bowl?', answer => askBatBowlHandler(client, askTo, channel, answer));
}

export default askBatBowl;
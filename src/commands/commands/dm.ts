import { Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';

export function setDM(client: DiscordClient) {
  client.onCommand('dm', `You've received mail ;)`, (msg: Message) => msg.author.send('You can use any commands here.'));

  return {
    name: 'dm',
    desc: `Sends a DM so that the user can play versus bot privately.`
  }
}

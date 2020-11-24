import { Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';

export function setDM(client: DiscordClient) {
  return setCommand(
    client,
    'dm',
    'Sends a DM so that the user can play versus bot privately.',
    `You've received mail ;)`,
    (msg: Message) => msg.author.send('You can use any commands here.')
  )
}

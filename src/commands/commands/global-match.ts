import { Message,  User, TextChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { GlobalMatch } from '../../game/global/global';

const matchQueue: User[] = [];

export function setGlobal(
  client: DiscordClient,
  currentGlobalMatches: Map<string, GlobalMatch>
) {
  return setCommand(
    client,
    'global',
    'Find a global multiplayer match. You will be matched up against global discord players if a player is found.',
    '',
    (msg: Message) => {
      if (matchQueue.includes(msg.author)) msg.channel.send('You are already in the queue.');
      else {
        if (matchQueue.length === 0) {
          matchQueue.push(msg.author);
          msg.channel.send('You are added to the queue.');
        }
        else {
          const opponent = matchQueue.pop();

          currentGlobalMatches.set(
            msg.author.id,
            new GlobalMatch(
              client,
              <TextChannel>msg.channel,
              msg.author,
              opponent,
              () => {currentGlobalMatches.delete(msg.author.id)}
            )
          )
        }
      }
    }
  )
}

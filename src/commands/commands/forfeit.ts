import { Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { SinglePlayerMatch } from '../../game/single-player/single-player';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';

export function setForfeit(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>
) {
  return setCommand(
    client,
    'forfeit',
    'Forfeits the currently ongoing match.',
    '',
    (msg: Message) => {
      current1PMatches.forEach(match => match.forfeit(msg.author.id));
      current2PMatches.forEach(match => match.forfeit(msg.author.id));
    }
  )
}

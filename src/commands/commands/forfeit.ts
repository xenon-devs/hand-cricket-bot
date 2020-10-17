import { Message } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { SinglePlayerMatch } from '../../game/single-player/single-player';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';

export function setForfeit(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>
) {
  client.onCommand(
    'forfeit',
    'Coward!',
    (msg: Message) => {
      current1PMatches.forEach(match => match.forfeit(msg.author.id));
      current2PMatches.forEach(match => match.forfeit(msg.author.id));
    }
  )

  return {
    name: 'forfeit',
    desc: `Forfeits the currently ongoing match. (Only for cowards)`
  }
}

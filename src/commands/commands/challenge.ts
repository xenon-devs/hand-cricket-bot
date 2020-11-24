import { Message, TextChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { SinglePlayerMatch } from '../../game/single-player/single-player';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';

export function setChallenge(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>
) {
  return setCommand(
    client,
    'challenge',
    'Challenge a person to multiplayer battle (where each player answers in DM)',
    '',
    (msg: Message) => {
      if (msg.channel.type != 'dm') {
        let eligibleToPlay = true;
        current1PMatches.forEach(match => eligibleToPlay = !(match.challenger.id === msg.author.id));
        current2PMatches.forEach(match => eligibleToPlay = !(match.challenger.id === msg.author.id || match.opponent.id === msg.author.id));

        const matchId = msg.author.id;

        if (eligibleToPlay) current2PMatches.set(matchId, new MultiPlayerMatch(client, <TextChannel>msg.channel, msg.author, () => current2PMatches.delete(matchId)));
        else msg.channel.send(`Want to play two matches at once? Hahaha, your sense of humor is good.`);
      }
    }
  )
}

import { Message, TextChannel, DMChannel, User } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { SinglePlayerMatch } from '../../game/single-player/single-player';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';
import { GlobalMatch } from '../../game/global/global';

export function setPlay(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>,
  currentGlobalMatches: Map<string, GlobalMatch>,
  matchmakingQueue: User[]
) {
  return setCommand(
    client,
    'play',
    'Start a game with the bot. This command will also work in a DM with the bot.',
    '',
    (msg: Message, prefix: string) => {
      let eligibleToPlay = true;

      if (matchmakingQueue.includes(msg.author)) return msg.channel.send(`You are already present in the global matchmaking queue. To play a match, first quit the queue using \`${prefix}quit\` command.`)

      current1PMatches.forEach(match => eligibleToPlay = !(match.challenger.id === msg.author.id));
      current2PMatches.forEach(match => eligibleToPlay = !(match.challenger.id === msg.author.id || match.opponent.id === msg.author.id));
      currentGlobalMatches.forEach(match => eligibleToPlay = !(match.challenger.id === msg.author.id || match.opponent.id === msg.author.id));

      const matchId = msg.author.id;

      if (eligibleToPlay) current1PMatches.set(
        matchId,
        new SinglePlayerMatch(
          client,
          <TextChannel | DMChannel>msg.channel,
          msg.author,
          () => current1PMatches.delete(matchId)
        )
      )
      else msg.channel.send(`Want to play two matches at once? Hahaha, your sense of humor is good.`);
    }
  )
}

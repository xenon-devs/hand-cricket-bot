import { Message, TextChannel, DMChannel } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { SinglePlayerMatch } from '../../game/single-player';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';

export function setPlay(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>
) {
  client.onCommand(
    'play',
    '',
    async (msg: Message) => {
      let eligibleToPlay = true;
      current1PMatches.forEach(match => eligibleToPlay = !(match.challenger.id === msg.author.id));
      current2PMatches.forEach(match => eligibleToPlay = !(match.challenger.id === msg.author.id || match.opponent.id === msg.author.id));

      const matchId = msg.author.id;

      if (eligibleToPlay) current1PMatches.set(matchId, new SinglePlayerMatch(client, <TextChannel | DMChannel>msg.channel, msg.author, () => current1PMatches.delete(matchId)));
      else msg.channel.send(`Want to play two matches at once? Hahaha, your sense of humor is good.`);
    }
  )

  return {
    name: 'play',
    desc: `Start a game with the bot. This command will also work in a DM with the bot.`
  }
}

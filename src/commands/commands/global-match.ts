import { Message,  User, TextChannel, MessageEmbed } from 'discord.js';
import { DiscordClient } from '../../util/discord-client';
import { setCommand } from '../command';
import { GlobalMatch } from '../../game/global/global';
import { MultiPlayerMatch } from '../../game/multi-player/multi-player';
import { SinglePlayerMatch } from '../../game/single-player/single-player';

export function setGlobal(
  client: DiscordClient,
  current1PMatches: Map<string, SinglePlayerMatch>,
  current2PMatches: Map<string, MultiPlayerMatch>,
  currentGlobalMatches: Map<string, GlobalMatch>,
  matchmakingQueue: User[]
) {
  return setCommand(
    client,
    'global',
    'Find a global multiplayer match. You will be matched up against global discord players if a player is found.',
    '',
    async (msg: Message) => {
      let eligibleToPlay = true;

      if (client.dblIntegration) {
        eligibleToPlay = await client.dbl.hasVoted(msg.author.id);

        if (!eligibleToPlay) msg.channel.send(`Currently this feature is only available to those who have voted for Hand Cricketer on top.gg. You can vote using your discord account at https://top.gg/bot/${client.user.id}/vote.`);
      }

      let noOtherMatch = true;
      current1PMatches.forEach(match => noOtherMatch = eligibleToPlay = !(match.challenger.id === msg.author.id));
      current2PMatches.forEach(match => noOtherMatch = eligibleToPlay = !(match.challenger.id === msg.author.id || match.opponent.id === msg.author.id));
      currentGlobalMatches.forEach(match => noOtherMatch = eligibleToPlay = !(match.challenger.id === msg.author.id || match.opponent.id === msg.author.id));

      if (!noOtherMatch) msg.channel.send(`Want to play two matches at once? Hahaha, your sense of humor is good.`);

      if (eligibleToPlay) {
        if (matchmakingQueue.includes(msg.author)) msg.channel.send('You are already in the queue.');
        else {
          if (matchmakingQueue.length === 0) {
            matchmakingQueue.push(msg.author);
            msg.channel.send(
              new MessageEmbed()
              .setTitle('Finding a Match')
              .setColor('RED')
              .setThumbnail(client.user.displayAvatarURL())
              .setImage('https://raw.githubusercontent.com/xenon-devs/hand-cricket-bot/master/assets/searching.gif')
              .setDescription('You have been added to the queue. This might take a while. You will get a DM from the bot as soon as a match is found.')
              .setFooter('By Team Xenon', 'https://raw.githubusercontent.com/xenon-devs/xen-assets/main/xen-inc/logo/xen-logo-black-bg.png')
              .setTimestamp()
            )
          }
          else {
            const opponent = matchmakingQueue.pop();

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
    }
  )
}

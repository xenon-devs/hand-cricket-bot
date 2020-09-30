import ask from '../../util/ask';
import startMatch from './startMatch';
import { DiscordClient } from '../../util/DiscordClient';
import { Client, TextChannel, Message } from 'discord.js';

/**
 * @description Starts the match between two players on running a command.
 * @param client The main discord.js client object
 * @param channel The channel in which the match started.
 * @param msg The msg which started the command.
 */
function startChallenge(
  client: DiscordClient,
  channel: TextChannel,
  msg: Message
) {
  const challenger = msg.author,
    stadium = channel;

  ask(client, challenger, stadium, 'Who do you want to challenge? (please @mention)', (ans, ansMsg) => {
    const opponentMentions = ansMsg.mentions;

    if (opponentMentions.everyone) return stadium.send('Want to battle everyone at once? Who do you think you are?');
    if (opponentMentions.members.array().length == 0) return stadium.send(`Don't want to battle anyone? Coward!`);
    const opponent = opponentMentions.members.array()[0].user;

    if (opponent.id == challenger.id) return stadium.send('Challenging yourself? Scared to fight others? Lol.');

    ask(client, opponent, stadium, 'Do you accept the challenge? (yes/no)', ans => {
      if (!(ans.trim().toLowerCase() == 'yes')) return stadium.send(`<@${opponent.id}> got scared :smirk:`);
      else {
        startMatch(client, stadium, challenger, opponent);
      }
    })
  })
}

export default startChallenge;

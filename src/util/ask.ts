import { User, TextChannel, DMChannel, Message } from 'discord.js';
import { DiscordClient } from './discord-client';

export enum ErrorMessages {
  DID_NOT_ANSWER = 'did_not_answer'
}

/**
 * @description Ask a question to a specific discord user and wait for the answer in a specific channel.
 * @param client The main discord.js client object.
 * @param askTo Discord.js user object of the user to ask.
 * @param channel Discord.js channel to ask the question in.
 * @param question Question as a string (including ?).
 * @param timeout Timeout in ms, default 20000.
 */
export async function ask(
  client: DiscordClient,
  askTo: User,
  channel: TextChannel | DMChannel,
  question: string,
  timeout = 20000
) {
  return new Promise((resolve: (value: {answer: string, msg: Message}) => void, reject: (error: ErrorMessages) => void) => {
    channel.send(`<@${askTo.id}> ${question}`);
    const notAnsweredHandler = async () => {
      channel.send(`<@${askTo.id}> You didn't answer in ${timeout / 1000}s, now your chance is gone.`);
      client.offMsg(`${question}@${askTo.id}#${channel.id}`);

      reject(ErrorMessages.DID_NOT_ANSWER);
    }
    let notAnsweredTimeout: NodeJS.Timeout;
    notAnsweredTimeout = setTimeout(notAnsweredHandler, timeout);

    const finalAnswerHandler = (msg: Message) => {
      if (msg.author.id === askTo.id && msg.channel.id === channel.id) {
        const answer = msg.content;

        clearTimeout(notAnsweredTimeout);
        client.offMsg(`${question}@${askTo.id}#${channel.id}`);
        resolve({
          answer,
          msg
        })
      }
    }
    client.onMsg({
      name: `${question}@${askTo.id}#${channel.id}`,
      handler: finalAnswerHandler
    })
  })
}

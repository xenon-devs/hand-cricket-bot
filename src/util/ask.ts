import { User, TextChannel, Message, DMChannel } from "discord.js";
import DiscordClient from "./DiscordClient";

type onAnswerCb = (answer: string, msg: Message) => void;

/**
 * @description Ask a question to a specific discord user and wait for the answer in a specific channel.
 * @param {DiscordClient} client The main discord.js client object.
 * @param {User} askTo Discord.js user object of the user to ask.
 * @param {TextChannel} channel Discord.js channel to ask the question in.
 * @param {String} question Question as a string (including ?).
 * @param {function} onAnswerCb Callback that fires when the answer is received. The only parameter is answer (string).
 */
function ask(
  client: DiscordClient,
  askTo: User,
  channel: TextChannel | DMChannel,
  question: string,
  onAnswerCb: onAnswerCb = console.log
) {
  channel.send(`<@${askTo.id}> ${question}`);

  const notAnsweredHandler = () => {
    channel.send(`<@${askTo.id}> You didn't answer in 20s, now your chance is gone.`)
    client.off('message', finalAnswerHandler);
  }
  let notAnsweredTimeout: NodeJS.Timeout;

  const finalAnswerHandler = (msg: Message) => {
    if (msg.author.id === askTo.id && msg.channel.id === channel.id) {
      const answer = msg.content;
      
      clearTimeout(notAnsweredTimeout);
      client.off('message', finalAnswerHandler);
      onAnswerCb(answer, msg);  
    }
  }

  notAnsweredTimeout = setTimeout(notAnsweredHandler, 20000);
  client.on('message', finalAnswerHandler);
}

export default ask;
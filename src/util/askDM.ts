import { User, Message } from 'discord.js';
import DiscordClient from './DiscordClient';

/**
 * @description Asks a question to a discord user in DM.
 * @param {DiscordClient} client The main discord.js client object.
 * @param {User} askTo Disccord.js user object of the user to ask.
 * @param {String} question The question as a string.
 * @param {function} onAnswerCb Callback which is fired if the user answers the question. With the answer and msg object as parameters.
 * @param {function} onNotAnswerCb 
 */
function askDM(
  client: DiscordClient,
  askTo: User,
  question: string,
  onAnswerCb: Function = (ans: string, msg: Message) => console.log(`Answered ${ans} by <@${msg.author.id}>`),
  onNotAnswerCb: Function = () => console.log('Not Answered')
) {
  askTo.send(`<@${askTo.id}> ${question}`).then(dm => {
    const notAnsweredHandler = () => {
      askTo.send(`<@${askTo.id}> You didn't answer in 30s, now your chance is gone.`);
      onNotAnswerCb();
      client.off('message', finalAnswerHandler);
    }
    let notAnsweredTimeout: NodeJS.Timeout;

    const finalAnswerHandler = (msg: Message) => {
      if (msg.author.id === askTo.id && msg.channel.id === dm.channel.id) {
        const answer = msg.content;
        
        clearTimeout(notAnsweredTimeout);
        client.off('message', finalAnswerHandler);
        onAnswerCb(answer, msg);  
      }
    }

    notAnsweredTimeout = setTimeout(notAnsweredHandler, 30000);
    client.onMsg({handler: finalAnswerHandler});
  })

}

export default askDM;
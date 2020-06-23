const { Client } = require("discord.js");

/**
 * @description Ask a question to a specific discord user and wait for the answer in a specific channel.
 * @param {Client} client The main discord.js client object.
 * @param {User} askTo Discord.js user object of the user to ask.
 * @param {TextChannel} channel Discord.js channel to ask the question in.
 * @param {String} question Question as a string (including ?).
 * @param {function} onAnswerCb Callback that fires when the answer is received. The only parameter is answer (string).
 */
function ask(client, askTo, channel, question, onAnswerCb = ans => console.log(ans)) {
  channel.send(`<@${askTo.id}> ${question}`);

  const notAnsweredHandler = () => {
    channel.send(`<@${askTo.id}> You didn't answer in 20s, now your chance is gone.`)
    client.off('message', finalAnswerHandler);
  }
  let notAnsweredTimeout;

  const finalAnswerHandler = msg => {
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

module.exports = ask;
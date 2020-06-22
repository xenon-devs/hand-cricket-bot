function ask(client, askTo, channel, question, onAnswerCb) {
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
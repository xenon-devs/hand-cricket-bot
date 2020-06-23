function askDM(client, askTo, question, onAnswerCb, onNotAnswerCb) {
  askTo.send(`<@${askTo.id}> ${question}`).then(dm => {
    const notAnsweredHandler = () => {
      askTo.send(`<@${askTo.id}> You didn't answer in 30s, now your chance is gone.`);
      onNotAnswerCb();
      client.off('message', finalAnswerHandler);
    }
    let notAnsweredTimeout;

    const finalAnswerHandler = msg => {
      if (msg.author.id === askTo.id && msg.channel.id === dm.channel.id) {
        const answer = msg.content;
        
        clearTimeout(notAnsweredTimeout);
        client.off('message', finalAnswerHandler);
        onAnswerCb(answer, msg);  
      }
    }

    notAnsweredTimeout = setTimeout(notAnsweredHandler, 30000);
    client.on('message', finalAnswerHandler);
  })

}

module.exports = askDM;
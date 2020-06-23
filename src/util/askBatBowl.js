const ask = require('./ask');

function askBatBowl(client, askTo, channel, cb) {
  const askBatBowlHandler = (client, askTo, channel, answer) => {
    switch(answer.trim().toLowerCase()) {
      case 'bat':
        cb('bat');
        break;
      case 'bowl':
        cb('bowl');
        break;
      default:
        ask(client, askTo, channel,'Can\'t you answer bat or bowl? Useless fellow.',  answer => askBatBowlHandler(client, askTo, channel, answer))
        break; 
    }
  }
  
  ask(client, askTo, channel, 'Want to bat or bowl?', answer => askBatBowlHandler(client, askTo, channel, answer));
}

module.exports = askBatBowl;

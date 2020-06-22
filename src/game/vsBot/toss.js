const ask = require('../../util/ask');

const completeToss = (playerToss, cb) => {
  const myToss = Math.floor(Math.random()*2);
  
  playerToss = playerToss === 'heads' ? 0 : 1;

  if (myToss === playerToss) cb(false);
  else cb(true);
}

const onTossDone = (tossWon, channel, cb) => {
  if (!tossWon) channel.send('You won the toss, but that doesn\'t mean you\'ll win the match');
  else channel.send('I won the toss, this applies to the match as well.');

  cb(tossWon);
}

const tossCheckHandler = (client, player, channel, answer, cb) => {
  switch(answer.trim().toLowerCase()) {
    case 'heads':
      completeToss('heads', tossWon => onTossDone(tossWon, channel, cb))
      break;
    case 'tails':
      completeToss('tails', tossWon => onTossDone(tossWon, channel, cb))
      break;
    default:
      ask(client, player, channel,'Can\'t you answer heads or tails? Useless fellow.',  answer => tossCheckHandler(client, player, channel, answer, cb))
      break; 
  }
}

const toss = (player, client, channel, cb) => {
  channel.send('TOSS:');  
  ask(client, player, channel, 'Heads or Tails?', answer => tossCheckHandler(client, player, channel, answer, cb));
}

module.exports = toss;
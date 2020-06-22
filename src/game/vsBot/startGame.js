const toss = require('../../util/toss');
const ask = require('../../util/ask');
const startInnings = require('./startInnings');

function startGame(client, channel, msg) {
  const player = msg.author;
  
  ask(client, player, channel, 'Difficult Level(`easy`, `medium`, or `hard` ?)', answer => {
    let difficulty;
    switch(answer.trim().toLowerCase()) {
      case 'easy':
        difficulty = 0;
        break;
      case 'medium':
        difficulty = 1;
        break;
      case 'hard':
        difficulty = 2;
        break;
      default:
        channel.send('You didn\'t specify a difficulty, defaulting to `HARD`')
        difficulty = 2;
    }

    channel.send('Game Starting in 3 seconds.');

    setTimeout(() => toss(player, client, channel, tossWon => {
      if (tossWon) {
        const batBowl = ['bat', 'bowl'];
        const myTurn = batBowl[Math.floor(Math.random()*2)];

        channel.send(`I\'m going to ${myTurn}`);
        startInnings(client, channel, player, myTurn === 'bat', difficulty);
      }
      else {
        const askBatBowlHandler = (client, player, channel, answer) => {
          switch(answer.trim().toLowerCase()) {
            case 'bat':
              startInnings(client, channel, player, false, difficulty);
              break;
            case 'bowl':
              startInnings(client, channel, player, true, difficulty);
              break;
            default:
              ask(client, player, channel,'Can\'t you answer bat or bowl? Useless fellow.',  answer => askBatBowlHandler(client, player, channel, answer))
              break; 
          }
        }
  
        ask(client, player, channel, 'Want to bat or bowl?', answer => askBatBowlHandler(client, player, channel, answer));
      }
    }), 3000)

  })
}

module.exports = startGame;
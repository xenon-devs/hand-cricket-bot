const toss = require('../../util/toss');
const ask = require('../../util/ask');
const askBatBowl = require('../../util/askBatBowl');

function startMatch(client, stadium, challenger, opponent) {
  stadium.send('Starting toss, opponent has to choose.');
  toss(opponent, client, stadium, tossWon => {
    // tossWon is true if challenger wins

    askBatBowl(client, tossWon ? challenger : opponent, stadium, answer => {
      if (answer == 'bat');
      else;
    })
  })
}

module.exports = startMatch;
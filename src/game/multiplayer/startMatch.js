const toss = require('../../util/toss');
const startInnings = require('./startInnings');
const askBatBowl = require('../../util/askBatBowl');

function startMatch(client, stadium, challenger, opponent) {
  stadium.send('Starting toss, opponent has to choose.');
  toss(opponent, client, stadium, tossWon => {
    // tossWon is true if challenger wins

    askBatBowl(client, tossWon ? challenger : opponent, stadium, answer => {
      if (answer == 'bat') startInnings(client, stadium, tossWon ? challenger : opponent, tossWon ? opponent : challenger);
      else startInnings(client, stadium, tossWon ? opponent : challenger, tossWon ? challenger : opponent);
    })
  })
}

module.exports = startMatch;
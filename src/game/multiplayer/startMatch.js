const toss = require('../../util/toss');
const startInnings = require('./startInnings');
const askBatBowl = require('../../util/askBatBowl');

function startMatch(client, stadium, challenger, opponent) {
  stadium.send('Starting toss, opponent has to choose.');
  toss(opponent, client, stadium, tossWon => {
    // tossWon is true if challenger wins
    const tossWinner = tossWon ? challenger : opponent;
    const tossLoser = tossWon ? opponent : challenger;

    askBatBowl(client, tossWinner, stadium, answer => {
      let batsman, bowler;
      if (answer == 'bat') batsman = tossWinner, bowler = tossLoser;
      else batsman = tossLoser, bowler = tossWinner;

      startInnings(client, stadium, batsman, bowler, score => {
        stadium.send(`First Innings over. Score: \`${score}\``);
        // Display a scoreboard here.

        startInnings(client, stadium, bowler, batsman);
      })
    })
  })
}

module.exports = startMatch;
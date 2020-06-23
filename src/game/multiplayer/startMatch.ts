import toss from '../../util/toss';
import startInnings from './startInnings';
import askBatBowl from '../../util/askBatBowl';
import { Client, TextChannel, User } from 'discord.js';

/**
 * 
 * @param client The main discord.js client object.
 * @param stadium The stadium AKA the channel where the match started.
 * @param challenger The overconfident person who challenged.
 * @param opponent The brave one who (may or may not have) accepted the challenge.
 */
function startMatch(
  client: Client,
  stadium: TextChannel,
  challenger: User,
  opponent: User
) {
  stadium.send('Starting toss, opponent has to choose.');
  toss(opponent, client, stadium, tossWon => {
    // tossWon is true if challenger wins
    const tossWinner = tossWon ? challenger : opponent;
    const tossLoser = tossWon ? opponent : challenger;

    askBatBowl(client, tossWinner, stadium, answer => {
      let batsman, bowler;
      if (answer == 'bat') batsman = tossWinner, bowler = tossLoser;
      else batsman = tossLoser, bowler = tossWinner;

      startInnings(client, stadium, batsman, bowler, false, null,({score}) => {
        stadium.send(`First Innings over. Score: \`${score}\``);
        // Display a scoreboard here.

        startInnings(client, stadium, bowler, batsman, true, score);
      })
    })
  })
}

export default startMatch;
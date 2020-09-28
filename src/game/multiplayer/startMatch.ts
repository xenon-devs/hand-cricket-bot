import toss from '../../util/toss';
import startInnings from './startInnings';
import askBatBowl from '../../util/askBatBowl';
import makeScoreboard from '../../util/scoreboard';
import { TextChannel, User } from 'discord.js';
import DiscordClient from '../../util/DiscordClient';

/**
 * @description Starts a multiplayer match.
 * @param client The main discord.js client object.
 * @param stadium The stadium AKA the channel where the match started.
 * @param challenger The overconfident person who challenged.
 * @param opponent The brave one who (may or may not have) accepted the challenge.
 */
function startMatch(
  client: DiscordClient,
  stadium: TextChannel,
  challenger: User,
  opponent: User
) {
  stadium.send('Starting toss, opponent has to choose.');
  toss(opponent, client, stadium, (tossWon: boolean) => {
    // tossWon is true if challenger wins
    const tossWinner = tossWon ? challenger : opponent;
    const tossLoser = tossWon ? opponent : challenger;

    askBatBowl(client, tossWinner, stadium, (answer: string) => {
      let batsman: User, bowler: User;
      if (answer == 'bat') batsman = tossWinner, bowler = tossLoser;
      else batsman = tossLoser, bowler = tossWinner;

      startInnings(client, stadium, batsman, bowler, false, null,({score, balls}) => {
        stadium.send(makeScoreboard(client, {
          balls,
          player1: batsman,
          player2: bowler,
          hasPlayer2Played: false,
          player1Score: score
        }))

        startInnings(client, stadium, bowler, batsman, true, score, (outputObj) => {
          if (outputObj.chaseWon) {
            stadium.send(`Player <@${bowler.id}> won! :trophy:`);
            bowler.send('You won :trophy:!');
            batsman.send('You lost :(');
          }
          else if (outputObj.chaseDraw) {
            stadium.send(`It's a draw. Pfeh!`);
            bowler.send(`It's a draw.`);
            batsman.send(`It's a draw.`);
          }
          else {
            stadium.send(`Player <@${batsman.id}> won! :trophy:`);
            batsman.send('You won :trophy:!');
            bowler.send('You lost :(');
          }

          stadium.send(makeScoreboard(client, {
            balls: outputObj.balls,
            player1: batsman,
            player2: bowler,
            hasPlayer2Played: true,
            player1Score: score,
            player2Score: outputObj.score
          }))
        })
      })
    })
  })
}

export default startMatch;

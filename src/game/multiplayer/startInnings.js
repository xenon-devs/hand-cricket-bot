const play = require('./play');

function startInnings(client, stadium, batsman, bowler, isChase, chaseScore, cb = () => {}) {
  stadium.send(`Starting innings in 5s, be ready in DM, <@${batsman.id}> is going to bat.`);

  batsman.send('You will be batting in 5s');
  bowler.send('You will be bowling in 5s');

  let score = 0;

  const playCbHandler = out => {
    if (out.bothAnswered) {
      if (out.batsmansAnswer == out.bowlersAnswer) {
        batsman.send(`Opponent showed ${out.bowlersAnswer}. You are out! What are you doing?`);
        bowler.send(`Opponent showed ${out.batsmansAnswer}. Clean bowled! Great!`);

        cb(score);
      }
      else {
        score += out.batsmansAnswer;
        batsman.send(`Opponent showed ${out.bowlersAnswer}. You scored ${out.batsmansAnswer} runs! Keep it up!`);
        bowler.send(`Opponent showed ${out.batsmansAnswer}. Your opponent scored ${out.batsmansAnswer} runs. What are you doing????`);

        play(client, stadium, batsman, bowler, playCbHandler);
      }
    }
  }

  setTimeout(() => {
    stadium.send('Match started.');
    play(client, stadium, batsman, bowler, playCbHandler);
  }, 5000)
}

module.exports = startInnings;
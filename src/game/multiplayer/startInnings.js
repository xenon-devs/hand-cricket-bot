const play = require('./play');

function startInnings(client, stadium, batsman, bowler, cb) {
  stadium.send(`Starting innings in 5s, <@${batsman.id}> is going to bat.`);

  batsman.send('You will be batting in 5s');
  bowler.send('You will be bowling in 5s');

  setTimeout(() => {
    stadium.send('Match started.');
    play(client, stadium, batsman, bowler);
  }, 5000)
}
const ask = require('../util/ask');
const getRandomFingers = require('./getRandomFingers');

const fs = require('fs');
const path = require('path');

const showFingersHandler = (answer, client, player, channel, difficulty, cb) => {
  let fingers = Number(answer.toLowerCase().trim());
  if (isNaN(fingers) || fingers > 6 || fingers < 0) ask(client, player, channel, `Do you have *${answer}* fingers? Really?`, answer => showFingersHandler(answer, client, player, channel, difficulty, cb))
  else {
    if (fingers > 6) fingers = 6;
    if (fingers < 0) fingers = 0;

    cb(fingers);
  }
}

function play(client, player, channel, isBotBatting, difficulty, playerMoveHistory, cb) {
  ask(client, player, channel, `Show your fingers.. *Using keyboard stupid*`, answer => showFingersHandler(answer, client, player, channel, difficulty, playerFingers => {
    const botFingers = getRandomFingers(playerFingers, isBotBatting, difficulty, playerMoveHistory);

    playerMoveHistory.push(playerFingers);


    channel.send(`${botFingers}!`);

    if (isBotBatting) {
      if (botFingers === playerFingers) return cb({
        botLost: true
      })
      else return cb({
        botLost: false,
        addBotScore: botFingers
      })
    }
    else {
      if (botFingers === playerFingers) return cb({
        botLost: false
      })
      else return cb({
        botLost: true,
        addPlayerScore: playerFingers
      })
    }
  }))
}

module.exports = play;
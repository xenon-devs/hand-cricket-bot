const ask = require('../../util/ask');

function startChallenge(client, channel, msg) {
  const challenger = msg.author,
    stadium = channel;

  ask(client, challenger, stadium, 'Who do you want to challenge? (please @mention)', (ans, ansMsg) => {
    const opponentMentions = ansMsg.mentions;

    if (opponentMentions.everyone) return stadium.send('Want to battle everyone at once? Who do you think you are?');
    const opponent = opponentMentions.members.array()[0];

    if (opponent.id == challenger.id) return stadium.send('Challenging yourself? Scared to fight others? Lol.');

    ask(client, opponent, stadium, 'Do you accept the challenge? (yes/no)', ans => {
      if (!(ans.trim().toLowerCase() == 'yes')) return stadium.send(`<@${opponent.id}> got scared :smirk:`);
      else {
        
      }
    })
  })
}

module.exports = startChallenge;
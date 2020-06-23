const askDM = require('../../util/askDM');

function play(client, stadium, batsman, bowler, cb) {
  let playersAnswered = 0;
  let batsmansAnswer, bowlersAnswer;

  const answerHandler = (player, ans, isBatsman) => {
    if (ans > 6 || ans < 0 || Number(ans) == NaN) {
      askDM(client, player, `Do you have *${ans}* fingers? Really?`, ans => answerHandler(player, ans, isBatsman), () => {
        stadium.send(`Coward <@${player.id} didn't respond so the match ended.`);

        if (!isBatsman) batsman.send(`Your coward opponent didn't respond so the match ended.`);
        else  bowler.send(`Your coward opponent didn't respond so the match ended.`);

        cb({
          bothAnswered: false
        })
      })
    }
    else {
      playersAnswered++;
      if (isBatsman) batsmansAnswer = Number(ans);
      else bowlersAnswer = Number(ans);

      if (playersAnswered == 2) cb({
        bothAnswered: true,
        batsmansAnswer,
        bowlersAnswer
      })
    }
  }

  askDM(client, batsman, 'Show me your fingers!... *Using keyboard stupid*', ans => answerHandler(batsman, ans, true), () => {
    stadium.send(`Coward <@${player.id} didn't respond so the match ended.`);
    bowler.send(`Your coward opponent didn't respond so the match ended.`);

    cb({
      bothAnswered: false
    })
  })

  askDM(client, bowler, 'Show me your fingers!... *Using keyboard stupid*', ans => answerHandler(bowler, ans, false), () => {
    stadium.send(`Coward <@${player.id} didn't respond so the match ended.`);
    batsman.send(`Your coward opponent didn't respond so the match ended.`);

    cb({
      bothAnswered: false
    })
  })
}

module.exports = play;
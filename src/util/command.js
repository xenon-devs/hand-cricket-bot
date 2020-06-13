const { prefix } = require('../../config.json');

function onCommand(client, command, output, cb) {
  client.on('message', msg => {
    if (msg.content.toLowerCase() === `${prefix}${command}`) {
      msg.channel.send(output);
      if (cb) cb(msg);
    }
  })
}

module.exports = onCommand;
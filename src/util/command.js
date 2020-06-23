const { prefix } = require('../../config.json');

/**
 * @description Set up a command listener.
 * @param {Client} client The main discord.js client object.
 * @param {String} command Command as a string (without prefix).
 * @param {String} output A direct string output to be sent in the same channel/
 * @param {function} cb A callback that is fired when the command is run.
 */
function onCommand(client, command, output, cb) {
  client.on('message', msg => {
    if (msg.content.toLowerCase() === `${prefix}${command}`) {
      msg.channel.send(output);
      if (cb) cb(msg);
    }
  })
}

module.exports = onCommand;
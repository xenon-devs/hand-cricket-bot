import { prefix } from '../../config.json'
import { MessageEmbed } from 'discord.js';
import { DiscordClient } from './DiscordClient';

/**
 * @description Set up a command listener.
 * @param {DiscordClient} client The main discord.js client object.
 * @param {String} command Command as a string (without prefix).
 * @param {String|MessageEmbed} output A direct string or embed output to be sent in the same channel.
 * @param {function} cb A callback that is fired when the command is run.
 */
function onCommand(client: DiscordClient, command: string, output:  (string | MessageEmbed), cb?: Function) {
  client.onMsg({
    name: command,
    handler: msg => {
      if (msg.content.toLowerCase() === `${prefix}${command}`) {
        if (output !== '') msg.channel.send(output);
        if (cb) cb(msg);
      }
    }
  })
}

export default onCommand;

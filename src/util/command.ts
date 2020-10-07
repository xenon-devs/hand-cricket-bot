import { prefix } from '../../config.json'
import { MessageEmbed, Guild, Message } from 'discord.js';
import { DiscordClient } from './DiscordClient';

export function getPrefix(guild: Guild): string {
  let Prefix = prefix;

  // If nickname is of the form [pre] Name Then pre should be the prefix
  if (guild.me.nickname && guild.me.nickname.includes('[') && guild.me.nickname.includes(']')) {
    Prefix = guild.me.nickname.slice(
      guild.me.nickname.indexOf('[') + 1
    )
    .slice(0, guild.me.nickname.indexOf(']') - 1)
  }

  return Prefix;
}

/**
 * @description Set up a command listener.
 * @param {DiscordClient} client The main discord.js client object.
 * @param {String} command Command as a string (without prefix).
 * @param {String|MessageEmbed} output A direct string or embed output to be sent in the same channel.
 * @param {function} cb A callback that is fired when the command is run.
 */
function onCommand(client: DiscordClient, command: string, output:  (string | MessageEmbed), cb?: (msg: Message, prefix: string) => void) {
  client.onMsg({
    name: command,
    handler: msg => {
      const customPrefix: string = (msg.channel.type === 'dm') ? prefix : getPrefix(msg.guild);
      if (msg.content.toLowerCase() === `${customPrefix}${command}`) {
        if (output !== '') msg.channel.send(output);
        if (cb) cb(msg, customPrefix);
      }
    }
  })
}

export default onCommand;

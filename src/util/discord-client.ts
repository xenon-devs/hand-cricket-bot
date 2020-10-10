import { Client, Message, MessageEmbed } from 'discord.js';
import { prefix } from '../../config.json'
import { getPrefix } from './get-prefix';

export type onMessageHandler = {
  handler: (msg: Message) => void,
  name: string
}

export class DiscordClient extends Client {
  onMessageList: onMessageHandler[];

  constructor(clientOptions?: any) {
    super(clientOptions);
    this.onMessageList = [];

    this.on('message', msg  => {
      return this.onMessageList.forEach(onMsgHandler => {
        onMsgHandler.handler(msg);
      })
    })
  }

  /**
   * @description Optimized on message event listener. Uses a single event listener to check for all events.
   * @param msgHandler An object with an even handler on the message event.
   */
  onMsg(msgHandler: onMessageHandler) {
    this.onMessageList.push(msgHandler);
  }

  offMsg(handlerName: string) {
    this.onMessageList = this.onMessageList.filter(handler => handler.name != handlerName);
  }

  /**
 * @description Set up a command listener.
 * @param client The main discord.js client object.
 * @param command Command as a string (without prefix).
 * @param output A direct string or embed output to be sent in the same channel.
 * @param cb A callback that is fired when the command is run.
 */
onCommand(command: string, output:  (string | MessageEmbed), cb?: (msg: Message, prefix: string) => void) {
  this.onMsg({
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
}

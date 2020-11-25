import { Client, Message, MessageEmbed } from 'discord.js';
import DBL from 'dblapi.js';

import { prefix } from '../../config.json'
import { getPrefix } from './get-prefix';
import { HighScoreDB } from '../db/high-score-db';
import { MatchesDB } from '../db/matches-db';

export type onMessageHandler = {
  handler: (msg: Message) => void,
  name: string,
  onTurnOff?: (handler: onMessageHandler) => void
}

export class DiscordClient extends Client {
  onMessageList: Map<string, onMessageHandler> = new Map();
  dblIntegration: boolean = false;
  dbl: DBL;
  highScoreDB: HighScoreDB;
  matchesDB: MatchesDB;

  constructor(clientOptions?: any) {
    super(clientOptions);

    this.highScoreDB = new HighScoreDB(process.env.dbLoc);
    this.matchesDB = new MatchesDB(process.env.dbLoc);

    if (process.env.DBL_TOKEN) {
      this.dblIntegration = true;
      this.dbl = new DBL(process.env.DBL_TOKEN, this);
      this.dbl.on('error', console.log);
    }
    else this.dblIntegration = false;

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
    if (!this.onMessageList.has(msgHandler.name)) this.onMessageList.set(msgHandler.name, msgHandler);
  }

  offMsg(handlerName: string) {
    if (this.onMessageList.has(handlerName)) {
      const handler = this.onMessageList.get(handlerName);

      if (handler.onTurnOff) handler.onTurnOff(handler);
      this.onMessageList.delete(handlerName);
    }
  }

  /**
 * @description Set up a command listener.
 * @param client The main discord.js client object.
 * @param command Command as a string (without prefix).
 * @param output A direct string or embed output to be sent in the same channel.
 * @param cb A callback that is fired when the command is run.
 */
onCommand(
  command: string,
  output:  (string | MessageEmbed),
  cb?: (msg: Message, prefix: string) => void
) {
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

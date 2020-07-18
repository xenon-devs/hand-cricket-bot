import { Client, Message } from 'discord.js';

export type onMessageHandler = {
  handler: (msg: Message) => void,
  name: string
}

export default class DiscordClient extends Client {
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
}
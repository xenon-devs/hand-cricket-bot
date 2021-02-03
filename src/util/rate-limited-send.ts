import { TextChannel, MessageEmbed, User, Message, DMChannel } from 'discord.js';

export type SendTo = TextChannel | DMChannel | User;
export type Content = string | number | MessageEmbed;
export type SentResolve = (message: Message) => void;
export type ToBeSent = {content: Content, sendTo: SendTo, resolve: SentResolve};
export type MessageQueue =
  Map<
    string,
    {
      toBeSent: ToBeSent[],
      lastSentTimestamp: number
    }
  >

/**
 * key -> server id
 */
const serverMessageQueue: MessageQueue = new Map();
/**
 * key -> channel id
 */
const dmMessageQueue: MessageQueue = new Map();

const minimumDelay = 1000; // Miliseconds

/**
 * Starts the queue clearing process.
 * @param queue
 * @param idInQueue
 */
function queueClearer(
  queue: MessageQueue,
  idInQueue: string
) {
  setTimeout(
    async () => {
      const messageToSend = queue.get(idInQueue).toBeSent.shift();

      queue.set(idInQueue, {
        ...queue.get(idInQueue),
        lastSentTimestamp: new Date().getTime()
      })

      if (queue.get(idInQueue).toBeSent.length > 0) queueClearer(queue, idInQueue);

      messageToSend.resolve(await messageToSend.sendTo.send(messageToSend.content));
    },
    minimumDelay
  )
}

export async function send(
  sendTo: SendTo,
  content: Content
) {
  let queue: MessageQueue; // Selected queue for this message
  let idInQueue: string;

  if ('type' in sendTo) { // It is a channel
    if (sendTo.type === 'dm') {
      queue = dmMessageQueue;
      idInQueue = sendTo.id;
    }
    else if (sendTo.type === 'text') {
      queue = serverMessageQueue;
      idInQueue = sendTo.guild.id;
    }
  }
  else if ('username' in sendTo) { // It is a user
    queue = dmMessageQueue;
    idInQueue = sendTo.id;
  }

  if (!queue.has(idInQueue)) {
    queue.set(idInQueue, {
      lastSentTimestamp: new Date().getTime(),
      toBeSent: []
    }) // Initialize

    return await sendTo.send(content);
  }

  const currentTime = new Date().getTime();

  if (queue.get(idInQueue).toBeSent.length === 0) {
    if (currentTime - queue.get(idInQueue).lastSentTimestamp > minimumDelay) {
      queue.set(idInQueue, {
        ...queue.get(idInQueue),
        lastSentTimestamp: currentTime
      })
      return await sendTo.send(content);
    }
    else {
      return new Promise((resolve: SentResolve) => {
        queue.get(idInQueue).toBeSent.push({
          content,
          sendTo,
          resolve
        })

        queueClearer(queue, idInQueue);
      })
    }
  }
  else {
    return new Promise((resolve: SentResolve) => {
      queue.get(idInQueue).toBeSent.push({
        content,
        sendTo,
        resolve
      })
    })
  }
}

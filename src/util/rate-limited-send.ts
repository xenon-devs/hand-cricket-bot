import { TextChannel, MessageEmbed, User, Message, DMChannel } from 'discord.js';

/**
 * key -> server id
 * value -> timestamp of the last sent message
 */
const lastMessageServerTimeStamps: Map<string, number> = new Map();
/**
 * key -> DM channel id
 * value -> timestamp of the last sent message
 */
const lastMessageDMTimeStamps: Map<string, number> = new Map();
/**
 * Number of miliseconds between between each message
 */
const minimumDelay = 360;

export async function send(
  sendTo: TextChannel | DMChannel | User,
  content: string | number | MessageEmbed
) {
  let lastSentTimestamp: number = 0;

  if ('username' in sendTo) lastSentTimestamp = lastMessageDMTimeStamps.get(sendTo.dmChannel.id) || 0;
  else if ('type' in sendTo && sendTo.type === 'dm') lastSentTimestamp = lastMessageDMTimeStamps.get(sendTo.id) || 0;
  else lastSentTimestamp = lastMessageServerTimeStamps.get(sendTo.guild.id) || 0;

  const currentTime = new Date().getTime();
  const delay = currentTime - lastSentTimestamp;

  return new Promise((resolve: (msg: Message) => void) => {
    if (delay > minimumDelay) {
      sendTo.send(content);

      if ('username' in sendTo) lastMessageDMTimeStamps.set(sendTo.dmChannel.id, currentTime);
      else if ('type' in sendTo && sendTo.type === 'dm') lastMessageDMTimeStamps.set(sendTo.id, currentTime);
      else lastMessageServerTimeStamps.set(sendTo.guild.id, currentTime);
    }
    else setTimeout(
      async () => {
        resolve(await send(sendTo, content));
      }, minimumDelay - delay + 10
    )
  })
}

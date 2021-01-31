import { TextChannel, MessageEmbed } from 'discord.js';

/**
 * key -> server id
 * value -> timestamp of the last sent message
 */
const lastMessageTimeStamps: Map<string, number> = new Map();
/**
 * Number of miliseconds between between each message
 */
const minimumDelay = 1000;

export async function send(
  channel: TextChannel,
  content: string | number | MessageEmbed
) {
  const lastSentTimestamp = lastMessageTimeStamps.has(channel.guild.id) ? lastMessageTimeStamps.get(channel.guild.id) : 0;
  const currentTime = new Date().getTime();
  const delay = currentTime - lastSentTimestamp;

  return new Promise((resolve) => {
    if (delay > minimumDelay) {
      channel.send(content);
      lastMessageTimeStamps.set(channel.guild.id, currentTime);
    }
    else setTimeout(
      () => {
        resolve(send(channel, content));
      }, minimumDelay - delay + 10
    )
  })
}

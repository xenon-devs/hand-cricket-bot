import { Message, MessageEmbed } from 'discord.js';
import { DiscordClient } from '../util/discord-client';

export interface ICommandMeta {
  name: string,
  desc: string
}

export function setCommand(
  client: DiscordClient,
  commandName: string,
  desc: string,
  output: string | MessageEmbed,
  cb?: (msg: Message, prefix: string) => void
): ICommandMeta {
  client.onCommand(commandName, output, cb);

  return {
    name: commandName,
    desc: desc
  }
}

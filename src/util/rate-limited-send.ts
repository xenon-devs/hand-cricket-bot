import { TextChannel, MessageEmbed, User, Message, DMChannel } from 'discord.js';

export type SendTo = TextChannel | DMChannel | User;
export type Content = string | number | MessageEmbed;

export async function send(
  sendTo: SendTo,
  content: Content
) {

}

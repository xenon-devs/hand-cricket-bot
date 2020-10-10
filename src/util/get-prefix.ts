import { prefix } from '../../config.json';
import { Guild } from 'discord.js';

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

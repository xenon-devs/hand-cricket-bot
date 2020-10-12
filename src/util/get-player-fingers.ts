import { ask, ErrorMessages } from './ask';
import { TextChannel, DMChannel, User } from 'discord.js';
import { DiscordClient } from './discord-client';

export async function getPlayerFingers(client: DiscordClient, stadium: TextChannel | DMChannel, player: User, askString: string = `Show your fingers... *Using keyboard stupid*`): Promise<ErrorMessages | number> {
  try {
    const fingers = (await ask(client, player, stadium, askString, 60000)).answer.trim();
    if (parseInt(fingers) <= 6 && parseInt(fingers) >= 0) return parseInt(fingers);
    else return await getPlayerFingers(client, stadium, player, `:clap: :clap:. Answer again now.`);
  }
  catch (e) {
    return e;
  }
}

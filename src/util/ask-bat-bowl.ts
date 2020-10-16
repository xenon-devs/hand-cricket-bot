import { ask, ErrorMessages } from './ask';
import { TextChannel, User, DMChannel } from 'discord.js';
import { DiscordClient } from './discord-client';

export enum BatBowl {
  BAT = 'bat',
  BOWL = 'bowl'
}
export { ErrorMessages } from './ask';

const doAsk = async (player: User, client: DiscordClient, channel: TextChannel | DMChannel, msg: string): Promise<BatBowl> => {
  try {
    const answer = await ask(client, player, channel, msg);
    switch (answer.answer.trim().toLowerCase()) {
      case 'bat':
        return BatBowl.BAT;
      case 'bowl':
        return BatBowl.BOWL;
      default:
        return await doAsk(player, client, channel, 'Is that a joke? Should I laugh? Answer again.');
    }
  }
  catch (e) {
    throw e;
  }
}

/**
 *
 * @param player Discord.js User object of the player who selects the batting/bowling.
 * @param client The main discord.js client object.
 * @param channel The channel in which the coin is flipped.
 */
export const askBatBowl = async (player: User, client: DiscordClient, channel: TextChannel | DMChannel) => {
  try {
    return await doAsk(player, client, channel, 'Do you want to bat or bowl?');
  }
  catch (e) {
    throw <ErrorMessages>e;
  }
}

import { MultiPlayerMatch } from '../multi-player/multi-player';
import { GameMode } from '../match/match';
import { DiscordClient } from '../../util/discord-client';
import { TextChannel, User } from 'discord.js';

export class GlobalMatch extends MultiPlayerMatch {
  gameMode: GameMode.TEST_MATCH;

  constructor(
    client: DiscordClient,
    stadium: TextChannel,
    challenger: User,
    opponent: User,
    matchEndedCb: () => void
  ) {
    super(client, stadium, challenger, matchEndedCb);
  }

  start() {
    console.log('lul');
  }
}

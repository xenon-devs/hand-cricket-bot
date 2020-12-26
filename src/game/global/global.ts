import { MultiPlayerMatch } from '../multi-player/multi-player';
import { GameMode } from '../match/match';
import { startMatch } from './start-match';
import { DiscordClient } from '../../util/discord-client';
import { TextChannel, User } from 'discord.js';

export class GlobalMatch extends MultiPlayerMatch {
  gameMode: GameMode.TEST_MATCH;

  protected startMatch = startMatch;

  constructor(
    client: DiscordClient,
    stadium: TextChannel,
    challenger: User,
    opponent: User,
    matchEndedCb: () => void
  ) {
    super(client, stadium, challenger, matchEndedCb);
    this.opponent = opponent;
    this.startGlobal();
  }

  start() {} // Overridden
  protected startGlobal() {
    this.startMatch();
  }

  protected comment(commentry: string) {
    this.opponent.send(`**Commentator**: ${commentry}`);
    this.challenger.send(`**Commentator**: ${commentry}`);
  }
}

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
    this.opponent.send(`Match found. Your opponent is **${this.challenger.username}**`);
    this.challenger.send(`Match found. Your opponent is **${this.opponent.username}**`);
    this.startMatch();
  }

  protected comment(commentry: string) {
    this.opponent.send(`**Commentator**: ${commentry}`);
    this.challenger.send(`**Commentator**: ${commentry}`);
  }

  protected sendScoreBoard() {
    this.challenger.send(this.generateScoreBoard());
    this.opponent.send(this.generateScoreBoard());
  }

  addMatchToDB() {
    this.client.matchesDB.addMatch('global');
  }

  sendAdvertisement() {} // Current advertisement is about global matches so don't send.
}

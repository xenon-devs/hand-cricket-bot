import DBL from 'dblapi.js';
import { DiscordClient } from '../util/discord-client';
import { SinglePlayerMatch } from '../game/single-player';
import { MultiPlayerMatch } from '../game/multi-player/multi-player';

import { setChallenge } from './commands/challenge';
import { setDM } from './commands/dm';
import { setForfeit } from './commands/forfeit';
import { setPlay } from './commands/play';
import { setRules } from './commands/rules';
import { setStats } from './commands/stats';

import { setHelp } from './help';

export function setAllCommands(
  client: DiscordClient,
  dbl: DBL | null
) {
  const commandList: {
    name: string,
    desc: string
  }[] = []

  const current1PMatches: Map<string, SinglePlayerMatch> = new Map(); // List of ongoing single player matches
  const current2PMatches: Map<string, MultiPlayerMatch> = new Map(); // List of ongoing multiplayer matches

  commandList.push(setChallenge(
    client,
    current1PMatches,
    current2PMatches
  ))
  commandList.push(setDM(
    client
  ))
  commandList.push(setForfeit(
    client,
    current1PMatches,
    current2PMatches
  ))
  commandList.push(setPlay(
    client,
    current1PMatches,
    current2PMatches
  ))
  commandList.push(setRules(
    client,
  ))
  commandList.push(setStats(
    client,
    dbl
  ))

  setHelp(
    client,
    dbl,
    commandList
  )
}

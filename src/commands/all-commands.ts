import { DiscordClient } from '../util/discord-client';
import { SinglePlayerMatch } from '../game/single-player/single-player';
import { MultiPlayerMatch } from '../game/multi-player/multi-player';
import { GlobalMatch } from '../game/global/global';

import { setChallenge } from './commands/challenge';
import { setDM } from './commands/dm';
import { setForfeit } from './commands/forfeit';
import { setPlay } from './commands/play';
import { setRules } from './commands/rules';
import { setStats } from './commands/stats';
import { setOngoing } from './commands/ongoing';
import { setNew } from './commands/new';
import { setLeaderboard } from './commands/leaderboard';
import { setGlobal } from './commands/global-match';

import { setHelp } from './help';
import { ICommandMeta } from './command';
import { User } from 'discord.js';

export function setAllCommands(
  client: DiscordClient
) {
  const commandList: ICommandMeta[] = []

  const current1PMatches: Map<string, SinglePlayerMatch> = new Map(); // List of ongoing single player matches
  const current2PMatches: Map<string, MultiPlayerMatch> = new Map(); // List of ongoing multiplayer matches

  const currentGlobalMatches: Map<string, GlobalMatch> = new Map(); // List of ongoing global multiplayer matches
  const matchmakingQueue: User[] = [];

  commandList.push(setChallenge(
    client,
    current1PMatches,
    current2PMatches,
    currentGlobalMatches
  ))
  commandList.push(setDM(
    client
  ))
  commandList.push(setForfeit(
    client,
    current1PMatches,
    current2PMatches,
    currentGlobalMatches
  ))
  commandList.push(setPlay(
    client,
    current1PMatches,
    current2PMatches,
    currentGlobalMatches
  ))
  commandList.push(setRules(
    client,
  ))
  commandList.push(setStats(
    client
  ))
  commandList.push(setOngoing(
    client,
    current1PMatches,
    current2PMatches,
    currentGlobalMatches,
    matchmakingQueue
  ))
  commandList.push(setNew(
    client
  ))
  commandList.push(setLeaderboard(
    client
  ))
  commandList.push(setGlobal(
    client,
    current1PMatches,
    current2PMatches,
    currentGlobalMatches,
    matchmakingQueue
  ))

  setHelp(
    client,
    commandList
  )
}

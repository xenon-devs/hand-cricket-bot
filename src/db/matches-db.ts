import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface IMatchesDBStructure {
  singlePlayer: number,
  multiPlayer: number,
  global: number
}

export const emptyMatchesDB: IMatchesDBStructure = {
  singlePlayer: 0,
  multiPlayer: 0,
  global: 0
}

export class MatchesDB {
  dbLoc: string;
  MATCHES_JSON: string;
  dbOpsQueue: (() => void)[] = [];

  constructor(dbLoc: string) {
    this.dbLoc = dbLoc;
    this.MATCHES_JSON = join(this.dbLoc, 'matches.json');

    if (!existsSync(this.MATCHES_JSON)) writeFileSync(this.MATCHES_JSON, JSON.stringify(emptyMatchesDB));
    else {
      const currentDb = JSON.parse(readFileSync(this.MATCHES_JSON).toString());

      if (typeof currentDb.singlePlayer === 'undefined') currentDb.singlePlayer = emptyMatchesDB.singlePlayer;
      if (typeof currentDb.multiPlayer === 'undefined') currentDb.multiPlayer = emptyMatchesDB.multiPlayer;
      if (typeof currentDb.global === 'undefined') currentDb.global = emptyMatchesDB.global;

      writeFileSync(this.MATCHES_JSON, JSON.stringify(currentDb));
    }
  }

  private addNewMatch(
    matchType: 'singlePlayer' | 'multiPlayer' | 'global'
  ) {
    const currentDb: IMatchesDBStructure = JSON.parse(readFileSync(this.MATCHES_JSON).toString());
    const currentMatches = currentDb[matchType];

    const newMatches = currentMatches + 1;

    currentDb[matchType] = newMatches;

    writeFileSync(this.MATCHES_JSON, JSON.stringify(currentDb));
  }

  addMatch(
    matchType: 'singlePlayer' | 'multiPlayer' | 'global'
  ) {
    this.dbOpsQueue.push(() => this.addNewMatch(matchType));
    this.clearQueue();
  }

  getMatches(): IMatchesDBStructure {
    return JSON.parse(readFileSync(this.MATCHES_JSON).toString());
  }

  private clearQueue() {
    for (let i = 0; i < this.dbOpsQueue.length; i++) {
      (this.dbOpsQueue.shift())();
    }
  }
}

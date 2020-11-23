import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface IMatchesDBStructure {
  singlePlayer: number,
  multiPlayer: number
}

export const emptyMatchesDB: IMatchesDBStructure = {
  singlePlayer: 0,
  multiPlayer: 0
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

      writeFileSync(this.MATCHES_JSON, JSON.stringify(currentDb));
    }
  }

  private addNewMatch(
    multiplayer: boolean
  ) {
    const currentDb: IMatchesDBStructure = JSON.parse(readFileSync(this.MATCHES_JSON).toString());
    const currentMatches = currentDb[multiplayer ? 'multiPlayer' : 'singlePlayer'];

    const newMatches = currentMatches + 1;

    currentDb[multiplayer ? 'multiPlayer' : 'singlePlayer'] = newMatches;

    writeFileSync(this.MATCHES_JSON, JSON.stringify(currentDb));
  }

  addMatch(
    multiplayer: boolean
  ) {
    this.dbOpsQueue.push(() => this.addNewMatch(multiplayer));
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

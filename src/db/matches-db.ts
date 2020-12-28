import { BaseDB } from './base-db';

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

export class MatchesDB extends BaseDB<IMatchesDBStructure> {
  dbDefaults = emptyMatchesDB;
  dbFileName = 'matches';

  private addNewMatch(
    currentDb: IMatchesDBStructure,
    matchType: 'singlePlayer' | 'multiPlayer' | 'global'
  ) {
    const currentMatches = currentDb[matchType];
    const newMatches = currentMatches + 1;
    currentDb[matchType] = newMatches;

    return currentDb;
  }

  addMatch(
    matchType: 'singlePlayer' | 'multiPlayer' | 'global'
  ) {
    this.dbOpsQueue.push((currentDb: IMatchesDBStructure) => this.addNewMatch(currentDb, matchType));
    this.clearOPQueue();
  }

  getMatches(): IMatchesDBStructure {
    return this.readDB();
  }
}

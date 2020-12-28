import { BaseDB } from './base-db';

export interface IHighScore {
  score: number,
  tag: string
}

export interface IHighScoreDB {
  singlePlayer: IHighScore[],
  multiPlayer: IHighScore[]
}

export const emptyHighScoreDB: IHighScoreDB = {
  singlePlayer: [],
  multiPlayer: []
}

export const MAX_SCORES_STORED = 10;

export class HighScoreDB extends BaseDB<IHighScoreDB> {
  getDBFileName() {return 'high-scores'}
  getDBDefaults() {return emptyHighScoreDB}

  private addNewHighScore(
    currentDb: IHighScoreDB,
    newHigh: IHighScore,
    multiplayer: boolean
  ) {
    const currentList = currentDb[multiplayer ? 'multiPlayer' : 'singlePlayer'];

    currentList.push(newHigh);
    const newList = currentList.sort((high1, high2) => high2.score - high1.score);

    if (newList.length > MAX_SCORES_STORED) newList.pop();

    currentDb[multiplayer ? 'multiPlayer' : 'singlePlayer'] = newList;

    return currentDb;
  }

  addHighScore(
    newHigh: IHighScore,
    multiplayer: boolean
  ) {
    this.dbOpsQueue.push((currentDb: IHighScoreDB) => this.addNewHighScore(currentDb, newHigh, multiplayer));
    this.clearOPQueue();
  }

  getScores(): IHighScoreDB {
    return this.readDB();
  }
}

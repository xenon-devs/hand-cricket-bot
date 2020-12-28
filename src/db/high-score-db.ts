import { BaseDB } from './base-db';

export interface IHighScore {
  score: number,
  tag: string
}

export interface IHighScoreDB {
  singlePlayer: IHighScore[], // Test Match
  singleSuperOver: IHighScore[],
  singleT5: IHighScore[],
  multiPlayer: IHighScore[], // Test Match
  multiSuperOver: IHighScore[],
  multiT5: IHighScore[]
}

export const emptyHighScoreDB: IHighScoreDB = {
  singlePlayer: [],
  singleSuperOver: [],
  singleT5: [],
  multiPlayer: [],
  multiSuperOver: [],
  multiT5: []
}

export enum HighScoreType {
  SINGLE_TEST = 'singlePlayer',
  SINGLE_SUPER_OVER = 'singleSuperOver',
  SINGLE_T5 = 'singleT5',
  MULTI_TEST = 'multiPlayer',
  MULTI_SUPER_OVER = 'multiSuperOver',
  MULTI_T5 = 'multiT5'
}
export const MAX_SCORES_STORED = 10;

export class HighScoreDB extends BaseDB<IHighScoreDB> {
  getDBFileName() {return 'high-scores'}
  getDBDefaults() {return emptyHighScoreDB}

  private addNewHighScore(
    currentDb: IHighScoreDB,
    newHigh: IHighScore,
    highScoreType: HighScoreType
  ) {
    const currentList = currentDb[highScoreType];

    currentList.push(newHigh);
    const newList = currentList.sort((high1, high2) => high2.score - high1.score);

    if (newList.length > MAX_SCORES_STORED) newList.pop();

    currentDb[highScoreType] = newList;

    return currentDb;
  }

  addHighScore(
    newHigh: IHighScore,
    highScoreType: HighScoreType
  ) {
    this.dbOpsQueue.push((currentDb: IHighScoreDB) => this.addNewHighScore(currentDb, newHigh, highScoreType));
    this.clearOPQueue();
  }

  getScores(): IHighScoreDB {
    return this.readDB();
  }
}

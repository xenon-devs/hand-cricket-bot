import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface IHighScore {
  score: number,
  tag: string
}

export interface IHighScoreDB {
  singlePlayer: IHighScore[],
  multiPlayer: IHighScore[]
}

export const MAX_SCORES_STORED = 10;

export class HighScoreDB {
  dbLoc: string;
  HIGH_SCORE_JSON: string;
  dbOpsQueue: (() => void)[] = [];

  constructor(dbLoc: string) {
    this.dbLoc = dbLoc;
    this.HIGH_SCORE_JSON = join(this.dbLoc, 'high-scores.json');
  }

  private addNewHighScore(
    newHigh: IHighScore,
    multiplayer: boolean
  ) {
    const currentDb: IHighScoreDB = JSON.parse(readFileSync(this.HIGH_SCORE_JSON).toString());

    const currentList = currentDb[multiplayer ? 'multiPlayer' : 'singlePlayer'];

    currentList.push(newHigh);
    const newList = currentList.sort((high1, high2) => high1.score - high2.score);

    if (newList.length > MAX_SCORES_STORED) newList.pop();

    currentDb[multiplayer ? 'multiPlayer' : 'singlePlayer'] = newList;

    writeFileSync(this.HIGH_SCORE_JSON, JSON.stringify(currentDb));
  }

  addHighScore(
    newHigh: IHighScore,
    multiplayer: boolean
  ) {
    this.dbOpsQueue.push(() => this.addNewHighScore(newHigh, multiplayer));
    this.clearQueue();
  }

  clearQueue() {
    for (let i = 0; i < this.dbOpsQueue.length; i++) {
      (this.dbOpsQueue.shift())();
    }
  }
}

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export class MatchesDB<IDBStructure> {
  dbLoc: string;
  dbFileName: string; // Override
  DB_JSON: string;

  dbDefaults: IDBStructure;
  dbOpsQueue: (() => void)[] = [];

  constructor(dbLoc: string) {
    this.dbLoc = dbLoc;
    this.DB_JSON = join(this.dbLoc, `${this.dbFileName}.json`);

    if (!existsSync(this.DB_JSON)) writeFileSync(this.DB_JSON, JSON.stringify(this.dbDefaults));
    else {
      const currentDb = JSON.parse(readFileSync(this.DB_JSON).toString());

      for (let property in this.dbDefaults) {
        if (typeof currentDb[property] === 'undefined') currentDb[property] = this.dbDefaults[property];
      }

      writeFileSync(this.DB_JSON, JSON.stringify(currentDb));
    }
  }

  protected queueOperation(operation: () => void) {
    this.dbOpsQueue.push(operation);
  }

  protected writeDB(newDB: IDBStructure) {
    writeFileSync(this.DB_JSON, JSON.stringify(newDB));
  }

  protected readDB(): IDBStructure {
    return JSON.parse(readFileSync(this.DB_JSON).toString());
  }

  protected clearQueue() {
    for (let i = 0; i < this.dbOpsQueue.length; i++) {
      (this.dbOpsQueue.shift())();
    }
  }
}


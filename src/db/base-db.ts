import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export class BaseDB<IDBStructure> {
  dbLoc: string;
  dbFileName: string; // Override
  DB_JSON: string;

  dbDefaults: IDBStructure;
  dbOpsQueue: ((currentDB: IDBStructure) => IDBStructure)[] = [];

  constructor(dbLoc: string) {
    this.dbLoc = dbLoc;
    this.DB_JSON = join(this.dbLoc, `${this.dbFileName}.json`);

    if (!existsSync(this.DB_JSON)) this.writeDB(this.dbDefaults);
    else {
      const currentDb = this.readDB();

      for (let property in this.dbDefaults) {
        if (typeof currentDb[property] === 'undefined') currentDb[property] = this.dbDefaults[property];
      }

      this.writeDB(currentDb);
    }
  }

  protected queueOperation(operation: (currentDB: IDBStructure) => IDBStructure) {
    this.dbOpsQueue.push(operation);
  }

  private writeDB(newDB: IDBStructure) {
    writeFileSync(this.DB_JSON, JSON.stringify(newDB));
  }

  protected readDB(): IDBStructure {
    return JSON.parse(readFileSync(this.DB_JSON).toString());
  }

  protected clearOPQueue() {
    for (let i = 0; i < this.dbOpsQueue.length; i++) {
      this.writeDB(
        this.dbOpsQueue.shift()(this.readDB())
      )
    }
  }
}


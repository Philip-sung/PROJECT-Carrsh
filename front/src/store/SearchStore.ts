import { makeObservable, observable, action } from "mobx";

class SearchStore {
  DEFAULT_OFFSET: number = 0;
  DEFAULT_LIMIT: number = 10;
  DEFAULT_LIMIT_EXTEND: number = 5;

  curKeyword: string = "";
  offset: number = 0;
  limit: number = 10;

  constructor() {
    makeObservable(this, {
      curKeyword: observable,
      offset: observable,
      limit: observable,
      SetKeyword: action,
      InitializeOffsetLimit: action,
      ExtendLimit: action,
    });
  }

  SetKeyword(key: string): void {
    this.curKeyword = key;
  }

  InitializeOffsetLimit(): void {
    this.offset = this.DEFAULT_OFFSET;
    this.limit = this.DEFAULT_LIMIT;
  }

  ExtendLimit(): void {
    this.limit = this.limit + this.DEFAULT_LIMIT_EXTEND;
  }
}

const searchStoreObj = new SearchStore();

export { searchStoreObj };

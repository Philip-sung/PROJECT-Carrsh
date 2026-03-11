import { makeObservable, observable, action } from "mobx";
import type { IPost } from "../types";

class PostStore {
  loadedPosts: IPost[] = [];

  constructor() {
    makeObservable(this, {
      loadedPosts: observable,
      PushPostStack: action,
      ClearPostStack: action,
    });
  }

  PushPostStack(arr?: IPost[]): void {
    if (arr !== undefined) {
      for (let i = 0; i < arr.length; i++) {
        this.loadedPosts.push(arr[i]);
      }
    }
  }

  ClearPostStack(): void {
    this.loadedPosts = [];
  }
}

const postStoreObj = new PostStore();

export { postStoreObj };

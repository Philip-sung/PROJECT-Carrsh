import { makeObservable, observable, action } from "mobx";
import type { Screen } from "../types";

export class ScreenStore {
  currentScreen: Screen = {
    screenName: "",
    screenID: "",
  };
  prevScreens: Screen[] = [];

  constructor() {
    makeObservable(this, {
      currentScreen: observable,
      prevScreens: observable,
      GetNewScreen: action,
      GetCurrentScreen: action,
      GetPrevScreen: action,
    });
  }

  PushScreenStack(): void {
    this.prevScreens.push(this.CurrentScreen as unknown as Screen);
  }

  GetNewScreen(screenName: string, screenID: string = ""): Screen {
    this.prevScreens.push({ ...this.currentScreen });
    this.currentScreen.screenName = screenName;
    this.currentScreen.screenID = screenID;

    return this.currentScreen;
  }

  GetCurrentScreen(): Screen {
    return this.currentScreen;
  }

  GetPrevScreen(): Screen {
    if (this.prevScreens.length === 0) {
      alert("Initial Page");
      console.log("[USER]WELCOME : INITIAL PAGE");
    } else if (this.prevScreens.length > 0) {
      this.currentScreen = this.prevScreens.pop()!;
    }

    return this.currentScreen;
  }

  Report(): void {
    console.log(
      `[DEV]{Current Screen : ${this.currentScreen.screenName}:${this.currentScreen.screenID}}`
    );
    console.log(`[DEV]{Previous Screens`, this.prevScreens);
  }

  get CurrentScreen(): string {
    return `${this.currentScreen}`;
  }
}

const screenStoreObj = new ScreenStore();

export { screenStoreObj };

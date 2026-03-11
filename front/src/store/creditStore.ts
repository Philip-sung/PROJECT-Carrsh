import { makeObservable, action, observable } from "mobx";

class CreditStore {
  credits: number = 0;

  constructor() {
    makeObservable(this, {
      credits: observable,
      increaseCredit: action,
      decreaseCredit: action,
    });
  }

  increaseCredit(): void {
    this.credits++;
  }

  decreaseCredit(): void {
    this.credits--;
  }

  get reportCredit(): string {
    return `${this.credits} Credits`;
  }
}

const creditStoreObj = new CreditStore();

export { creditStoreObj };

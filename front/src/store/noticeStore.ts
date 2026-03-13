import { makeObservable, observable, action } from "mobx";

class NoticeStore {
  noticeNumber: number = 0;

  constructor() {
    makeObservable(this, {
      noticeNumber: observable,
      getNoticeNumber: action,
      setNoticeNumber: action,
    });
  }

  getNoticeNumber(): number {
    return this.noticeNumber;
  }

  setNoticeNumber(num: number): void {
    this.noticeNumber = num;
  }
}

const noticeStoreObj = new NoticeStore();

export { noticeStoreObj };

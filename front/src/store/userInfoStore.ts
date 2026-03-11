import { makeObservable, action, observable } from "mobx";
import type { CurUser } from "../types";

export class UserInfoStore {
  loginState: boolean = false;
  curUser: CurUser = {
    id: "GUEST",
    name: "NONAME",
    privilege: "GUEST",
  };

  constructor() {
    makeObservable(this, {
      loginState: observable,
      curUser: observable,
      setStateLogin: action,
      setStateLogout: action,
      getLoginState: action,
      setUserID: action,
      getUserID: action,
      setUserName: action,
      getUserName: action,
      getPrivilege: action,
      setPrivilege: action,
    });
  }

  GetUser(): CurUser {
    return this.curUser;
  }

  setStateLogin(): void {
    this.loginState = true;
  }

  setStateLogout(): void {
    this.loginState = false;
  }

  getLoginState(): boolean {
    return this.loginState;
  }

  getUserID(): string {
    return this.curUser.id;
  }

  setUserID(id: string): void {
    this.curUser.id = id;
  }

  getUserName(): string {
    return this.curUser.name;
  }

  setUserName(name: string): void {
    this.curUser.name = name;
  }

  setPrivilege(privilege: string): void {
    this.curUser.privilege = privilege;
  }

  getPrivilege(): string {
    return this.curUser.privilege;
  }
}

const userInfoStoreObj = new UserInfoStore();

export { userInfoStoreObj };

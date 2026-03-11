import { screenStoreObj } from "../store/screenStore";

function DevReport(): void {
  console.log("[DEV]Developer Report");
  screenStoreObj.Report();
}

export { DevReport };

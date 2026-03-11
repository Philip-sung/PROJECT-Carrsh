import mongoose from "mongoose";
// @ts-ignore - ServiceInformation.js is git-ignored, typed via .d.ts
import Info from "../ServiceInformation.js";

const DB_URI: string = Info.databaseURI;

mongoose.connect(DB_URI);
mongoose.connection.once("open", () => {
  console.log("[INIT]Connected to a MongoDB instance successfully.");
  console.log("********** Server State : Activated **********");
});
mongoose.connection.on("error", (error: Error) => console.error(error));

export default mongoose;

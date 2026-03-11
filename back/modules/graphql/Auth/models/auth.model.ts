import { Schema, model } from "mongoose";
import type { IAuthDocument } from "../../../../types/index.js";

const authSchema = new Schema<IAuthDocument>({
  userID: String,
  userPW: String,
  userName: String,
  credit: Number,
  privilege: String,
  project: [String],
});

const Auth = model<IAuthDocument>("authentication", authSchema);

export default Auth;

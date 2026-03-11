import { Schema, model } from "mongoose";
import type { ILogDocument } from "../../../../types/index.js";

const logSchema = new Schema<ILogDocument>({
  logTime: String,
  log: String,
});

const Log = model<ILogDocument>("log", logSchema);

export default Log;

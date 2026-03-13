import { Schema, model } from "mongoose";
import type { INoticeDocument } from "../../../../types/index.js";

const noticeSchema = new Schema<INoticeDocument>({
  project: String,
  title: String,
  from: String,
  to: String,
  content: String,
  time: String,
});

const Notice = model<INoticeDocument>("notice", noticeSchema);

export default Notice;

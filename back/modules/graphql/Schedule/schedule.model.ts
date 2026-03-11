import { Schema, model } from "mongoose";
import type { IScheduleDocument } from "../../../types/index.js";

const scheduleSchema = new Schema<IScheduleDocument>({
  project: String,
  createdTime: String,
  startTime: String,
  endTime: String,
  proposer: String,
  content: String,
  member: [String],
});

const Schedule = model<IScheduleDocument>("schedule", scheduleSchema);

export default Schedule;

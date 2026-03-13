import { Schema, model } from "mongoose";
import type { IProjectDocument } from "../../../../types/index.js";

const projectSchema = new Schema<IProjectDocument>({
  title: String,
  designer: String,
  status: String,
  funding: Number,
  started: String,
  completed: String,
  progress: Number,
  privilege: String,
  link: String,
  member: [String],
  tech: [String],
  thumbnail: String,
  description: String,
  reference: String,
  location: String,
});

const Project = model<IProjectDocument>("project", projectSchema);

export default Project;

import { Schema, model } from "mongoose";
import type { IPostDocument } from "../../../../types/index.js";

const postSchema = new Schema<IPostDocument>({
  postTitle: String,
  postContent: String,
  postDate: String,
  postWriter: String,
  project: String,
  category: String,
  tag: String,
});

const Post = model<IPostDocument>("post", postSchema);

export default Post;

import { Document } from "mongoose";

// Mongoose Document Interfaces
export interface IAuth {
  userID: string;
  userPW: string;
  userName: string;
  credit: number;
  privilege: string;
  project: string[];
}

export interface IAuthDocument extends IAuth, Document {}

export interface IPost {
  postTitle: string;
  postContent: string;
  postDate: string;
  postWriter: string;
  project?: string;
  category?: string;
  tag?: string;
}

export interface IPostDocument extends IPost, Document {}

export interface IProject {
  title?: string;
  designer?: string;
  status?: string;
  funding?: number;
  started?: string;
  completed?: string;
  progress?: number;
  privilege?: string;
  link?: string;
  member?: string[];
  tech?: string[];
  thumbnail?: string;
  description?: string;
  reference?: string;
  location?: string;
}

export interface IProjectDocument extends IProject, Document {}

export interface INotice {
  project?: string;
  title?: string;
  from?: string;
  to?: string;
  content?: string;
  time?: string;
}

export interface INoticeDocument extends INotice, Document {}

export interface ISchedule {
  project?: string;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  proposer?: string;
  content?: string;
  member?: string[];
}

export interface IScheduleDocument extends ISchedule, Document {}

export interface ILog {
  logTime: string;
  log: string;
}

export interface ILogDocument extends ILog, Document {}

// GraphQL Resolver Argument Types
export interface GetUserArgs {
  userID: string;
}

export interface GetUsersArgs {
  userID: string[];
}

export interface GetUserInfoArgs {
  userID: string;
  userPW: string;
}

export interface GetPostsByTitlePaginatedArgs {
  postTitle: string;
  offset: number;
  limit: number;
}

export interface GetPostsByTitleArgs {
  postTitle: string;
}

export interface GetPostByIDArgs {
  postID: string;
}

export interface ModifyPostByIDArgs {
  postID: string;
  postTitle: string;
  postContent: string;
  project: string;
}

export interface GetProjectsByStatusArgs {
  status: string;
}

export interface GetProjectByTitleArgs {
  title: string;
}

export interface GetProjectByIDArgs {
  projectID: string;
}

export interface GetUserNoticeArgs {
  userID: string;
}

export interface GetScheduleArgs {
  project: string;
  member: string;
}

export interface CreateUserArgs {
  userID: string;
  userPW: string;
  userName: string;
  credit?: number;
  privilege?: string;
}

export interface CreatePostArgs {
  postTitle: string;
  postContent: string;
  postDate: string;
  postWriter: string;
  project?: string;
  category?: string;
  tag?: string;
}

export interface CreateProjectArgs {
  title?: string;
  designer?: string;
  status?: string;
  funding?: number;
  started?: string;
  completed?: string;
  progress?: number;
  privilege?: string;
  link?: string;
  member?: string[];
  tech?: string[];
  thumbnail?: string;
  description?: string;
  reference?: string;
  location?: string;
}

export interface CreateNoticeArgs {
  project?: string;
  title?: string;
  from?: string;
  to?: string;
  content?: string;
  time?: string;
}

export interface DeleteNoticeArgs {
  _id: string;
}

export interface CreateScheduleArgs {
  project?: string;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  proposer?: string;
  content?: string;
  member?: string[];
}

// Session User Type
export interface SessionUser {
  id: string;
  name: string;
  privilege: string;
}

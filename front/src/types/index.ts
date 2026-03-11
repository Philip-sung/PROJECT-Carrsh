// Data Model Interfaces (matching GraphQL schema)
export interface IAuth {
  _id: string;
  userID: string;
  userPW: string;
  userName: string;
  credit: number;
  privilege: string;
  project: string[];
}

export interface IPost {
  _id: string;
  postTitle: string;
  postContent: string;
  postDate: string;
  postWriter: string;
  project?: string;
  category?: string;
  tag?: string;
}

export interface IProject {
  _id: string;
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

export interface INotice {
  _id: string;
  project?: string;
  title?: string;
  from?: string;
  to?: string;
  content?: string;
  time?: string;
}

export interface ISchedule {
  _id: string;
  project?: string;
  createdTime?: string;
  startTime?: string;
  endTime?: string;
  proposer?: string;
  content?: string;
  member?: string[];
}

// User session type
export interface CurUser {
  id: string;
  name: string;
  privilege: string;
}

// Screen type
export interface Screen {
  screenName: string;
  screenID: string;
}

// GraphQL Query Response Types
export interface GetAllUsersData {
  getAllUsers: IAuth[];
}

export interface GetUserData {
  getUser: IAuth;
}

export interface GetUsersData {
  getUsers: IAuth[];
}

export interface GetUserInfoData {
  getUserInfo: IAuth | null;
}

export interface GetAllPostsData {
  getAllPosts: IPost[];
}

export interface GetPostsByTitlePaginatedData {
  getPostsbyTitlePaginated: IPost[];
}

export interface GetPostsByTitleData {
  getPostsbyTitle: IPost[];
}

export interface GetPostByIDData {
  getPostbyID: IPost;
}

export interface GetAllProjectsData {
  getAllProjects: IProject[];
}

export interface GetProjectsByStatusData {
  getProjectsbyStatus: IProject[];
}

export interface GetProjectByTitleData {
  getProjectbyTitle: IProject;
}

export interface GetProjectByIDData {
  getProjectbyID: IProject;
}

export interface GetUserNoticeData {
  getUserNotice: INotice[];
}

export interface GetScheduleData {
  getSchedulebyProjectAndMember: ISchedule[];
}

// Mutation Response Types
export interface CreateUserData {
  createUser: IAuth;
}

export interface CreatePostData {
  createPost: IPost;
}

export interface CreateProjectData {
  createProject: IProject;
}

export interface CreateNoticeData {
  createNotice: INotice;
}

export interface DeleteNoticeData {
  deleteNotice: INotice;
}

export interface CreateScheduleData {
  createSchedule: ISchedule;
}

export interface ModifyPostData {
  modifyPostbyID: IPost;
}

// Component Prop Types
export interface DisplayerProps {
  title?: string;
  img?: string;
  action?: string;
  link?: string;
  func?: () => void;
  projectName?: string;
}

export interface DisplayerContainerProps {
  children?: React.ReactNode;
}

export interface NavigationBarProps {
  store: import("../store/userInfoStore").UserInfoStore;
}

export interface ViewAreaScreenManagerProps {
  store: import("../store/screenStore").ScreenStore;
}

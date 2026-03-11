import Auth from "./Auth/models/auth.model.js";
import Post from "./Post/models/post.model.js";
import Log from "./Log/models/log.model.js";
import Project from "./Project/models/project.model.js";
import Notice from "./Notice/models/notice.model.js";
import Schedule from "./Schedule/schedule.model.js";

import type {
  GetUserArgs,
  GetUsersArgs,
  GetUserInfoArgs,
  GetPostsByTitlePaginatedArgs,
  GetPostsByTitleArgs,
  GetPostByIDArgs,
  ModifyPostByIDArgs,
  GetProjectsByStatusArgs,
  GetProjectByTitleArgs,
  GetProjectByIDArgs,
  GetUserNoticeArgs,
  GetScheduleArgs,
  CreateUserArgs,
  CreatePostArgs,
  CreateProjectArgs,
  CreateNoticeArgs,
  DeleteNoticeArgs,
  CreateScheduleArgs,
} from "../../types/index.js";

const resolvers = {
  Query: {
    // Auth
    getAllUsers: async () => {
      const users = await Auth.find({});
      return users;
    },
    getUser: async (_parent: unknown, args: GetUserArgs) => {
      const user = await Auth.findOne({ userID: args.userID });
      return user;
    },
    getUsers: async (_parent: unknown, args: GetUsersArgs) => {
      const users = await Auth.find({ userID: { $in: args.userID } });
      return users;
    },
    getUserInfo: async (_parent: unknown, args: GetUserInfoArgs) => {
      const curTime = new Date();
      const user = await Auth.findOne({
        userID: args.userID,
        userPW: args.userPW,
      });
      console.log(
        `[USER]Login Attempt on [ID:${args.userID}] at [${curTime.getFullYear()}.${curTime.getMonth() + 1}.${curTime.getDate()} ${curTime.getHours()}:${curTime.getMinutes()}:${curTime.getSeconds()}]`
      );
      await Log.create({
        logTime: Date(),
        log: `Login Attempt on [ID:${args.userID}] at [${curTime.getFullYear()}.${curTime.getMonth() + 1}.${curTime.getDate()} ${curTime.getHours()}:${curTime.getMinutes()}:${curTime.getSeconds()}]`,
      });
      if (args.userPW === user?.userPW) {
        console.log(
          `[USER]Successful Login Attempt on [ID:${args.userID}]`
        );
        await Log.create({
          logTime: Date(),
          log: `[USER]Successful Login Attempt on [ID:${args.userID}]`,
        });
      }
      return user;
    },

    // Post
    getAllPosts: async () => {
      const posts = await Post.find({}).sort({ postDate: -1 });
      return posts;
    },
    getPostsbyTitlePaginated: async (
      _parent: unknown,
      args: GetPostsByTitlePaginatedArgs
    ) => {
      const query = new RegExp(args.postTitle, "i");
      const posts = await Post.find({ postTitle: query })
        .sort({ postDate: -1 })
        .skip(args.offset)
        .limit(args.limit);
      return posts;
    },
    getPostsbyTitle: async (_parent: unknown, args: GetPostsByTitleArgs) => {
      const query = new RegExp(args.postTitle);
      const posts = await Post.find({ postTitle: query }).sort({
        postDate: -1,
      });
      return posts;
    },
    getPostbyID: async (_parent: unknown, args: GetPostByIDArgs) => {
      const posts = await Post.findById(args.postID);
      return posts;
    },
    modifyPostbyID: async (_parent: unknown, args: ModifyPostByIDArgs) => {
      const query = {
        $set: {
          postTitle: args.postTitle,
          postContent: args.postContent,
          project: args.project,
        },
      };
      const post = await Post.findByIdAndUpdate(args.postID, query);
      return post;
    },

    // Project
    getAllProjects: async () => {
      const projects = await Project.find({}).sort({ started: -1 });
      return projects;
    },
    getProjectsbyStatus: async (
      _parent: unknown,
      args: GetProjectsByStatusArgs
    ) => {
      const projects = await Project.find({ status: args.status }).sort({
        started: -1,
      });
      return projects;
    },
    getProjectbyTitle: async (
      _parent: unknown,
      args: GetProjectByTitleArgs
    ) => {
      const project = await Project.findOne({ title: args.title }).sort({
        started: -1,
      });
      return project;
    },
    getProjectbyID: async (_parent: unknown, args: GetProjectByIDArgs) => {
      const project = await Project.findById(args.projectID);
      return project;
    },

    // Notice
    getUserNotice: async (_parent: unknown, args: GetUserNoticeArgs) => {
      const notices = await Notice.find({ to: args.userID }).sort({
        time: -1,
      });
      return notices;
    },

    // Schedule
    getSchedulebyProjectAndMember: async (
      _parent: unknown,
      args: GetScheduleArgs
    ) => {
      const schedule = await Schedule.find({
        project: args.project,
        member: args.member,
      }).sort({ startTime: -1, createdTime: -1 });
      return schedule;
    },
  },
  Mutation: {
    createUser: (_parent: unknown, args: CreateUserArgs) => {
      const newAuth = new Auth({
        userID: args.userID,
        userPW: args.userPW,
        userName: args.userName,
        credit: args.credit,
        privilege: args.privilege,
      });
      return newAuth.save();
    },
    createPost: async (_parent: unknown, args: CreatePostArgs) => {
      const newPost = new Post({
        postTitle: args.postTitle,
        postContent: args.postContent,
        postDate: args.postDate,
        postWriter: args.postWriter,
        project: args.project,
        category: args.category,
        tag: args.tag,
      });

      const relatedProject = await Project.findOne({ title: args.project });
      if (relatedProject !== undefined && relatedProject !== null) {
        for (let i = 0; i < relatedProject.member!.length; i++) {
          const notice = new Notice({
            project: args.project,
            title: args.project,
            from: args.postWriter,
            to: relatedProject.member![i],
            content: `${args.postWriter} posted new post "${args.postTitle}" on project "${args.project}"`,
            time: args.postDate,
          });
          await notice.save();
        }
      }

      return newPost.save();
    },
    createProject: async (_parent: unknown, args: CreateProjectArgs) => {
      const newProject = new Project({
        title: args.title,
        designer: args.designer,
        status: args.status,
        funding: args.funding,
        started: args.started,
        completed: args.completed,
        progress: args.progress,
        privilege: args.privilege,
        link: args.link,
        member: args.member,
        tech: args.tech,
        thumbnail: args.thumbnail,
        description: args.description,
        reference: args.reference,
        location: args.location,
      });

      if (args.member) {
        for (let i = 0; i < args.member.length; i++) {
          const query = { userID: args.member[i] };
          const addProjectToUser = await Auth.findOneAndUpdate(query, {
            $push: { project: args.title },
          });
          if (addProjectToUser) {
            await addProjectToUser.save();
          }

          const notice = new Notice({
            project: args.title,
            title: args.title,
            from: args.designer,
            to: args.member[i],
            content: `${args.designer} invited you to new project "${args.title}"`,
            time: args.started,
          });
          await notice.save();
        }
      }

      return newProject.save();
    },
    createNotice: async (_parent: unknown, args: CreateNoticeArgs) => {
      const notice = new Notice({
        project: args.project,
        title: args.title,
        from: args.from,
        to: args.to,
        content: args.content,
        time: args.time,
      });
      return notice.save();
    },
    deleteNotice: async (_parent: unknown, args: DeleteNoticeArgs) => {
      await Notice.deleteOne({ _id: args._id });
    },
    createSchedule: async (_parent: unknown, args: CreateScheduleArgs) => {
      const newSchedule = new Schedule({
        project: args.project,
        createdTime: args.createdTime,
        startTime: args.startTime,
        endTime: args.endTime,
        proposer: args.proposer,
        content: args.content,
        member: args.member,
      });

      if (args.member) {
        for (let i = 0; i < args.member.length; i++) {
          const notice = new Notice({
            project: args.project,
            title: args.project,
            from: args.proposer,
            to: args.member[i],
            content: `${args.proposer} make new schedule "${args.content}" on ${args.startTime?.substr(6, 10)} - ${args.endTime?.substr(6, 10)}`,
            time: args.createdTime,
          });
          await notice.save();
        }
      }

      return newSchedule.save();
    },
  },
};

export default resolvers;

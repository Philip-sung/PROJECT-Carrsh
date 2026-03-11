import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Auth {
    _id: ID
    userID: String!
    userPW: String!
    userName: String!
    credit: Int!
    privilege: String!
    project: [String]
  }
  type Post {
    _id: ID!
    postTitle: String!
    postContent: String!
    postDate: String!
    postWriter: String!
    project: String
    category: String
    tag: String
  }
  type Log {
    _id: ID
    logTime: String!
    log: String!
  }
  type Project {
    _id: ID
    title: String
    designer: String
    status: String
    funding: Int
    started: String
    completed: String
    progress: Int
    privilege: String
    link: String
    member: [String]
    tech: [String]
    thumbnail: String
    description: String
    reference: String
    location: String
  }
  type Notice {
    _id: ID
    project: String
    title: String
    from: String
    to: String
    content: String
    time: String
  }
  type Schedule {
    _id: ID
    project: String
    createdTime: String
    startTime: String
    endTime: String
    proposer: String
    content: String
    member: [String]
  }

  type Query {
    getAllUsers: [Auth]
    getUser(userID: String): Auth
    getUsers(userID: [String]): [Auth]
    getUserInfo(userID: String!, userPW: String!): Auth

    getAllPosts: [Post]
    getPostsbyTitlePaginated(
      postTitle: String!
      offset: Int!
      limit: Int!
    ): [Post]
    getPostsbyTitle(postTitle: String!): [Post]
    getPostbyID(postID: String!): Post
    modifyPostbyID(
      postID: String
      postTitle: String
      postContent: String
      project: String
    ): Post

    getProjectsbyStatus(status: String): [Project]
    getProjectbyTitle(title: String): Project
    getAllProjects: [Project]
    getProjectbyID(projectID: String!): Project

    getUserNotice(userID: String): [Notice]

    getSchedulebyProjectAndMember(project: String, member: String): [Schedule]
  }

  type Mutation {
    createUser(userID: String!, userPW: String!, userName: String!): Auth
    createPost(
      postTitle: String!
      postContent: String!
      postDate: String!
      postWriter: String!
      project: String
      category: String
      tag: String
    ): Post
    createProject(
      title: String
      designer: String
      status: String
      funding: Int
      started: String
      completed: String
      progress: Int
      privilege: String
      link: String
      member: [String]
      tech: [String]
      thumbnail: String
      description: String
      reference: String
      location: String
    ): Project
    createNotice(
      project: String
      title: String
      from: String
      to: String
      content: String
      time: String
    ): Notice
    deleteNotice(_id: ID): Notice
    createSchedule(
      project: String
      createdTime: String
      startTime: String
      endTime: String
      proposer: String
      content: String
      member: [String]
    ): Schedule
  }
`;

export default typeDefs;

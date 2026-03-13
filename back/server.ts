// External Imports
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ApolloServer } from "apollo-server-express";
import "./config/database.js";
import typeDefs from "./modules/graphql/graphqlSchema.js";
import resolvers from "./modules/graphql/resolvers.js";
import session from "express-session";
import cors from "cors";

// @ts-ignore - ServiceInformation.js is git-ignored, typed via .d.ts
import Info from "./ServiceInformation.js";

// Session type augmentation
declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      name: string;
      privilege: string;
    };
  }
}

// MemoryStore import
import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await server.start();
console.log("[INIT]Apollo server started successfully");
server.applyMiddleware({ app: app as any });

app.set("port", 3000);

app.use(express.static(path.join(__dirname, "../front/build")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: Info.encryptKey,
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
      checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
    }),
    cookie: {
      maxAge: 86400000,
    },
  })
);

// CORS for test environment
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.send(
    express.static(
      path.join(__dirname, "../../front/build/particleDrop.html")
    ) as any
  );
});

app.post("/setLoginInfo", (req: Request, res: Response) => {
  req.session.user = req.body;
  res.json({ body: req.session.user });
});

app.get("/getLoginInfo", (req: Request, res: Response) => {
  const loginInfo = req.session.user;
  res.json({ body: loginInfo });
});

app.get("/logout", (req: Request, _res: Response) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
  });
});

app.listen(app.get("port"), () => {
  console.log(
    `[INIT]Server running on http://localhost:${app.get("port")}${server.graphqlPath}`
  );
});

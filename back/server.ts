// External Imports
import path from "path";
import { fileURLToPath } from "url";
import express, { Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import "./config/database.js";
import typeDefs from "./modules/graphql/graphqlSchema.js";
import resolvers from "./modules/graphql/resolvers.js";
import session from "express-session";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

await server.start();
console.log("[INIT]Apollo server started successfully");
server.applyMiddleware({ app: app as any });

app.set("port", 3000);

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

// CORS for local dev (front dev server on :3001)
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

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

// Serve frontend static files
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

// SPA fallback: non-API routes serve index.html
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(app.get("port"), () => {
  console.log(
    `[INIT]Server running on http://localhost:${app.get("port")}${server.graphqlPath}`
  );
});

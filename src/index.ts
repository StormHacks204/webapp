import dotenv from "dotenv";
import { client } from "./database/mongo";
import cors from "cors";
import { Express } from "express";
import express from "express";
import session from "express-session";
import logger from "morgan";
import postRouter from "./post";
import mongoose from "mongoose";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

declare module "express-session" {
  interface SessionData {
    username?: string;
  }
}

app.use(logger("dev"));

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "secret",
    cookie: {
      httpOnly: true,
      secure: "auto",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

console.log(process.env.MONGO_KEY);
mongoose.connect(process.env.MONGO_KEY || "");
mongoose.connection.on("open", function (ref) {
	console.log("Connected to mongo server.");
});

app.use("/posts", postRouter);

export default client;

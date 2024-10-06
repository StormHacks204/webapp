import dotenv from "dotenv";
import { client } from "./database/mongo";
import cors from "cors";
import { Express } from "express";
import express from "express";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import postRouter from "./post";
import logger from "morgan";
import mongoose from "mongoose";

const app: Express = express();
const port = process.env.PORT || 5000;
dotenv.config();
app.use(cors())

app.use(logger("dev"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

console.log(process.env.MONGO_KEY);
mongoose.connect(process.env.MONGO_KEY || "");
mongoose.connection.on("open", function (ref) {
	console.log("Connected to mongo server.");
});

app.use("/posts", ClerkExpressRequireAuth(), postRouter);

export default client;

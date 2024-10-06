import dotenv from "dotenv";
import { client } from "./database/mongo";
import { Express } from "express";
import express from "express";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import postRouter from "./post";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 5000;
dotenv.config();
app.use(cors())

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/posts", ClerkExpressRequireAuth(),postRouter);

export default client;

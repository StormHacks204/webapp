import dotenv from "dotenv";
import { client } from "./database/mongo";
import { Express } from "express";
import express from "express";

import postRouter from "./post";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/posts", postRouter);

export default client;

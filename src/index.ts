import dotenv from 'dotenv';
import { client } from './database/mongo';
import { Express } from 'express';
import express from 'express';

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});



export default client;
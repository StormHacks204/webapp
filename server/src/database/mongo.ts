import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_KEY;

if (!uri) {
	throw new Error('MONGO_KEY is not defined in the environment variables');
}

const client = new MongoClient(uri);

async function connectToDatabase() {
	try {
		await client.connect();
		console.log('Connected to MongoDB');
		return client.db();
	} catch (error) {
		console.error('Failed to connect to MongoDB', error);
		throw error;
	}
}

export { connectToDatabase, client };
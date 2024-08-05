// Import Google Client_ID and Client_Secret from the environment variables
import { MONGODB_URI } from '$env/static/private';
import config from '$lib/config/index';
import mongoose from 'mongoose';

const DatabaseURL = MONGODB_URI ?? config.server.database_url;
mongoose.set('strictQuery', true); // We want some strict queries

export async function connect() {
	// console.log(`Connecting to MongoDB at ${DatabaseURL}`);
	await mongoose.connect(DatabaseURL).catch((e) => {
		throw Error(`Error connecting to MongoDB: ${e}`);
	});
}

export async function disconnect() {
	await mongoose.disconnect();
}

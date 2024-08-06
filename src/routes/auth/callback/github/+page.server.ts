import { getGitHubEmail, getGitHubToken } from '$lib/auth/github';
import config from '$lib/config';
import { connect, disconnect } from '$lib/database';
import User from '$lib/database/models/Users';
import type { GitHubEmails } from '$lib/types/GitHubAuth';
import { type SignInData } from '$lib/types/GoogleAuth';
import cryptoRandomString from 'crypto-random-string';
import type { PageServerLoad } from '../google/$types';

// Create a cache object to store the fetched data
const cache: { [key: string]: SignInData | null } = {};

export const load: PageServerLoad = async ({ url }) => {
	const cacheKey = url.toString();

	// Check if the data is already cached
	if (cache[cacheKey] || cache[cacheKey] === null) {
		// Invalidate the cache after 5 minutes
		setTimeout(
			() => {
				delete cache[cacheKey];
			},
			1 * 60 * 1000
		);
		return cache[cacheKey];
	}
	try {
		// Turn $page.url.searchParams into a key-value object
		const searchParams = Object.fromEntries(url.searchParams.entries());
		const code = searchParams.code;
		// Validate the code parameter
		if (!code) {
			throw new Error('Authorization code is missing');
		}
		const token = await getGitHubToken(code);
		const emails = await getGitHubEmail(token.access_token);

		// Convert all the emails into an array of strings 
		const profile_email = emails.map((email: GitHubEmails) => email.email);

		// Find a user that matches one of these emails
		
		
		// Connect to the database and find the user with the email
		await connect();
		const user = await User.findOne({ email: { $in: profile_email } });
		// If the user does not exist, return null
		if (!user) {
			await disconnect();
			cache[cacheKey] = null;
			return null;
		}

		// If the user exists, create the token
		user.token =
			'dtk-oauth.github.' +
			cryptoRandomString({
				length: config.server.auth['token-length'],
				type: 'alphanumeric'
			});
		const profile_token = user.token;
		const data: SignInData = {
			token: profile_token,
			staff: user.staff
		};
		// Save the token to the database
		await user.save();
		// Disconnect from the database
		await disconnect();

		// Cache the fetched data
		cache[cacheKey] = data;

		return data;
	} catch (error) {
		console.error('Error during sign-in process:', error);
		return {
			status: 500,
			error: 'Internal Server Error'
		};
	}
};

export const csr = true;
export const ssr = true;

import { getGoogleProfile, getGoogleToken } from '$lib/auth/google';
import config from '$lib/config';
import { connect, disconnect } from '$lib/database';
import User from '$lib/database/models/Users';
import { type SignInData } from '$lib/types/GoogleAuth';
import cryptoRandomString from 'crypto-random-string';
import type { PageServerLoad } from './$types';

// Create a cache object to store the fetched data
const cache: { [key: string]: SignInData | null } = {};

export const load: PageServerLoad = async ({ url }) => {
	const cacheKey = url.toString();

	// Check if the data is already cached
	if (cache[cacheKey]) {
		return {
			props: cache[cacheKey]
		};
	}

	// Turn $page.url.searchParams into a key-value object
	const searchParams = Object.fromEntries(url.searchParams.entries());
	const token = await getGoogleToken(searchParams.code);
	const profile = await getGoogleProfile(token.access_token);

	const profile_email = profile.email;
	// Connect to the database and find the user with the email
	await connect();
	const user = await User.findOne({ email: profile_email });
	// If the user does not exist, return null
	if (!user) {
		await disconnect();
		return {
			props: null
		};
	}

	// If the user exists, create the token
	user.token =
		'dtk-oauth.' +
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

	return {
		props: data
	};
};

export const csr = true;
export const ssr = true;

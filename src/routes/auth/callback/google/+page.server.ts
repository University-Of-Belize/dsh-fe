// Import getGoogleSession from the auth module
import { getGoogleProfile, getGoogleToken } from '$lib/auth/google';
import config from '$lib/config';
import { connect, disconnect } from '$lib/database';
import User from '$lib/database/models/Users';
import cryptoRandomString from 'crypto-random-string';
import type { PageServerLoad } from './$types';
let data: string | null;

export const load: PageServerLoad = async ({ url }) => {
	// Run once
	if (data || data === null) {
		return {
			props: {
				token: data
			}
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
		data = null;
		await disconnect();
		return {
			props: {
				token: null
			}
		};
	}
	// console.log('User found: ', user);
	// If the user exists, create the token
	user.token =
		'dtk-oauth.' +
		cryptoRandomString({
			length: config.server.auth['token-length'],
			type: 'alphanumeric'
		});
	const profile_token = user.token;
	data = profile_token;
	// Save the token to the database
	await user.save();
	// Disconnect from the database
	await disconnect();

	return {
		props: {
			token: profile_token
		}
	};
};

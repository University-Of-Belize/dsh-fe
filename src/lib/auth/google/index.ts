// Import Google Client_ID and Client_Secret from the environment variables
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import config from '$lib/config/private/index';
import { type GoogleSession, type GoogleToken, type GoogleUserInfo } from '$lib/types/GoogleAuth';

export const getGoogleSession = async (): Promise<GoogleSession> => {
	const nonce = Math.random().toString(36).substring(7);
	// Redirect URI for the Google OAuth is the base url + /auth/callback/google
	const redirect_uri = config.server['bound-domain'] + '/auth/callback/google';
	const session = {
		GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
		Nonce: nonce,
		AuthUrl: `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.profile%20https%3A//www.googleapis.com/auth/userinfo.email%20openid&access_type=offline&include_granted_scopes=true&response_type=code&state=${nonce}&redirect_uri=${redirect_uri}&client_id=${GOOGLE_CLIENT_ID}&prompt=select_account%20consent`
	};
	return session;
};

export const getGoogleToken = async (code: string): Promise<GoogleToken> => {
	const redirect_uri = config.server['bound-domain'] + '/auth/callback/google';
	const response = await fetch(
		`https://oauth2.googleapis.com/token?code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
		{
			method: 'POST'
		}
	);
	if (response.ok) {
		return response.json();
	}
	try {
		const response_code = response.status;
		const error = await response.json();
		console.log(response_code, error);
	} catch (e) {
		// Do nothing
	}
	throw new Error('Failed to fetch Google Token');
};

export const getGoogleProfile = async (token: string): Promise<GoogleUserInfo> => {
	const response = await fetch('https://www.googleapis.com/userinfo/v2/me?alt=json', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	if (response.ok) {
		return response.json();
	}
	try {
		const response_code = response.status;
		const error = await response.json();
		console.log(response_code, error);
	} catch (e) {
		// Do nothing
	}
	throw new Error('Failed to fetch Google Profile');
};

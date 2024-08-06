// Import Google Client_ID and Client_Secret from the environment variables
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import config from '$lib/config/index';
import {
    type GitHubEmails,
    type GitHubSession,
    type GitHubToken,
    type GitHubUser
} from '$lib/types/GitHubAuth';

export const getGitHubSession = async (): Promise<GitHubSession> => {
	const nonce = Math.random().toString(36).substring(7);
	// Redirect URI for the Google OAuth is the base url + /auth/callback/github
	const redirect_uri = config.server['bound-domain'] + '/auth/callback/github';
	const session = {
		GITHUB_CLIENT_ID: GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: GITHUB_CLIENT_SECRET,
		Nonce: nonce,
		AuthUrl: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&prompt=select_account&scope=user:email&redirect_uri=${redirect_uri}&state=${nonce}`
	};
	return session;
};

export const getGitHubToken = async (code: string): Promise<GitHubToken> => {
	const redirect_uri = config.server['bound-domain'] + '/auth/callback/github';
	const response = await fetch(
		`https://github.com/login/oauth/access_token?code=${code}&client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&redirect_uri=${redirect_uri}`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json'
			}
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
	throw new Error('Failed to fetch GitHub Token');
};

export const getGitHubProfile = async (token: string): Promise<GitHubUser> => {
	const response = await fetch('https://api.github.com/user', {
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
	throw new Error('Failed to fetch GitHub Profile');
};
export const getGitHubEmail = async (token: string): Promise<GitHubEmails[]> => {
	const response = await fetch('https://api.github.com/user/emails', {
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
	throw new Error('Failed to fetch GitHub Profile');
};

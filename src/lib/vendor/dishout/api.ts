import { goto } from '$app/navigation';
import settings from '$lib/config/settings';
import { toast } from '@zerodevx/svelte-toast';
import config from '$lib/config/settings';

// Stolen code from: https://developer.spotify.com/
// It's a great idea though! 😅😅
async function fetchWebApi(
	endpoint: string,
	method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS',
	body?: object,
	json?: boolean,
	token?: string,
	silent?: boolean // Silences any toast messages. Do not emit any toast messages or redirect the user
): Promise<Response> | Promise<number | object | void> {
	try {
		// If the server is offline, don't even try to fetch
		if (localStorage.getItem('serverOffline') === 'true') {
			toast.push('Server offline. Please refresh the page.');
			console.error('Server offline. Please refresh the page.');
			return 0;
		}
		const res = await fetch(`${settings.server.HTTPOrigin}/api/v${config.server['api-version']}/${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token ? token : localStorage.token}`
			},
			method,
			body: JSON.stringify(body)
		});
		if (!silent) {
			// Moved from countless different files
			if (res.status === 403) {
				const continue_url = new URL(location.href); // Get our intended URL
				localStorage.removeItem('token');
				localStorage.removeItem('user_id');
				localStorage.removeItem('user');
				toast.push('Hey, you need to log in.', {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				});
				goto(
					`/auth/login?continue=${window.encodeURIComponent(
						continue_url.pathname + continue_url.search
					)}`
				); // Pathname is our intended URL
				return {
					ok: false,
					status: 500,
					message: 'WebAPI: The user is not authenticated.',
					json: () => {
						return {
							status: false,
							message: 'WebAPI: The client is not authorized to perform this action.'
						};
					}
				};
			}
		}
		localStorage.removeItem('APIretryCount');
		// Depending on what we want to do
		return json ? await res.json() : res;
	} catch (error: unknown) {
		if (error.message === 'Failed to fetch') {
			// Check the type of the error for network-related issues
			if (error.type === 'system') {
				// The request failed due to a network error
				const retryCount = parseInt(localStorage.APIretryCount || '0');
				if (retryCount < config.ui['APIretryLimit']) {
					// Increment the retry count
					localStorage.APIretryCount = (retryCount + 1).toString();
					// Calculate backoff time (in milliseconds)
					const backoffTime = Math.pow(2, retryCount) * 1000;
					// Retry after the backoff time
					// Retry after the backoff time
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							// Recall the API request function
							fetchWebApi(endpoint, method, body, json, token, silent).then(resolve).catch(reject);
						}, backoffTime);
					});
				}
				// Otherwise, we've tried 3 times already so we assume the server is offline
				localStorage.setItem('serverOffline', 'true');
				if (!silent) {
					// Throw to the UI and to the console
					toast.push('Network error. Check your internet connection.');
				}
				throw new Error('Network error. Check your internet connection.');
			}
		}
		const retryCount = parseInt(localStorage.APIretryCount || '0');
		if (retryCount < config.ui['APIretryLimit']) {
			// Increment the retry count
			localStorage.APIretryCount = (retryCount + 1).toString();
			// Calculate backoff time (in milliseconds)
			const backoffTime = Math.pow(2, retryCount) * 1000;
			// Retry after the backoff time
			// Retry after the backoff time
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					toast.push(
						`Testing your internet connection (${retryCount + 1}/${config.ui['APIretryLimit']})...`
					);
					// Recall the API request function
					fetchWebApi(endpoint, method, body, json, token, silent).then(resolve).catch(reject);
				}, backoffTime);
			});
		}
		localStorage.setItem('serverOffline', 'true'); // Make the next refresh go to watchdog
		console.log(JSON.stringify(error));
		if (!silent) {
			// Throw to the UI and the console
			toast.push(`FetchWebAPI '${method} ${endpoint}': Failed—Fatal error: ${error}`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORRED))'
				}
			});
		}
		throw console.error(`FetchWebAPI '${method} ${endpoint}': Failed—Fatal error: ${error}`);
	}
}

export { fetchWebApi };

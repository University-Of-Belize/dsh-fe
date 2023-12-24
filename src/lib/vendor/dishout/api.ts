import settings from '$lib/config/settings';
import { toast } from '@zerodevx/svelte-toast';

// Stolen code from: https://developer.spotify.com/
// It's a great idea though! 😅😅
async function fetchWebApi(
	endpoint: string,
	method: string,
	body?: object,
	json?: boolean,
	token?: string,
	silent?: boolean // Silences any toast messages
): Promise<Response> | Promise<number | void> {
	try {
		// If the server is offline, don't even try to fetch
		if (localStorage.getItem('serverOffline') === 'true') {
			toast.push('Server offline. Please refresh the page.');
			console.error('Server offline. Please refresh the page.');
			return 0;
		}
		const res = await fetch(`${settings.server.HTTPOrigin}/api/${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token ? token : localStorage.token}`
			},
			method,
			body: JSON.stringify(body)
		});
		// Depending on what we want to do
		return json ? await res.json() : res;
	} catch (error: unknown) {
		if (error.message === 'Failed to fetch') {
			// Check the type of the error for network-related issues
			if (error.type === 'system') {
				// The request failed due to a network error
				localStorage.setItem('serverOffline', 'true');
				if (!silent) {
					// Throw to the UI and to the console
					toast.push('Network error. Check your internet connection.');
				}
				throw console.error('Network error. Check your internet connection.');
			}
		}
		localStorage.setItem('serverOffline', 'true'); // Make the next refresh go to watchdog
		console.log(JSON.stringify(error));
		if (!silent) {
			// Throw to the UI and the console
			toast.push(`FetchWebAPI '${method} ${endpoint}': Failed—Fatal error: ${error}`);
		}
		throw console.error(`FetchWebAPI '${method} ${endpoint}': Failed—Fatal error: ${error}`);
	}
}

export { fetchWebApi };
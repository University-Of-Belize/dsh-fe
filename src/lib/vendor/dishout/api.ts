import settings from '$lib/config/settings';

// Stolen code from: https://developer.spotify.com/
// It's a great idea though! 😅😅
async function fetchWebApi(endpoint: string, method: string, body?: object, json?: boolean): Promise<Response> {
	const res = await fetch(`${settings.server.HTTPOrigin}/api/${endpoint}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.token}`
		},
		method,
		body: JSON.stringify(body)
	});
    // Depending on what we want to do
	return json ? await res.json() : res;
}

export { fetchWebApi };

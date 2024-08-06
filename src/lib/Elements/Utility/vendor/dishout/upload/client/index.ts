import config from '$lib/config/index';
import { toast } from '@zerodevx/svelte-toast';

export async function R2S3Upload(event: Event, custom_path?: string, custom_filename?: string) {
	let pub_url: string;
	// Create the multipart form
	const form = new FormData();
	form.append('file', event?.target?.files[0]);
	if (custom_path) {
		form.append('path', custom_path);
	}
	if (custom_filename) {
		form.append('filename', custom_filename);
	}

	// Let's upload it
	await fetch('/api/upload', {
		headers: {
			// Content-Type is multipart form
			// 'Content-Type': 'multipart/form-data'
		},
		method: 'PUT',
		body: form
	})
		.then(async (response) => {
			if (!response.ok) {
				const json = await response.json();
				return toast.push(`Oops. Something unexpected happened while uploading the file: ${json.error}`);
			}
			// What to do after uploading the file
			toast.push(`You have updated the photo successfully.`); // Push notification that upload succeeded
			// Return the URL to the file
			const json = await response.json();
			pub_url = json.url;
		})
		.catch((error) => {
			console.error(error);
			toast.push(`Oops. Something unexpected happened while uploading the file: ${error.message}`);
			return config['product-view']['default-image'];
		});
	return pub_url ?? config['product-view']['default-image'];
}

import { R2S3Upload } from '$lib/Elements/Utility/vendor/dishout/upload/server';
import { json } from '@sveltejs/kit';
export async function PUT({ request }) {
	const form = await request.formData();
	const file = form.get('file');
	const path = form.get('path');
	const filename = form.get('filename');
	if (!file) {
		return json({ error: 'No file was uploaded' }, { status: 400 });
	}

	if (!(file instanceof File)) {
		return json({ error: 'Invalid file' }, { status: 400 });
	}

	// Ensure that this File is not empty
	if (file.size === 0) {
		return json({ error: 'Empty file' }, { status: 400 });
	}

	// Ensure that this File is not too large
	if (file.size > 10485760) {
		return json({ error: 'File too large' }, { status: 400 });
	}

	// Ensure that this File is an image
	if (!file.type.startsWith('image/')) {
		return json({ error: 'Disallowed mime type' }, { status: 400 });
	}

	const custom_path = path ?? undefined;
	const custom_filename = filename ?? undefined;
	const pub_url = await R2S3Upload(file, custom_path?.toString(), custom_filename?.toString());

	return json({ url: pub_url }, { status: 201 });
}

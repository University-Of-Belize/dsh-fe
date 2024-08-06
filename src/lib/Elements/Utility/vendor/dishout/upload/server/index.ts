import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import config_pub from '$lib/config/index';
import config_private from '$lib/config/private/index';
const config = { ...config_pub, ...config_private };

const S3 = new S3Client({
	region: 'auto',
	endpoint: config['server']['s3']['bucket-id'],
	credentials: {
		accessKeyId: config['server']['s3']['access-key-id'],
		secretAccessKey: config['server']['s3']['secret-key-id']
	}
});

export async function R2S3Upload(file: File, custom_path?: string, custom_filename?: string) {
	let pub_url: string; // Public URL to file

	// Get the signed URL
	const url = await getSignedUrl(
		S3,
		new PutObjectCommand({
			Bucket: 'primary-uswest',
			Key: (custom_path ? `${custom_path}/` : '') + (custom_filename ?? file.name)
		}),
		{
			expiresIn: 60 * 60 * 4 // 4h
		}
	);

	// And upload it
	await fetch(url, {
		headers: {
			'Content-Type': file.type
		},
		method: 'PUT',
		body: file
	})
		.then((response) => {
			if (!response.ok) {
				return;
			}
			// Return the URL to the file
			pub_url = `${config['server']['s3']['pub-bucket-id']}/${
				custom_path ? `${custom_path}/` : ''
			}${custom_filename ?? file.name}`; // Constructed URL
		})
		.catch(() => {
			return config['product-view']['default-image'];
		});
	return pub_url ?? config['product-view']['default-image'];
}

import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			autoUploadSourceMaps: false,
			sourceMapsUploadOptions: {
				org: 'immanuel-daviel-a-garcia',
				project: 'ubcafe',
				authToken: process.env.SENTRY_AUTH_TOKEN
			}
		}),
		sveltekit()
	]
});

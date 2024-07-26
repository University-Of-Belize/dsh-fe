import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		sourcemap: true
	},
	plugins: [
		sentrySvelteKit({
			autoUploadSourceMaps: false,
			sourceMapsUploadOptions: {
				org: 'immanuel-daviel-a-garcia',
				project: 'ubcafe',
				authToken: process.env.SENTRY_AUTH_TOKEN,
				sourcemaps: {
					assets: ["./build/*/**/*"],
					ignore: ["**/build/client/**/*"],
					filesToDeleteAfterUpload: ["./build/**/*.map"],
				},
			}
		}),
		sveltekit()
	]
});

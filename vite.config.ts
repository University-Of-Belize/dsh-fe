import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import { join } from 'path';
import { partytownVite } from '@builder.io/partytown/utils';

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
					assets: ['./build/*/**/*'],
					ignore: ['**/build/client/**/*'],
					filesToDeleteAfterUpload: ['./build/**/*.map']
				}
			}
		}),
		sveltekit(),
		partytownVite({
			dest: join(__dirname, 'static', '~partytown')
		})
	]
});

import config from '$lib/config/private/index';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		firebase: {
			config: config.firebase['config']
		}
	};
};

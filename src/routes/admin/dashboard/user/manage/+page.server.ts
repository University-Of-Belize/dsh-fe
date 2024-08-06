import config from '$lib/config/private/index';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		organization: config.server['bound-organization']
	};
};

import config from '$lib/config/private/index';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		support_email: config.server['support-email']
	};
};

import config from '$lib/config/private/index';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		tinymce_apikey: config['tiny-mce']['api-key']
	};
};

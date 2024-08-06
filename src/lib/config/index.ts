import { version } from '$app/environment';
import { PUBLIC_SERVER_API_RETRY_LIMIT, PUBLIC_SERVER_API_VERSION, PUBLIC_SERVER_HTTP_ORIGIN } from '$env/static/public';

const settings = {
	server: {
		HTTPOrigin: PUBLIC_SERVER_HTTP_ORIGIN,
		'api-version': PUBLIC_SERVER_API_VERSION,
		defaultTimeZone: 'America/Belize',
		auth: {
			'token-length': 64
		}
	},
	'product-view': {
		'default-image': '/placeholder/via-placeholder/500.png'
	},
	'product-showcase': {
		'default-image': '/placeholder/via-placeholder/50.png'
	},
	'home-page': {
		'default-image': '/placeholder/via-placeholder/100.png'
	},
	user: {
		'default-image': '/placeholder/avatar/128.png'
	},
	checkout: {
		currency: 'BZD'
	},
	ui: {
		notice: 'You are viewing <br/><b>A PREVIEW</b>',
		version: version,
		APIretryLimit: JSON.parse(PUBLIC_SERVER_API_RETRY_LIMIT), // Should be enough for server "wake-up"
		'branding-text': 'UniFood',
		'branding-logo': '/icons/logo.svg',
		'default-product': {
			category: { _id: 'placeholder', name: 'Uncategorized' },
			description: null,
			image: null,
			in_stock: null,
			price: null,
			productName: null,
			slug: null
		}
	}
};

export default settings;

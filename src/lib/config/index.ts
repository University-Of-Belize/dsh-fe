import { version } from '$app/environment';
import {
	FIREBASE_CONFIG_API_KEY,
	FIREBASE_CONFIG_APP_ID,
	FIREBASE_CONFIG_AUTH_DOMAIN,
	FIREBASE_CONFIG_MEASUREMENT_ID,
	FIREBASE_CONFIG_MESSAGING_SENDER_ID,
	FIREBASE_CONFIG_PROJECT_ID,
	FIREBASE_CONFIG_STORAGE_BUCKET,
	FIREBASE_VAPID_KEY,
	MONGODB_URI,
	S3_ACCESS_KEY_ID,
	S3_BUCKET_ID,
	S3_PUB_BUCKET_ID,
	S3_SECRET_KEY_ID,
	SERVER_API_VERSION,
	SERVER_BOUND_ORGANIZATION,
	SERVER_DEFAULT_TIMEZONE,
	SERVER_HOME_DOMAIN,
	SERVER_HTTP_ORIGIN,
	SERVER_INDEXING_INTERVAL,
	SERVER_SUPPORT_EMAIL,
	TINYMCE_API_KEY
} from '$env/static/private';

const settings = {
	server: {
		database_url: MONGODB_URI,
		defaultTimeZone: SERVER_DEFAULT_TIMEZONE,
		'api-version': SERVER_API_VERSION,
		HTTPOrigin: SERVER_HTTP_ORIGIN,
		'support-email': SERVER_SUPPORT_EMAIL,
		'bound-organization': SERVER_BOUND_ORGANIZATION,
		'bound-domain': SERVER_HOME_DOMAIN,
		'indexing-interval': SERVER_INDEXING_INTERVAL,
		s3: {
			'bucket-id': S3_BUCKET_ID,
			'pub-bucket-id': S3_PUB_BUCKET_ID,
			'access-key-id': S3_ACCESS_KEY_ID,
			'secret-key-id': S3_SECRET_KEY_ID
		},
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
		APIretryLimit: 12, // Should be enough for server "wake-up"
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
		},
		firebase: {
			config: {
				apiKey: FIREBASE_CONFIG_API_KEY,
				authDomain: FIREBASE_CONFIG_AUTH_DOMAIN,
				projectId: FIREBASE_CONFIG_PROJECT_ID,
				storageBucket: FIREBASE_CONFIG_STORAGE_BUCKET,
				messagingSenderId: FIREBASE_CONFIG_MESSAGING_SENDER_ID,
				appId: FIREBASE_CONFIG_APP_ID,
				measurementId: FIREBASE_CONFIG_MEASUREMENT_ID
			},
			'vapid-key': FIREBASE_VAPID_KEY
		},
		'tiny-mce': {
			'api-key': TINYMCE_API_KEY
		}
	}
};

export default settings;

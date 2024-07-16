import { version } from '$app/environment';

const settings = {
	server: {
		HTTPOrigin: 'https://winter-darkness-1705.fly.dev',
		'api-version': '1',
		// HTTPOrigin: 'https://icy-rain-2400.fly.dev',
		// HTTPOrigin: 'http://127.0.0.1:8080',
		// HTTPOrigin: 'http://192.168.38.16:8080',
		// HTTPOrigin: 'http://192.168.1.102:8080',
		'support-email': 'cafeteria@ub.edu.bz',
		'bound-organization': 'University of Belize',
		'bound-domain': 'https://cafe.ub.edu.bz',
		'indexing-interval': '3 minutes',
		s3: {
			'bucket-id':
				'https://6fdadd342786403cfcd687d3475d1234.r2.cloudflarestorage.com/primary-uswest',
			'pub-bucket-id': 'https://pub-25848f6979f1410bb0c611a1a9c24310.r2.dev/primary-uswest',
			'access-key-id': 'a797ba44f071a177ce7467ad193c4ae7',
			'secret-key-id': 'a3d77455a069f1d8c945ef665130bc7c00993cbb2fee73f7be01421e7aa9fc52'
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
		'branding-text': 'Plattr',
		'branding-logo': '/icons/icon-svgrepo.svg',
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
				apiKey: 'AIzaSyBXolTmpW_6vwf7ryhmBxAGDVZr3vEaEU8',
				authDomain: 'plattr-32d57.firebaseapp.com',
				projectId: 'plattr-32d57',
				storageBucket: 'plattr-32d57.appspot.com',
				messagingSenderId: '955312324775',
				appId: '1:955312324775:web:fa4d3755462265f83a1b82',
				measurementId: 'G-N0E9QJVTK4'
			},
			'vapid-key':
				'BC3R5IsVxkK7bPwc47qAqC4NmKhLnkspqNl7gILUJU2dFyDfwmlvIyYSJYGxAu7cuFq86dndLTH19ZV3Bkqq_ec'
		},
		'tiny-mce': {
			'api-key': 'zwg7kdz5ie036r4ksqxf75r5pe9jnbdn6eg93r2f6dtxa5da'
		}
	}
};

export default settings;

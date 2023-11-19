import { version } from '$app/environment';

const settings = {
	server: {
		HTTPOrigin: 'https://winter-darkness-1705.fly.dev',
		'support-email': 'cafe@ub.edu.bz',
		'bound-organization': 'University of Belize',
		'indexing-interval': "3 minutes", "s3": {
			'bucket-id': "https://6fdadd342786403cfcd687d3475d1234.r2.cloudflarestorage.com/primary-uswest",
			'pub-bucket-id': "https://pub-25848f6979f1410bb0c611a1a9c24310.r2.dev/primary-uswest",
			'access-key-id': "a797ba44f071a177ce7467ad193c4ae7",
			"secret-key-id": "a3d77455a069f1d8c945ef665130bc7c00993cbb2fee73f7be01421e7aa9fc52"
		}
	},
	'product-view': {
		'default-image': 'https://via.placeholder.com/500'
	},
	'product-showcase': {
		'default-image': 'https://via.placeholder.com/50'
	},
	'home-page': {
		'default-image': 'https://via.placeholder.com/100'
	},
	user: {
		'default-image': '/placeholder/avatar.png'
	},
	checkout: {
		currency: 'BZD'
	},
	ui: {
		notice: 'You are viewing <br/><b>A PREVIEW</b>',
		version: version,
		'default-product': {
			category: { _id: "placeholder", name: "Uncategorized" },
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

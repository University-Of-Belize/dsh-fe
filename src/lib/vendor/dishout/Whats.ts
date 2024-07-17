const WhatDB = {
	public: {
		auth: 'auth',
		review: 'review',
		category: 'category',
		menu: 'menu',
		variation: "menu/variation",
		order: 'order',
		promos: 'promo',
		post: 'post',
		user: 'user'
	},
	private: {
		promos: '__promo',
		review: '__review',
		feedback: '__feedback',
		category: '__category',
		order: '__order',
		post: '__post',
		menu: '__menu',
		variation: "__menu/variation",
		user: '__user'
	}
};

export default WhatDB;

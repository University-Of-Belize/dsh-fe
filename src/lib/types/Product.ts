interface Product {
	id: string;
	score: number;
	terms: string[];
	match: {
		[key: string]: string[];
	};
	description: string;
	productName: string;
	category: {
		_id: string;
		name: string;
		alias: string;
		description: string;
		hidden: boolean;
		__v: number;
	};
	image: string;
	in_stock: number;
	price: {
		$numberDecimal: string;
	};
	reviews: {
		_id: string;
		content: string;
		original_content: string;
		rating: number;
		reviewer: string;
		hidden: boolean;
		product: string;
		__v: number;
	}[];
	slug: string;
}

export type { Product };

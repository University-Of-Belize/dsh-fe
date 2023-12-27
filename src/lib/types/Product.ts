import type { Category } from './Category';
import type { Review } from './Review';

interface Product {
	_id: string;
	category: Category;
	description: string;
	image: string;
	in_stock: number;
	price: {
		$numberDecimal: string;
	};
	productName: string;
	reviews: Review[];
	slug: string;
	__v: number;
	keywords: string[];
}

interface CartProduct {
	product: {
		_id: string;
		category: string;
		description: string;
		image: string;
		in_stock: number;
		price: {
			$numberDecimal: string;
		};
		productName: string;
		reviews: Review[];
		slug: string;
		__v: number;
		keywords: string[];
	};
	quantity: number;
	_id: string;
}

interface EngineProduct extends Product {
	id: string;
	score: number;
	terms: string[];
	match: {
		[key: string]: string[];
	};
	reviews: Review[];
}

export type { Product, CartProduct, EngineProduct };

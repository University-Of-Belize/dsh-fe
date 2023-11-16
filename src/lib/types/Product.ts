import type { Category } from './Category';
import type { Review } from './Review';

interface Product {
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
	search_terms: string[];
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
		search_terms: string[];
	};
	quantity: number;
	_id: string;
}

interface EngineProduct extends Omit<Product, 'category'> {
	id: string;
	score: number;
	terms: string[];
	match: {
		[key: string]: string[];
	};
	category: Category;
	reviews: Review[];
}

export type { Product, CartProduct, EngineProduct };

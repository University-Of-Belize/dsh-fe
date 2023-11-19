import type { Product } from './Product';
import type { User } from './User';

interface Review {
	_id: string;
	id: number;
	content: string;
	original_content: string;
	rating: number;
	reviewer: User;
	hidden: boolean;
	product: Product;
	__v: number;
}

export type { Review };

import type { CartProduct } from './Product';
import type { Promo } from './Promo';
import type { User } from './User';

interface Order {
	_id: string;
	order_code: string;
	order_from: User;
	order_date: number;
	total_amount: {
		$numberDecimal: string;
	};
	final_amount: {
		$numberDecimal: string;
	};
	discount_amount: {
		$numberDecimal: string;
	};
	delay_time: number;
	promo_code?: Promo;
	is_accepted?: boolean;
	override_by?: User;
	products: CartProduct[];
	completed: boolean;
	__v: number;
}

export type { Order };


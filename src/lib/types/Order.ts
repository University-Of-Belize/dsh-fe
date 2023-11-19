import type { CartProduct } from "./Product";
import type { User } from "./User";

interface Order {
    _id: string;
    order_code: string;
    order_from: User;
    order_date: number;
    total_amount: {
        $numberDecimal: string;
    };
    delay_time: number;
    products: CartProduct[];
    __v: number;
}

export type { Order }
import type { CartProduct } from "./Product";

interface User {
	_id: string;
	id: number;
	username: string;
	password: string;
	email: string;
	profile_picture?: string;
	banner?: string;
	staff: boolean;
	credit: {
		$numberDecimal: string;
	};
	cart: CartProduct[];
	channel_id: string;
	reset_token: string | null;
	restrictions: number;
	__v: number;
	token: string | null;
	activation_token?: string;
	firstAlert?: boolean;
}

export type { User };

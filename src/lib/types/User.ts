interface User {
	_id: string;
	id: number;
	username: string;
	password: string;
	email: string;
	profile_picture?: string;
	staff: boolean;
	credit: {
		$numberDecimal: string;
	};
	cart: any[];
	reset_token: string | null;
	restrictions: number;
	__v: number;
	token: string | null;
	activation_token?: string;
}

export type { User };

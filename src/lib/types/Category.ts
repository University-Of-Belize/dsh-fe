interface Category {
	_id: string;
	name: string;
	alias: string;
	description: string;
	image: string | undefined;
	hidden: boolean;
	__v: number;
}

export type { Category };

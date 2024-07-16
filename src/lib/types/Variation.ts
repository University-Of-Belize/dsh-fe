interface Variation {
	_id: string;
	Name: string;
	Product_id: string;
	__v: number;
}

interface VCategory {
	_id: string;
	Name: string;
	VCategory_id: string;
	__v: number;
}

type VariationData = (VCategory | Variation)[][];

export type { VCategory, Variation, VariationData };

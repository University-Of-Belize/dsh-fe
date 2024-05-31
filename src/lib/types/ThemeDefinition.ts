export class ThemeDefinition {
	COLORWHT: string;
	COLORWHT1: string;
	COLORWHT2: string;
	COLORWHT3: string;
	COLORWHT4: string;
	COLORWHT5: string;

	COLORBLK: string;
	'COLORBLK-TONE2': string;
	COLORBLK1: string;
	COLORBLK2: string;
	COLORBLK3: string;
	COLORBLK4: string;
	COLORBLK5: string;

	COLORGRY: string;
	COLORGRN: string;
	COLORGRN1: string;
	COLORGRN2: string;

	COLORYLW: string;

	COLORBLE: string;

	COLORBYW: string;

	COLORHPK: string;

	COLORPNK: string;

	COLORRED: string;

	constructor() {
		const randomRGB = () =>
			`${Math.floor(Math.random() * 256)} ${Math.floor(Math.random() * 256)} ${Math.floor(
				Math.random() * 256
			)}`;

		this.COLORWHT = randomRGB();
		this.COLORWHT1 = randomRGB();
		this.COLORWHT2 = randomRGB();
		this.COLORWHT3 = randomRGB();
		this.COLORWHT4 = randomRGB();
		this.COLORWHT5 = randomRGB();

		this.COLORBLK = randomRGB();
		this['COLORBLK-TONE2'] = randomRGB();
		this.COLORBLK1 = randomRGB();
		this.COLORBLK2 = randomRGB();
		this.COLORBLK3 = randomRGB();
		this.COLORBLK4 = randomRGB();
		this.COLORBLK5 = randomRGB();

		this.COLORGRY = randomRGB();
		this.COLORGRN = randomRGB();
		this.COLORGRN1 = randomRGB();
		this.COLORGRN2 = randomRGB();

		this.COLORYLW = randomRGB();

		this.COLORBLE = randomRGB();

		this.COLORBYW = randomRGB();

		this.COLORHPK = randomRGB();

		this.COLORPNK = randomRGB();

		this.COLORRED = randomRGB();
	}
}

interface ThemeData {
	name: string;
	id: string;
	description: string | undefined;
}

export type { ThemeData };

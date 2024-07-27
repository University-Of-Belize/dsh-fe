export class ThemeDefinition {
	LANDINGPHOTO: string;
	COLORLIGHT: string;
	COLORDARK: string;

	COLORMAIN: string;
	COLORMAIN2: string; /* Tone 2 */

	COLORACCENTL: string;
	COLORACCENTD: string;

	constructor() {
		const randomRGB = () =>
			`${Math.floor(Math.random() * 256)} ${Math.floor(Math.random() * 256)} ${Math.floor(
				Math.random() * 256
			)}`;

		this.LANDINGPHOTO = 'https://example.com/your_image.png';
		this.COLORLIGHT = randomRGB();
		this.COLORDARK = randomRGB();

		this.COLORMAIN = randomRGB();
		this.COLORMAIN2 = randomRGB(); /* Tone 2 */

		this.COLORACCENTL = randomRGB();
		this.COLORACCENTD = randomRGB();
	}
}

interface ThemeData {
	name: string;
	id: string;
	description: string | undefined;
}

export type { ThemeData };


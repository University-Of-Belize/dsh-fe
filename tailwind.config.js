/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Using modern `rgb`
				COLORWHT5: 'rgb(var(--COLORWHT5) / var(--tw-bg-opacity))',
				COLORWHT4: 'rgb(var(--COLORWHT4) / var(--tw-bg-opacity))',
				COLORWHT3: 'rgb(var(--COLORWHT3) / var(--tw-bg-opacity))',
				COLORWHT2: 'rgb(var(--COLORWHT2) / var(--tw-bg-opacity))',
				COLORWHT1: 'rgb(var(--COLORWHT1) / var(--tw-bg-opacity))',
				COLORWHT: 'rgb(var(--COLORWHT) / var(--tw-bg-opacity))',
				COLORBLE: 'rgb(var(--COLORBLE) / var(--tw-bg-opacity))',
				COLORBLK5: 'rgb(var(--COLORBLK5) / var(--tw-bg-opacity))',
				COLORBLK4: 'rgb(var(--COLORBLK4) / var(--tw-bg-opacity))',
				COLORBLK3: 'rgb(var(--COLORBLK3) / var(--tw-bg-opacity))',
				COLORBLK2: 'rgb(var(--COLORBLK2) / var(--tw-bg-opacity))',
				COLORBLK1: 'rgb(var(--COLORBLK1) / var(--tw-bg-opacity))',
				COLORBLK: 'rgb(var(--COLORBLK) / var(--tw-bg-opacity))',
				COLORGRY: 'rgb(var(--COLORGRY) / var(--tw-bg-opacity))',
				COLORGRN: 'rgb(var(--COLORGRN) / var(--tw-bg-opacity))',
				COLORGRN1: 'rgb(var(--COLORGRN1) / var(--tw-bg-opacity))',
				COLORGRN2: 'rgb(var(--COLORGRN2) / var(--tw-bg-opacity))',
				COLORYLW: 'rgb(var(--COLORYLW) / var(--tw-bg-opacity))',
				COLORBYW: 'rgb(var(--COLORBYW) / var(--tw-bg-opacity))',
				COLORHPK: 'rgb(var(--COLORHPK) / var(--tw-bg-opacity))',
				COLORPNK: 'rgb(var(--COLORPNK) / var(--tw-bg-opacity))',
				COLORRED: 'rgb(var(--COLORRED) / var(--tw-bg-opacity))'
			}
		}
	},
	plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Using modern `rgb`
				COLORWHT: 'rgb(var(--COLORWHT) / var(--tw-bg-opacity))',
				COLORWHT1: 'rgb(var(--COLORWHT1) / var(--tw-bg-opacity))',
				COLORWHT2: 'rgb(var(--COLORWHT2) / var(--tw-bg-opacity))',
				COLORWHT3: 'rgb(var(--COLORWHT3) / var(--tw-bg-opacity))',
				COLORWHT4: 'rgb(var(--COLORWHT4) / var(--tw-bg-opacity))',
				COLORBLE: 'rgb(var(--COLORBLE) / var(--tw-bg-opacity))',
				COLORBLK: 'rgb(var(--COLORBLK) / var(--tw-bg-opacity))',
				COLORYLW: 'rgb(var(--COLORYLW) / var(--tw-bg-opacity))',
				COLORBYW: 'rgb(var(--COLORBYW) / var(--tw-bg-opacity))',
				COLORPNK: 'rgb(var(--COLORPNK) / var(--tw-bg-opacity))',
				COLORRED: 'rgb(var(--COLORRED) / var(--tw-bg-opacity))'
			}
		}
	},
	plugins: []
};

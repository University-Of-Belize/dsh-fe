/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: { // Reference
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					950: '#172554'
				},
				COLORLIGHT: {
					15: '#e2dfff',
					25: '#e0dfff',
					50: '#dfe0ff',
					75: '#dfe3ff',
					100: 'rgb(var(--COLORLIGHT) / var(--tw-bg-opacity))'
				},
				COLORDARK: {
					15: '#60acc0',
					25: '#4d8a9a',
					50: '#3a6874',
					75: '#1c3238',
					100: 'rgb(var(--COLORDARK) / var(--tw-bg-opacity))'
				},

				COLORMAIN: 'rgb(var(--COLORMAIN) / var(--tw-bg-opacity))',
				COLORMAIN2: 'rgb(var(--COLORMAIN2) / var(--tw-bg-opacity))', // Tone 2

				COLORACCENTL: 'rgb(var(--COLORACCENTL) / var(--tw-bg-opacity))',
				COLORACCENTD: 'rgb(var(--COLORACCENTD) / var(--tw-bg-opacity))'
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('flowbite/plugin')]
};

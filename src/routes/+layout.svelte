<script lang="ts">
	import '../app.css';
	// For reading storage
	import { beforeNavigate, goto } from '$app/navigation';
	import { updated } from '$app/stores';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import 'node-localstorage/register';
	import { onMount } from 'svelte';
// Import the functions you need from the SDKs you need
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import ColorInput from '$lib/Elements/Inputs/TextInput.svelte';
	import config from '$lib/config/settings';
	import type { FirebaseMessage } from '$lib/types/Firebase';
	import { ThemeDefinition } from '$lib/types/ThemeDefinition';
	import { initializeApp } from '@firebase/app';
	import { getMessaging, onMessage } from '@firebase/messaging';
	import { faPaintbrush, faShare } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	let theme =
		localStorage['theme-map'] && localStorage['theme-map'] !== '{}'
			? JSON.parse(localStorage['theme-map'])
			: new ThemeDefinition(); // New theme or load saved theme in the event we're creating a theme
	let theme_ =
		localStorage['theme-map'] && localStorage['theme-map'] !== '{}'
			? JSON.parse(localStorage['theme-map'])
			: new ThemeDefinition(); // Template
	const hexToRGB = (hex: string) =>
		`${parseInt(hex.slice(1, 3), 16)} ${parseInt(hex.slice(3, 5), 16)} ${parseInt(
			hex.slice(5, 7),
			16
		)}`;
	const rgbToHEX = (rgb: string) =>
		'#' +
		rgb
			.split(' ')
			.map((x) => {
				const hex = parseInt(x).toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			})
			.join('');
	let keys = Object.keys(theme);
	let themeCodePanel: HTMLDivElement;
	// import { getAnalytics } from '@firebase/analytics';
	// const analytics = getAnalytics(app);
	let clocation: URL;
	let isNavigating: boolean = false;
	const options = {
		dismissable: true,
		pausable: true,
		theme: {
			'--toastBackground': 'rgb(var(--COLORBLK1))',
			'--toastColor': 'rgb(var(--COLORWHT))',
			'--toastBarBackground': 'rgb(var(--COLORGRN))'
		}
	};
	const options_firebase = {
		dismissable: true,
		theme: {
			'--toastBackground': 'rgb(var(--COLORBLK1))',
			'--toastColor': 'rgb(var(--COLORWHT)) ',
			'--toastBarBackground': '#ff7f4c' // Firebase color
		}
	};
	// Initialize Firebase
	const app = initializeApp(config.ui.firebase['config']);
	localStorage.setItem('fb_instance_id', JSON.stringify(app)); // Store the instance in storage so that the rest of the app can access it

	// Blocking function so that nothing else gets a chance to run
	function checkBlocked(write?: URL) {
		// Check if we're offline
		if (!navigator.onLine) {
			// Enable the error page
			localStorage.setItem('watchdog', 'true');
			// location.href = '/watchdog/error';
		}
		// Check for the server being offline
		if (localStorage.serverOffline) {
			// Set the technical reason for the error
			localStorage.setItem(
				'watchDogReason',
				'The server seems to be offline. Please try again later.'
			);
			// Enable the error page
			localStorage.setItem('watchdog', 'true');
			try {
				goto('/watchdog/error');
				window.history.replaceState(history.state, '', write?.pathname ?? '/');
			} catch (e) {
				console.warn("[WATCHDOG] Error: 'goto' failed! " + e.message);
				location.href = '/watchdog/error';
			}
		}
		// We're not going to be vicious ~~or anything~~ and everything, ~~but~~ and we're going to be a little bit mean.
		if (localStorage.blocked == 'true') {
			// Run blocked checks
			// Set blocked (again)
			localStorage.setItem('blocked', 'true');
			if (clocation.pathname !== '/auth/verify') {
				try {
					// Again (automatically)
					goto('/auth/verify');
					window.history.replaceState(history.state, '', write?.pathname ?? '/');
				} catch (e) {
					console.warn("[WATCHDOG] Error: 'goto' failed! " + e.message);
					// Redirect to blocked screen (manually)
					location.href = '/auth/verify';
				}
			}
		}
	}

	// Seamless updates
	// Function runs every time upon software-based navigational updates/changes
	beforeNavigate(async ({ willUnload, to }) => {
		clocation = new URL(to?.url.href ?? window.location.href); // New URL ahead
		// console.log(
		// 	// clocation,
		// 	to?.url.href,
		// 	window.location.href,
		// 	isNavigating
		// );
		// Run in automatic mode
		if (!localStorage.watchdog && !localStorage.enableDevMode) {
			// Run only once
			checkBlocked(clocation);
		} else {
			if (!localStorage.watchDogReason) {
				localStorage.removeItem('watchdog');
			}
			if (localStorage.watchdog && !isNavigating && clocation.pathname !== '/watchdog/error') {
				isNavigating = true;
				try {
					console.log('[LOAD]: Navigating to error page');
					setTimeout(async () => {
						let oldHistory = clocation;
						await goto('/watchdog/error', { replaceState: true });
						window.history.replaceState(history.state, '', oldHistory.pathname);
						// @ts-ignore
						oldHistory = undefined; // Free up memory
					}, 500);
				} catch (error) {
					console.log('[LOAD_ERR]: Navigating to error page');
					location.href = '/watchdog/error';
				}
				isNavigating = false;
			}
		}
		if ($updated && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
	// Function runs every time upon manual, traditional-based navigation
	onMount(async () => {
		if (!localStorage.theme) {
			if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
				toast.push(
					// "Your OS theme is set to light mode; but light mode isn't available yet, so we'll use dark mode instead.",
					'Your OS theme is set to light mode; activating an experimental theme.',
					{
						// Set the timeout to 5 seconds
						duration: 5000
					}
				);
			}
			localStorage.setItem('theme', 'light'); // Set to light

			setTimeout(() => {
				detectColorScheme();
			}, 800);
		} else {
			detectColorScheme();
		}
		// Set the theme
		// Set the location
		clocation = new URL(window.location.href);

		// ********* Firebase (run in browser--not server) ********* /

		const messaging = getMessaging(app);
		// getToken(messaging, {
		// 	vapidKey: config.ui.firebase['vapid-key'],
		// 	serviceWorkerRegistration: await navigator.serviceWorker.getRegistration()
		// });

		// Handle incoming messages. Called when:
		// - a message is received while the app has focus
		// - the user clicks on an app notification created by a service worker
		//   `messaging.onBackgroundMessage` handler.
		onMessage(messaging, (payload: FirebaseMessage) => {
			console.log('Message received. ', payload);
			// toast.push(
			// 	payload.notification?.body ?? 'You received a message, but the client does not support it.',
			// 	options_firebase
			// );
			// ...
		});

		/*******************************/

		// Check for service worker and register if needed
		if (!(await navigator.serviceWorker.getRegistration())) {
			await navigator.serviceWorker.register('/sw.js');
			// console.log(x); // Log out registration output
		}

		// Run in manual mode
		if (!localStorage.watchdog && !localStorage.enableDevMode) {
			// Run only once
			checkBlocked();
		} else {
			if (!localStorage.watchDogReason) {
				localStorage.removeItem('watchdog');
			}
			if (localStorage.watchdog && !isNavigating && clocation.pathname !== '/watchdog/error') {
				isNavigating = true;
				try {
					console.log('[MOUNT]: Navigating to error page');
					let oldHistory = clocation;
					await goto('/watchdog/error', { replaceState: true });
					window.history.replaceState(history.state, '', oldHistory.pathname);
					// @ts-ignore
					oldHistory = undefined; // Free up memory
				} catch (error) {
					console.log('[MOUNT_ERR]: Navigating to error page');
					location.href = '/watchdog/error';
				}
				isNavigating = false;
			}
		}

		// If we're in setup, we pull the user back to the setup screen
		if (localStorage.setup_inProgress) {
			// If we're not in the app and our setup is incomplete
			if (
				!window.matchMedia('(display-mode: standalone)').matches &&
				clocation.pathname !== '/watchdog/error'
			) {
				toast.push('You have an incomplete setup. Please open the app on your device.');
				setTimeout(() => {
					goto('/watchdog/error');
				}, 2000);
			}

			// Pull the user back into setup
			if (
				window.matchMedia('(display-mode: standalone)').matches &&
				clocation.pathname !== '/auth/create'
			) {
				toast.push('Thanks for completing setup. You can now register your account.');
				localStorage.clear();
				localStorage.setItem('eula', 'true');
				setTimeout(() => {
					goto('/auth/create');
				}, 2000);
			}
		}

		// Should just run once in manual mode since we don't want to pester users
		if (localStorage.token) {
			try {
				// Run login checks
				const res = (await fetchWebApi(
					'v1/dash',
					'GET',
					undefined,
					false,
					undefined,
					true
				)) as Response;
				if (!res) return;
				if (res.status === 403) {
					// We need this here as to not confuse the user
					localStorage.removeItem('token');
					localStorage.removeItem('user_id');
					localStorage.removeItem('user');
					toast.push('Your session is invalidated. Please sign in.', {
						dismissable: false,
						theme: {
							'--toastBarBackground': 'rgb(var(--COLORRED))'
						}
					});
					goto('/auth/login');
				}
			} catch (error) {
				console.log(error);
				toast.push(`Oops. Something unexpected happened: ${error.message}. Try logging in again.`);
			}
		}

		// Initialized!
		setTimeout(()=>{
			document.getElementById('splash-screen').classList.add('hidden'); // Hide splash
		}, 500); // Give the user a little while to adjust
            // Complies with "Splash screen guidelines":
            // https://developer.android.com/develop/ui/views/launch/splash-screen#splash-screen-animate-reqs
	});

	// ********* Color-scheming ********* /
	//determines if the user has a set theme
	function detectColorScheme() {
		let theme = localStorage.theme ?? 'light'; //default to light

		// //local storage is used to override OS theme settings
		// if (localStorage.getItem('theme')) {
		// 	if (localStorage.getItem('theme') === 'dark') {
		// 		theme = 'dark';
		// 	}
		// } else if (!window.matchMedia) {
		// 	//matchMedia method not supported
		// 	return false;
		// } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
		// 	//OS theme setting detected as dark
		// 	theme = 'dark';
		// }

		//dark theme preferred, set document with a `data-theme` attribute
		switch (theme) {
			case 'dark':
				document.documentElement.setAttribute('data-theme', 'dark');
				break;
			case 'light':
				document.documentElement.setAttribute('data-theme', 'light');
				break;
			case 'custom':
				// Get the CSS variables from localStorage
				document.documentElement.setAttribute('data-theme', 'custom');
				writeUITheme(theme_); // The constant theme-map
				break;
			default:
				document.documentElement.setAttribute('data-theme', localStorage.theme ?? 'dark');
		}
	}

	// UI Theme writer
	function writeUITheme(thememap?: object) {
		// console.log("[WRITE_STARTED]: Writing theme to document's CSS variables.");
		// Get the CSS variables from localStorage
		const cssVars = thememap ?? JSON.parse(localStorage.getItem('theme-map') ?? '{}');
		// Loop through the CSS variables and set the values
		for (const [key, value] of Object.entries(cssVars)) {
			// console.log(key, value); // Debug
			// Convert the value to a string if it's not already a string
			const stringValue = typeof value === 'string' ? value : String(value);
			document.documentElement.style.setProperty(`--${key}`, stringValue);
		}
	}
</script>

<SvelteToast {options} />
<main id="main" class="flex">
	<div class="block w-full">
		<slot />
	</div>
	{#if localStorage.theme === 'custom'}
		<div
			class="drawer z-50 h-screen w-1/4 flex-col justify-start overflow-auto bg-COLORBLK bg-opacity-100 px-8 py-2 text-COLORWHT"
		>
			<div class="two space-y-2 py-6">
				<div class="title block pb-5 font-semibold">
					<div class="title flex items-center justify-start space-x-4">
						<div class="icon">
							<Fa icon={faPaintbrush} size="1.15x" />
						</div>
						<div>Theme Creator (Experimental)</div>
					</div>
					<div class="py-2 text-xs font-light">
						Change CSS variables to appropriate values by clicking on the color blocks; then hit <b
							>'Apply style'</b
						> to see changes. Scroll down to see more colors available to change.
					</div>
				</div>
				<div class="theme-input">
					{#each keys as key (key)}
						<div class="inputfield text-field mt-2 block">
							<div class="label text-md text-COLORWHT">{key}</div>
							<ColorInput
								icon={{
									prefix: 'fas',
									iconName: 'gear-code',
									icon: [
										512,
										512,
										[],
										'', // Custom icon (lol) -- gear-code
										'M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zm-208.2-3.9c1.5-8.7-4.4-17-13.2-18.4s-17 4.4-18.4 13.2l-32 192c-1.5 8.7 4.4 17 13.2 18.4s17-4.4 18.4-13.2l32-192zM187.3 227.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-40 40c-6.2 6.2-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L158.6 256l28.7-28.7zm160-22.6c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L353.4 256l-28.7 28.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l40-40c6.2-6.2 6.2-16.4 0-22.6l-40-40z'
									]
								}}
								name={key}
								type="color"
								placeholder={key}
								value={rgbToHEX(theme_[key])}
								on:input={async (e) => {
									theme[key] = hexToRGB(e.detail);
									localStorage.setItem('theme-map', JSON.stringify(theme));
									writeUITheme(theme);
								}}
							/>
						</div>
					{/each}
					<div class="controls my-8">
						<div
							class="submit mt-8"
							on:click={async () => {
								writeUITheme(theme);
							}}
						>
							<Button
								custom_icon="/icons/font-awesome/eye-dropper-half.svg"
								color="COLORBLK3"
								text="Apply style"
								color_t="COLORWHT"
								custom_style="w-full"
							/>
						</div>
						<div
							class="reset mt-8"
							on:click={async () => {
								// localStorage.removeItem('theme-map');
								document.documentElement.style = '';
							}}
						>
							<Button
								custom_icon="/icons/font-awesome/paintbrush.svg"
								color="COLORBLK3"
								text="Reset style"
								color_t="COLORWHT"
								custom_style="w-full"
							/>
						</div>
						<div
							class="export mt-8"
							on:click={async () => {
								if (document.documentElement.style.cssText.trim() === '') {
									toast.push('You need to apply the style first.', {
										// Set the timeout to 5 seconds
										duration: 5000
									});
									return;
								}
								themeCodePanel.innerText = document.documentElement.style.cssText.replace(
									/;/g,
									';\n'
								);
							}}
						>
							<Button
								icon={faShare}
								color="COLORBLK3"
								text="Export style"
								color_t="COLORWHT"
								custom_style="w-full"
							/>
						</div>

						<div class="text-md mt-8 block rounded-sm bg-COLORBLK2 px-4 py-6 text-COLORWHT">
							<div class="text-COLORWHT2">Code Panel</div>
							<div
								class="code mt-2"
								bind:this={themeCodePanel}
								on:click={async () => {
									try {
										await navigator.clipboard.writeText(themeCodePanel.innerText);
										const range = document.createRange();
										range.selectNodeContents(themeCodePanel);
										const selection = window.getSelection();
										selection.removeAllRanges();
										selection.addRange(range);
										toast.push('Copied to clipboard');
									} catch (err) {
										console.error('Failed to copy text: ', err);
									}
								}}
							>
								Hitting 'Export' while the theme is enabled should populate this area.
							</div>
						</div>
						<div class="inputfield text-field mt-2 block">
							<div class="label text-md text-COLORWHT">Import theme</div>
							<ColorInput
								icon={{
									prefix: 'fas',
									iconName: 'gear-code',
									icon: [
										512,
										512,
										[],
										'', // Custom icon (lol) -- gear-code
										'M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zm-208.2-3.9c1.5-8.7-4.4-17-13.2-18.4s-17 4.4-18.4 13.2l-32 192c-1.5 8.7 4.4 17 13.2 18.4s17-4.4 18.4-13.2l32-192zM187.3 227.3c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-40 40c-6.2 6.2-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L158.6 256l28.7-28.7zm160-22.6c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L353.4 256l-28.7 28.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l40-40c6.2-6.2 6.2-16.4 0-22.6l-40-40z'
									]
								}}
								name="import-theme"
								type="text"
								placeholder="Paste code here to edit."
								on:input={async (e) => {
									const cssString = e.detail;
									const matches = cssString.match(/--(\w+):\s(\d+\s\d+\s\d+);/g);
									const themeDefinition = {};
									// @ts-ignore
									matches.forEach((match) => {
										const [property, value] = match.split(': '); // @ts-ignore
										themeDefinition[property.slice(2)] = value.slice(0, -1); // Remove the leading '--' from the property and the trailing ';' from the value
									});

									[theme, theme_] = [themeDefinition, themeDefinition];
									document.documentElement.style = cssString;
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	:global(body) {
		/* background: #f0ede6; */
		/* background: #202124 */
		/* background: #d5d6dc */
		background: linear-gradient(240deg, rgb(var(--COLORBLK)), rgb(var(--COLORBLK-TONE2)));
	}
</style>

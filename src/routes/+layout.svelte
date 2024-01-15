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
	import config from '$lib/config/settings';
	import type { FirebaseMessage } from '$lib/types/Firebase';
	import { initializeApp } from '@firebase/app';
	import { getMessaging, onMessage } from '@firebase/messaging';
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
		// Set the theme
		detectColorScheme();
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
				clocation.pathname !== '/auth/register'
			) {
				toast.push('Thanks for completing setup. You can now register your account.');
				localStorage.clear();
				localStorage.setItem('eula', 'true');
				setTimeout(() => {
					goto('/auth/register');
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
	});

	// ********* Color-scheming ********* /
	//determines if the user has a set theme
	function detectColorScheme() {
		let theme = 'light'; //default to light

		//local storage is used to override OS theme settings
		if (localStorage.getItem('theme')) {
			if (localStorage.getItem('theme') === 'dark') {
				theme = 'dark';
			}
		} else if (!window.matchMedia) {
			//matchMedia method not supported
			return false;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			//OS theme setting detected as dark
			theme = 'dark';
		}

		//dark theme preferred, set document with a `data-theme` attribute
		if (theme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark');
		}
	}
</script>

<SvelteToast {options} />
<slot />

<style>
	:global(body) {
		/* background: #f0ede6; */
		/* background: #202124 */
		/* background: #d5d6dc */
		background: rgb(var(--COLORBLK));
	}
</style>

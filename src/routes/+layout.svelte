<script>
	import '../app.css';
	// For reading storage
	import { goto } from '$app/navigation';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import 'node-localstorage/register';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/stores';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	const options = {
		dismissable: true,
		theme: {
			'--toastBackground': '#f0ede6',
			'--toastColor': '#2a1a1f',
			'--toastBarBackground': '#70a4ff'
		}
	};

	// Blocking function so that nothing else gets a chance to run
	function checkBlocked() {
		// Check if we're offline
		if (!navigator.onLine) {
			location.href = '/watchdog/error';
		}
		// We're not going to be vicious ~~or anything~~ and everything, ~~but~~ and we're going to be a little bit mean.
		if (localStorage.blocked == 'true') {
			// Run blocked checks
			// Set blocked (again)
			localStorage.setItem('blocked', 'true');
			// Redirect to blocked screen (manually)
			location.href = '/auth/verify';
			// Again (automatically)
			goto('/auth/verify');
		}
		setTimeout(() => {
			localStorage.setItem('watchdog', 'true');
		}, Math.random() * 100);
	}

	// Seamless updates
	// Function runs every time upon software-based navigational updates/changes
	beforeNavigate(({ willUnload, to }) => {
		// Run in automatic mode
		if (!localStorage.watchdog && !localStorage.enableDevMode) {
			// Run only once
			checkBlocked();
		} else {
			setTimeout(() => {
				localStorage.setItem('watchdog', 'true');
			}, Math.random() * 100);
		}
		if ($updated && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
	// Function runs every time upon manual, traditional-based navigation
	onMount(async () => {
		// Run in manual mode
		if (!localStorage.watchdog && !localStorage.enableDevMode) {
			// Run only once
			checkBlocked();
		} else {
			localStorage.removeItem('watchdog');
		}

		// Should just run once in manual mode since we don't want to pester users
		if (localStorage.token) {
			try {
				// Run login checks
				const res = await fetchWebApi('v1/dash', 'GET');
				if (res.status === 403) {
					localStorage.removeItem('token');
					localStorage.removeItem('user_id');
					localStorage.removeItem('user');
					toast.push('Your session is invalidated. Please sign in.');
					goto('/auth/login');
				}
			} catch (error) {
				console.log(error);
				toast.push(`Oops. Something unexpected happened: ${error.message}. Try logging in again.`);
			}
		}
	});
</script>

<SvelteToast {options} />
<slot />

<style>
	:global(body) {
		background: #f0ede6;
	}
</style>

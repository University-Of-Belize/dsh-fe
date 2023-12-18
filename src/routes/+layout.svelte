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

	// Seamless updates
	beforeNavigate(({ willUnload, to }) => {
		if ($updated && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
	onMount(async () => {
		// We're not going to be vicious or anything, but we're going to be a little bit mean.
		if (localStorage.blocked == 'true') {
			// Run blocked checks
			// localStorage.setItem('blocked', 'true');
			goto('/auth/verify');
		}

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

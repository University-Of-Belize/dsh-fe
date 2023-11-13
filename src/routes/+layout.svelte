<script>
	import '../app.css';
	// For reading storage
	import 'node-localstorage/register';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import config from '$lib/config/settings.json';
	const options = {
		dismissable: true,
		theme: {
			'--toastBackground': '#efebde',
			'--toastColor': '#2a1a1f',
			'--toastBarBackground': '#70a4ff'
		}
	};

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
				const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/dash`, {
					headers: {
						Authorization: `Bearer ${localStorage.token}`
					}
				});
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
		background: #efebde;
	}
</style>

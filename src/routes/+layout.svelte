<script>
	import '../app.css';
	// For reading storage
	import 'node-localstorage/register';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	const options = {
		dismissable: true,
		theme: {
			'--toastBackground': '#efebde',
			'--toastColor': '#2a1a1f',
			'--toastBarBackground': '#70a4ff'
		}
	};

	onMount(() => {  // We're not going to be vicious or anything, but we're going to be a little bit mean.
		if (localStorage.blocked == 'true') {
			// localStorage.setItem('blocked', 'true');
			goto('/auth/verify');
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

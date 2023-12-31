<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// call this function when you want to redirect
	function redirectToLogin() {
		goto('/auth/login');
	}
	onMount(() => redirectToLogin());
</script>

<svelte:head>
	<title>Plattr | Login / Register</title>
</svelte:head>
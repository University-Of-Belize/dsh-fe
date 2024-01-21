<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// call this function when you want to redirect
	function redirectToRegister() {
		goto('/auth/register');
	}
	onMount(() => redirectToRegister());
</script>

<svelte:head>
	<title>RapidEats | Login / Register</title>
</svelte:head>

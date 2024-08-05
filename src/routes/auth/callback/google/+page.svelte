<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	const account_token: string = $page.data.props.token;

	onMount(async () => {
		console.log(account_token);
        localStorage.setItem('token', account_token);
        
        // Redirect to the auth page for further setup
        window.location.href = '/auth';
	});
</script>


<div class="text-2xl font-semibold m-4">Redirecting you to automatic setup...</div>
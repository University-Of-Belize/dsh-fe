<script lang="ts">
	import { page } from '$app/stores';
	import { type SignInData } from '$lib/types/GoogleAuth';
	import { onMount } from 'svelte';
	const account_data: SignInData = $page.data.props;

	onMount(async () => {
		console.log(account_data);
		localStorage.setItem('token', account_data.token);
		localStorage.setItem('staff', JSON.stringify(account_data.staff));

		// Redirect to the auth page for further setup
		window.location.href = '/auth';
	});
</script>

<div class="m-4 text-2xl font-semibold text-COLORLIGHT-100">Redirecting you to automatic setup...</div>

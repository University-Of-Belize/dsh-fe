<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import { type SignInData, type SignInError } from '$lib/types/OpenAuth';
	import { onMount } from 'svelte';
	const account_data: SignInData | SignInError = $page.data as unknown as SignInData | SignInError;
	let is_error = 'error' in account_data;
	// Check if the account is an empty object
	let does_not_exist = Object.keys(account_data).length === 0;

	onMount(async () => {
		console.log($page, account_data);

		if (does_not_exist) {
			return;
		}
		if ('error' in account_data) {
			console.error(account_data);
			return;
		}

		localStorage.setItem('token', account_data.token);
		localStorage.setItem('staff', JSON.stringify(account_data.staff));

		// Redirect to the auth page for further setup
		window.location.href = '/auth';
	});
</script>

<main class="m-4 space-y-2">
	{#if !is_error && !does_not_exist}
		<div class="text-2xl font-semibold text-COLORLIGHT-100">
			Redirecting you to the authorized application...
		</div>
	{/if}

	{#if does_not_exist}
		<div class="text-2xl font-semibold text-COLORLIGHT-100">
			Your account does not exist. Please sign up first.
		</div>
		<!-- Button saying "Try again" -->
		<Button
			text="Sign up"
			on:click={() => {
				localStorage.setItem('eula', 'true');
				setTimeout(() => {
					window.location.href = '/auth/create';
				}, 2000);
			}}
		/>
	{/if}
	{#if is_error}
		<div class="text-2xl font-semibold text-COLORLIGHT-100">
			We couldn't sign you in. Please try again later.
		</div>
		<!-- Button saying "Try again" -->
		<Button
			text="Try again"
			on:click={() => {
				if (document.referrer.includes('https://github.com/login/oauth/authorize')) {
					history.back();
					return;
				}
				window.location.href = '/auth';
			}}
		/>
	{/if}
</main>

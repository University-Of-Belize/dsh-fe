<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import config from '$lib/config/settings';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faKey,
		faRightToBracket
		// faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let debounceTimeout: number;
	let logging_in: boolean = false;
	$: SecToken = $page.url.searchParams.get('token') || null;

	onMount(() => {
		if (location.hash != '') {
			SecToken = location.hash.substring(1, location.hash.length);
			Login([SecToken]);
		} else if (SecToken != null) {
			Login([SecToken]);
		}
		// token exists, do something
		if (SecToken == null && localStorage.dev != undefined) {
			toast.push('Entering an invalid token will result in an error.');
		}
	});

	async function Login(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const r = (await fetchWebApi(
				'v1/dash',
				'GET',
				undefined,
				undefined,
				payload[0],
				true
			)) as Response;
			if (!r.ok) {
				setTimeout(() => {
					logging_in = false; // Slight "bounce"
				}, 450);
				return toast.push('That token was not valid.', {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				});
			}
			toast.push('Redirecting you to the authentication provider to finish setup.');
			localStorage.clear(); // Clear the storage
			localStorage.setItem('token', payload[0]); // Set the token
			// Enable dev mode
			localStorage.setItem('enableDevMode', 'true');
			setTimeout(() => {
				goto('/auth/login'); // Redirect to the login page to download the current user state.
			}, 2000);
		}, 500); // bounce every 500ms - let's hope they don't try to fucking spam the API
	}

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		if (valueArray[0].trim() != '') {
			logging_in = true;
			Login(valueArray);
		}
	};
</script>

<svelte:head>
	<title>UniFood | Login using a magic link</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex h-full items-center justify-center py-8 lg:mx-8">
		{#if SecToken == null && localStorage.dev != undefined}
			<div class="auth_window block rounded-md bg-COLORBLK1 pt-8 lg:px-6">
				<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
					<div
						class="mx-8 mb-6 flex flex-1 items-center justify-center text-3xl font-semibold text-COLORWHT"
					>
						{config.ui['branding-text']}
						<span class="mb-4 ml-2 bg-yellow-300 px-2 py-1 text-sm text-gray-50">DEV</span>
					</div>

					<div
						class="password mx-8 mt-2 flex flex-1 items-center rounded-sm border border-COLORWHT bg-transparent px-4 py-2 text-sm"
					>
						<div class="icon w-fit">
							<Fa icon={faKey} size="1.25x" class="pr-4 text-COLORWHT" />
						</div>
						<input
							type="text"
							autocomplete="off"
							name="token"
							class="w-full border-0 bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none"
							placeholder="Enter a valid user token"
						/>
					</div>

					<div class="submit mx-8 mt-6 flex flex-1 items-center justify-center">
						<button
							class="submit w-full"
							type="submit"
							disabled={logging_in}
							title={logging_in ? 'Please wait for the request to complete' : ''}
						>
							<Button
								icon={faRightToBracket}
								color="COLORWHT"
								color_t="COLORBLK"
								custom_style="w-full justify-center"
								text="Log in"
								disabled={logging_in}
							/>
						</button>
					</div>
				</form>

				<div class="mx-8 my-8 block text-COLORWHT">
					<div class="text-2xl font-light">Have an account?</div>
					<div
						class="login mt-6 flex flex-1 items-center justify-start"
						on:click={() => goto('/auth/login')}
					>
						<Button
							icon={faRightToBracket}
							color="COLORYLW"
							color_t="COLORBLK"
							custom_style="w-18 justify-center"
							text="Log in"
						/>
					</div>
				</div>
			</div>
		{:else if SecToken != null}
			<div class="rounded-xl border-gray-200 lg:border lg:bg-COLORBLK1 lg:shadow-sm">
				<div class="p-4 sm:p-7">
					<div class="text-center">
						<div class="mb-4 inline-block rounded-full bg-COLORGRY p-2 text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
								/>
							</svg>
						</div>
						<h1 class="block text-2xl font-bold text-COLORWHT">Signing you in...</h1>
						<p class="mt-2 text-sm text-COLORWHT1">You'll be logged-in in just a moment.</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="rounded-xl border-gray-200 lg:border lg:bg-COLORBLK1 lg:shadow-sm">
				<div class="p-4 sm:p-7">
					<div class="text-center">
						<div class="mb-4 inline-block rounded-full bg-COLORGRY p-2 text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
								/>
							</svg>
						</div>
						<h1 class="block text-2xl font-bold text-COLORWHT">Signing you in...</h1>
						<p class="mt-2 text-sm text-rose-600">
							The link you followed does not work anymore.<br />You may need to request a magic link
							again.
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

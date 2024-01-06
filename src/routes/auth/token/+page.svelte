<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faKey,
		faRightToBracket
		// faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	$: continue_url = $page.url.searchParams.get('continue');
	let debounceTimeout: number;
	let logging_in: boolean = false;

	onMount(() => {
		// token exists, do something
		toast.push('Entering an invalid token will result in an error.');
	});

	async function Login(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const r = (await fetchWebApi('v1/dash', 'GET', undefined, undefined, payload[0])) as Response;
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
	<title>Plattr | Login using a security token</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content mx-8 flex h-full items-center justify-center py-8">
		<div class="block">
			<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
				<div
					class="mx-8 mb-6 flex flex-1 items-center justify-center text-3xl font-semibold text-COLORWHT"
				>
					Cafe
				</div>

				<div
					class="password mx-8 mt-2 flex flex-1 items-center rounded-sm border border-COLORWHT bg-transparent px-4 py-2 text-sm"
				>
					<div class="icon w-fit">
						<Fa icon={faKey} size="1.25x" class="pr-4 text-COLORWHT" />
					</div>
					<input
						type="text"
						name="token"
						class="w-full bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none"
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
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

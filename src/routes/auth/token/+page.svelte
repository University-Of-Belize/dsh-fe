<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faGift,
		faKey,
		faLock,
		faRectangleAd,
		faRightToBracket
		// faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	$: continue_url = $page.url.searchParams.get('continue');
	let debounceTimeout: number;

	onMount(() => {
		// token exists, do something
		toast.push('Entering an invalid token will result in an error.');
	});

	async function Login(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const r = await fetchWebApi('v1/dash', 'GET', undefined, undefined, payload[0]);
			if (!r.ok) {
				return toast.push('That token was not valid.', {
					dismissable: false,
					theme: {
						'--toastBarBackground': '#842d69'
					}
				});
			}
			toast.push('Redirecting you to the authentication provider to finish setup.');
			localStorage.clear(); // Clear the storage
			localStorage.setItem('token', payload[0]); // Set the token
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
			Login(valueArray);
		}
	};
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content mx-8 py-8 flex items-center justify-center h-full">
		<div class="block">
			<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
				<div
					class="flex flex-1 mb-6 mx-8 text-COLORBLK font-semibold justify-center items-center text-3xl"
				>
					Cafe
				</div>

				<div
					class="password flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 mx-8 items-center text-sm border border-COLORBLK"
				>
					<div class="icon w-fit">
						<Fa icon={faKey} size="1.25x" class="text-COLORBLK pr-4" />
					</div>
					<input
						type="text"
						name="token"
						class="w-full font-medium focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Enter a valid user token"
					/>
				</div>

				<div class="submit flex flex-1 mx-8 mt-6 items-center justify-center">
					<button class="submit w-full" type="submit">
						<Button
							icon={faRightToBracket}
							color="COLORBLK"
							color_t="COLORWHT"
							custom_style="w-full justify-center"
							text="Log in"
						/>
					</button>
				</div>
			</form>

			<div class="block mx-8 my-8">
				<div class="text-2xl font-light">New around here?</div>
				<div
					class="signup flex flex-1 mt-6 items-center justify-start"
					on:click={() => goto('/auth/register')}
				>
					<Button
						icon={faGift}
						color="COLORPNK"
						text="Sign up"
						color_t="COLORWHT"
						custom_style="w-18 justify-center"
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

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faBuildingLock,
		faEnvelopeCircleCheck,
		faRightToBracket,
		faKey,
		faUserLock,
		faWarning
		// faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import Fa from 'svelte-fa';
	let debounceTimeout: number;
	let logging_in: boolean = false;
	const ResetToken = $page.url.searchParams.get('reset_token') || false;

	async function Reset(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const r = (await fetchWebApi(
				'v1/auth/passwordreset',
				ResetToken ? 'PATCH' : 'POST',
				what_is(what.public.auth, payload[0]),
				undefined,
				(ResetToken as string) ?? 'NO_TOKEN'
			)) as Response;
			if (!r.ok) {
				setTimeout(() => {
					logging_in = false; // Slight "bounce"
				}, 450);
				try {
					const res = await r.json();
					return toast.push(res.message, {
						dismissable: false,
						theme: {
							'--toastBarBackground': '#842d69'
						}
					});
				} catch {
					return toast.push(
						'Oops. Something hitched over on our side while requesting a password reset.<br/>Try that again one more time.',
						{
							dismissable: false,
							theme: {
								'--toastBarBackground': '#842d69'
							}
						}
					);
				}
			}
			toast.push(
				ResetToken
					? 'Your password has been reset. Redirecting you to the authentication provider.'
					: 'Reset requested.'
			);
			localStorage.clear(); // Clear the storage
			if (!ResetToken) {
				localStorage.setItem('reset', 'true');
			}
			setTimeout(() => {
				goto(ResetToken ? '/auth/login' : '/auth/verify'); // Redirect to the login page to download the current user state.
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
			Reset(valueArray);
		}
	};
</script>

<svelte:head>
	<title>Plattr | Password Reset</title>
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
						<Fa
							icon={ResetToken ? faUserLock : faBuildingLock}
							size="1.25x"
							class="pr-4 text-COLORWHT"
						/>
					</div>
					<input
						type="text"
						name="token"
						class="w-full bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none"
						placeholder={ResetToken ? 'Enter a new password' : 'Enter a registered username'}
					/>
				</div>
				{#if ResetToken}
					<div
						class="forgot-password-warning mx-8 flex w-fit space-x-2 pt-4 text-sm font-semibold text-COLORRED"
					>
						<div class="icon"><Fa icon={faWarning} /></div>
						<div>Note that doing this will also sign out all of your devices</div>
					</div>
				{/if}
				<div class="submit mx-8 mt-6 flex flex-1 items-center justify-center">
					<button class="submit w-full" type="submit" disabled={logging_in}>
						<Button
							icon={ResetToken ? faKey : faEnvelopeCircleCheck}
							color="COLORWHT"
							color_t="COLORBLK"
							custom_style="w-full justify-center"
							text={ResetToken ? 'Change your password' : 'Request a password reset'}
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

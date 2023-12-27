<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
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

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content mx-8 py-8 flex items-center justify-center h-full">
		<div class="block">
			<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
				<div
					class="flex flex-1 mb-6 mx-8 text-COLORWHT font-semibold justify-center items-center text-3xl"
				>
					Cafe
				</div>

				<div
					class="password flex-1 flex mt-2 rounded-sm bg-transparent px-4 py-2 mx-8 items-center text-sm border border-COLORWHT"
				>
					<div class="icon w-fit">
						<Fa
							icon={ResetToken ? faUserLock : faBuildingLock}
							size="1.25x"
							class="text-COLORWHT pr-4"
						/>
					</div>
					<input
						type="text"
						name="token"
						class="w-full font-medium focus:outline-none text-COLORWHT py-1 px-2 bg-transparent"
						placeholder={ResetToken ? 'Enter a new password' : 'Enter a registered username'}
					/>
				</div>
				{#if ResetToken}
					<div
						class="forgot-password-warning flex text-sm text-COLORRED font-semibold pt-4 space-x-2 w-fit mx-8"
					>
						<div class="icon"><Fa icon={faWarning} /></div>
						<div>Note that doing this will also sign out all of your devices</div>
					</div>
				{/if}
				<div class="submit flex flex-1 mx-8 mt-6 items-center justify-center">
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

			<div class="block mx-8 my-8 text-COLORWHT">
				<div class="text-2xl font-light">Have an account?</div>
				<div
					class="login flex flex-1 mt-6 items-center justify-start"
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

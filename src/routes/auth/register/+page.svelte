<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import config from '$lib/config/settings';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faGift,
		faLock,
		faRectangleAd,
		faRightToBracket,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let debounceTimeout: number;
	let signing_up: boolean = false;

	// Register the user
	async function Register(payload: string[]) {
		try {
			clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(async () => {
				const response = (await fetchWebApi(
					`v1/auth/signup`,
					'POST',
					what_is(what.public.auth, payload)
				)) as Response;
				if (!response.ok) {
					setTimeout(() => {
						signing_up = false; // Slight "bounce"
					}, 450);
					const json = await response.json();
					return toast.push(`${json.message}`, {
						dismissable: false,
						theme: {
							'--toastBarBackground': 'rgb(var(--COLORRED))'
						}
					});
				}
				const json = await response.json();
				toast.push(`${json.message}`);
				localStorage.setItem('email', payload[0]);
				localStorage.setItem('oops', 'true');
				goto('/auth/verify');
			}, 500); // debounce every 500ms
		} catch (error) {
			setTimeout(() => {
				signing_up = false; // Reenable after such time
			}, 3000);
			toast.push(
				`${error.message}: You have been temporarily blocked from our services. Do not persist. Try again later.`,
				{
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				}
			);
			console.log(error);
		}
	}

	// @ts-ignore
	const handleSubmit = (event) => {
		event.preventDefault();
		signing_up = true;
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		if (valueArray[valueArray.length - 1] === valueArray[valueArray.length - 2]) {
			[valueArray[0], valueArray[1]] = [valueArray[1], valueArray[0]];
			// Push the user's timezone (overwrites the last element "retypePassword")
			valueArray[valueArray.length - 1] = Intl.DateTimeFormat().resolvedOptions().timeZone;
			Register(valueArray);
		} else {
			setTimeout(() => {
				signing_up = false; // Slight "bounce"
			}, 450);
			toast.push("<b>Retype password</b> and <b>password</b> aren't the same", {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORRED))'
				}
			});
		}
	};

	// Check if user has agreed to the EULA first before signing-up
	// @todo Remove after stable release
	onMount(() => {
		if (localStorage.getItem('eula') !== 'true') {
			toast.push(
				'Please agree to the EULA first before signing up by clicking on your choice of platform and selecting "AGREE"',
				{
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				}
			);
			goto('/app/onboarding');
		}
	});
</script>

<svelte:head>
	<title>UniFood | Login / Register</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex h-full items-center justify-center py-8 lg:mx-8">
		<div class="auth_window block rounded-md bg-COLORBLK1 pt-8 lg:px-8">
			<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
				<div
					class="mb-6 flex flex-1 items-center justify-center text-3xl font-semibold text-COLORWHT"
				>
					{config.ui['branding-text']}
				</div>
				<div class="username flex flex-wrap items-start justify-start lg:items-center">
					<TextInput
						icon={faRectangleAd}
						name="username"
						placeholder="Type in a username"
						custom_style="bg-transparent"
						required
					/>
				</div>
				<div class="email flex flex-wrap items-start justify-start lg:items-center">
					<TextInput
						icon={faUserCog}
						type="email"
						name="email"
						placeholder="Type in your email address"
						custom_style="bg-transparent"
						required
					/>
				</div>
				<div class="password flex flex-wrap items-start justify-start lg:items-center">
					<TextInput
						icon={faLock}
						name="password"
						type="password"
						placeholder="Choose a password"
						custom_style="bg-transparent"
						required
					/>
				</div>
				<div class="password2 flex flex-wrap items-start justify-start lg:items-center">
					<TextInput
						icon={faLock}
						type="password"
						name="password2"
						placeholder="Retype this password"
						custom_style="bg-transparent"
						required
					/>
				</div>

				<div class="submit mt-6 flex flex-1 items-center justify-center">
					<button
						class="submit w-full"
						type="submit"
						title={signing_up ? 'Please wait for the request to complete...' : ''}
						disabled={signing_up}
					>
						<Button
							icon={faGift}
							color="COLORWHT"
							color_t="COLORBLK"
							custom_style="w-full justify-center"
							text="Sign Up"
							disabled={signing_up}
						/>
					</button>
				</div>
			</form>

			<div class="my-8 block text-COLORWHT">
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

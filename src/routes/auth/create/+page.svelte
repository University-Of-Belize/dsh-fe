<script lang="ts">
	import { goto } from '$app/navigation';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import config from '$lib/config/settings';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faLock, faRectangleAd, faUserCog } from '@fortawesome/free-solid-svg-icons';
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
					`auth/signup`,
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
							'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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
						'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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
					'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
				}
			});
		}
	};

	// Check if user has agreed to the EULA prior signing-up
	// @todo Remove after stable release
	onMount(() => {
		if (localStorage.getItem('eula') !== 'true') {
			toast.push(
				'Please agree to the EULA prior to signing up by clicking on your choice of platform and selecting "AGREE"',
				{
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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
	<div class="main-content flex h-full flex-wrap items-center justify-center text-COLORLIGHT-100">
		<div class="order-2 flex w-full flex-col md:w-1/2">
			<div
				class="mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0 lg:w-[28rem]"
			>
				<p class="text-left text-3xl font-bold">Create an account</p>
				<p class="mt-2 text-left text-COLORLIGHT-15">
					Let's do this. Together, we will create <span class="inline md:hidden"><br /></span
					>something amazing.
				</p>
				<!--
				<button
					class="-2 mt-8 flex items-center justify-center rounded-md border bg-COLORDARK-100 px-4 py-1 outline-none ring-gray-400 ring-offset-2 transition hover:border-COLORLIGHT-15 hover:bg-COLORDARK-50 hover:text-white focus:ring-2"
					><img class="mr-2 h-5" src="/icons/google-icon.svg" alt /> Log in with Google</button
				>
				<div class="relative mt-8 flex h-px place-items-center bg-COLORLIGHT-100">
					<div
						class="absolute left-1/2 h-6 w-14 -translate-x-1/2 bg-COLORLIGHT-100 text-center text-sm text-COLORLIGHT-100"
					>
						or
					</div>
				</div>
				--->
				<form
					class="flex flex-col pt-3 md:pt-8"
					action="#"
					on:submit={(event) => handleSubmit(event)}
				>
					<div class="flex flex-col pt-4">
						<div class="relative flex overflow-hidden transition">
							<TextInput
								icon={faRectangleAd}
								name="username"
								placeholder="Type in a username"
								custom_style="bg-transparent"
								required
							/>
						</div>
					</div>
					<div class="flex flex-col pt-4">
						<div class="relative flex overflow-hidden transition">
							<TextInput
								icon={faUserCog}
								type="email"
								name="email"
								placeholder="Type in your {config.server['bound-organization']} email address"
								custom_style="bg-transparent"
								required
							/>
						</div>
					</div>
					<div class="flex flex-col pt-4">
						<div class="relative flex overflow-hidden transition">
							<TextInput
								icon={faLock}
								type="password"
								name="password"
								placeholder="Choose a password"
								autocomplete="new-password"
								custom_style="bg-transparent"
								required
							/>
						</div>
					</div>
					<div class="mb-12 flex flex-col pt-4">
						<div class="relative flex overflow-hidden transition">
							<TextInput
								icon={faLock}
								type="password"
								name="password2"
								placeholder="Retype this password"
								autocomplete="new-password"
								custom_style="bg-transparent"
								required
							/>
						</div>
						<span
							class="mt-4 hidden flex-col border border-l border-COLORACCENTL bg-COLORDARK-75 px-4 py-2 md:flex"
							>Get early access to new features and the opportunity to share your valuable feedback.</span
						>
					</div>
					<button
						type="submit"
						title={signing_up ? 'Please wait for the request to complete' : ''}
						class="w-full rounded-lg bg-COLORACCENTL px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 disabled:opacity-50"
						disabled={signing_up}>Get started</button
					>
				</form>
				<div class="py-12 text-center">
					<p class="whitespace-nowrap text-gray-600">
						Already have an account?
						<a href="/auth/login" class="font-semibold text-COLORLIGHT-100 underline underline-offset-4"
							>Sign in</a
						>
					</p>
				</div>
			</div>
		</div>
		<div
			class="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2"
		>
			<div class="relative z-10 px-8 py-20 text-white opacity-100">
				<p class="text-3xl font-semibold leading-10">
					Thank you for being part of something exciting<br />and signing up as a beta tester.
				</p>
				<p class="mb-2 text-2xl font-semibold leading-10">
					"The only way to do great work is to love what you do."
				</p>
				<p class="mb-4 text-3xl font-semibold">Steve Jobs</p>
				<p class="">Businessman/Inventor/Investor</p>
				<p class="mb-7 text-sm opacity-70">Apple, Inc.</p>
			</div>
			<img
				alt
				loading="lazy"
				class="-z-1 absolute top-0 h-full w-full object-cover opacity-50"
				src="/assets/auth/signup-static.jpg"
			/>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

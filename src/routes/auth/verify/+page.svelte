<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import EscrowBanner from '$lib/Elements/Generic/EscrowBanner.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	import config from '$lib/config/settings';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	const VerifyToken = $page.url.searchParams.get('activation_token') || false;
	const InstallToken = $page.url.searchParams.get('jo') || false;
	let installPrompt;
	let smartButton: HTMLDivElement;
	let search = false;
	let state = -1; // What is this?
	$: buttonText = '';
	$: branding_text = 'One second...';
	$: text = '';
	$: subtitle = '';

	onMount(async () => {
		// Determine the state
		if (VerifyToken) {
			// Wants activation
			smartButton.style.display = 'none';
			await RunActivation();
			state = 0;
		} else if (localStorage.getItem('oops') === 'true') {
			branding_text = 'Verify Your Account';
			text = 'Check your email for a link to verify your account.';
			subtitle = 'Until then, you have been blocked from using our services.';
			buttonText = 'Resend Verification';
			state = 1;
		} else if (localStorage.getItem('blocked') === 'true') {
			branding_text = 'Blocked';
			text = "Sorry, you've been blocked from using our services.";
			subtitle = 'Contact a cafe staff member for assistance';
			buttonText = 'Leave a message'; // Strip the identity of the user
			localStorage.removeItem('user_id');
			localStorage.removeItem('token');
			state = 2;
		} else if (localStorage.getItem('reset') === 'true') {
			branding_text = 'Reset your password';
			text = 'Check your email for a link to reset your password.';
			subtitle = 'Check your inbox for further instructions';
			buttonText = 'Open Gmail';
			state = 3;
		} else if ((InstallToken as string) === 'shwanesgae') {
			// @ts-ignore
			installPrompt = window.installPrompt;
			if (!installPrompt) {
				branding_text = 'The app is already installed';
				text = 'You already have the app installed. No need to reinstall again.';
				subtitle = 'Redirecting you back to the home page.';
				buttonText = '';
				smartButton.style.display = 'none';
				toast.push('Redirecting you to the home page');
				setTimeout(() => {
					goto('/');
				}, 6000);
				return;
			}
			branding_text = 'Installing...';
			text = 'Please, wait.';
			subtitle = 'You can click the button to proceed.';
			buttonText = 'Install Application';
			state = 4;
		} else {
			branding_text = "You don't belong here! ⚠️";
			text = 'One moment...';
			subtitle = 'You will be redirected to the home page.';
			buttonText = '';
			smartButton.style.display = 'none';
			setTimeout(() => {
				goto('/');
			}, 2000);
		}
	});

	// SmartAction based on the "state"
	async function smartAction() {
		switch (state) {
			case 0:
				break;
			case 1:
				toast.push('Resent verification email.');
				postData([localStorage.getItem('email'), null], 'login');
				break;
			case 2:
				window.open(
					`https://mail.google.com/mail/u/?authuser=${localStorage.getItem(
						'email'
					)}&view=cm&fs=1&to=${config['server']['support-email']}&su=${localStorage.getItem(
						'email'
					)} — Unblock Request&body=${localStorage.getItem(
						'email'
					)}%20would%20like%20to%20request%20an%20unblock%20from%20the%20service.%0A%0AWrite%20your%20comment%20below%20this%20line%20as%20to%20why%20you%20deserve%20to%20be%20unblocked.%0AWord%20of%20advice%3A%20You%27re%20likely%20to%20receive%20a%20better%20and%20faster%20response%20by%20giving%20a%20good%20reason%20below%20this%20line.%0A------%0A%0A%0A`,
					'_blank'
				);
				break;
			case 3:
				window.open('https://mail.google.com');
				break;
			case 4:
				toast.push('Open the app after installation is complete.');
				// Block the user from doing anything much
				localStorage.watchdog = 'true';
				localStorage.customReason = 'true';
				localStorage.watchDogReason = 'To continue setup, open the app on your device.';
				localStorage.setup_inProgress = "true";
				await installPrompt.prompt().then((choiceResult: any) => {
					if (choiceResult.outcome === 'accepted') {
						console.log('User accepted the install prompt');
						toast.push('You can now register your account.');
						setTimeout(() => {
							goto('/auth/register');
						}, 2000);
					} else {
						toast.push("You've dismissed the install prompt.", {
							theme: {
								'--toastBarBackground': '#842d69'
							}
						});
						console.log('User dismissed the install prompt');
					}
				});
				break;
		}
	}
	async function postData(data: any, path: string, token?: string) {
		try {
			const response = (await fetchWebApi(
				`v1/auth/${path}`,
				'POST',
				what_is(what.public.auth, data),
				undefined,
				token
			)) as Response;
			if (!response.ok) {
				const json = await response.json();
				text = 'Something hitched over on our side. You should try that again one more time.';
				return toast.push(`${json.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': '#842d69'
					}
				});
			}
			text = 'All good to go!';
			const json = await response.json();
			toast.push(`${json.message ?? 'All good to go!'}`);
		} catch (error) {
			text = 'There was an error.';
			toast.push(`${error.message}. Try again later.`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': '#842d69'
				}
			});
			console.log(error);
		}
	}
	async function RunActivation() {
		branding_text = 'Trying to activate your account';
		text = 'Please, wait.';
		postData(undefined, 'verify', VerifyToken || '');
		search = true;
		branding_text = 'Thanks';
		text = "You've verified your identity";
		subtitle = 'You will be redirected to the authentication provider shortly.';
		setTimeout(() => {
			goto('/auth/login');
		}, 5000);
	}
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex items-center justify-center h-full">
		<EscrowBanner {branding_text} {text} {subtitle}>
			<div class="flex justify-center items-center w-full pt-8 pb-4">
				{#if search}
					<SearchBar />
				{:else}
					<div
						class="reactive_wrapper w-fit h-fit"
						on:click={() => smartAction()}
						bind:this={smartButton}
					>
						<Button
							icon={undefined}
							color="COLORWHT1"
							color_t="COLORWHT"
							custom_style="justify-center"
							text={buttonText}
						/>
					</div>{/if}
			</div>
		</EscrowBanner>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

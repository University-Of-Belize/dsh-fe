<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import EscrowBanner from '$lib/Elements/Banners/EscrowBanner.svelte';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
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
			// branding_text = 'Verify Your Account';
			// text = 'Check your email for a link to verify your account.';
			// subtitle = 'Until then, you have been blocked from using our services.';
			// buttonText = 'Resend Verification';
			// state = 1;
			// @remind Change this crap back to the original state after signups are unblocked
			branding_text = 'Thanks For Your Interest!';
			text = 'Your spot has been reserved!';
			subtitle = 'Check your email for a link to verify your account when school opens!';
			buttonText = '';
			smartButton.style.display = 'none';
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
				let device = navigator.platform;
				const UAData = navigator.userAgentData;
				if (!device) {
					if (UAData) device = UAData.platform;
					else device = 'Unknown';
				}

				// Normalize the device
				device = device.toLowerCase();
				if (device.includes('win') || device.includes('pocket')) device = 'windows';
				else if (device.includes('mac')) device = 'macos';
				else if (device.includes('linux')) device = 'linux';
				else if (device.includes('android')) device = 'android';
				else if (
					device.includes('iphone') ||
					device.includes('ipod') ||
					device.includes('ipad') ||
					device.includes('pike')
				)
					device = 'ios';
				else device = 'unknown';

				if (device === 'windows' || device === 'linux' || device === 'android') {
					branding_text = 'The app is already installed';
					text = 'You already have the app installed. No need to reinstall again.';
					subtitle = 'Redirecting you back to the home page.';
					buttonText = '';
					smartButton.style.display = 'none';
					toast.push('Redirecting you to the home page');
					setTimeout(() => {
						goto('/');
					}, 6000);
				} else {
					branding_text = 'Add to the home screen';
					text =
					'Add to the home screen and then relaunch the app an try to sign up.';
					subtitle = 'If you have any issues, please contact us.';
					buttonText = '';
					smartButton.style.display = 'none';
				}
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
					)}&view=cm&fs=1&to=${$page.data.support_email}&su=${localStorage.getItem(
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
				localStorage.watchDogReason = `<span>Setup incomplete. To continue setup, open the app on your device.<br/>Alternatively, <a style="text-decoration: underline; font-weight: bold;" href="javascript:(function(){ localStorage.removeItem('watchDogReason'); localStorage.removeItem('setup_inProgress'); localStorage.removeItem('customReason'); localStorage.removeItem('watchdog'); setTimeout(()=>{window.location.href = '/auth/create';}, 2000);})();">cancel setup.</a></span>`;
				localStorage.setup_inProgress = 'true';
				await installPrompt.prompt().then((choiceResult: any) => {
					if (choiceResult.outcome === 'accepted') {
						console.log('User accepted the install prompt');
						toast.push('You can now register your account.');
						setTimeout(() => {
							goto('/auth/create');
						}, 2000);
					} else {
						toast.push("You've dismissed the install prompt.", {
							theme: {
								'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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
				`auth/${path}`,
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
						'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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
					'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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

<svelte:head>
	<title>UniFood | Verify your identity</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex h-full items-center justify-center">
		<EscrowBanner {branding_text} {text} {subtitle}>
			<div class="flex w-full items-center justify-center pb-4 pt-8">
				{#if search}
					<SearchBar />
				{:else}
					<div
						class="reactive_wrapper h-fit w-fit"
						on:click={() => smartAction()}
						bind:this={smartButton}
					>
						<Button
							icon={undefined}
							color="COLORDARK-50"
							color_t="COLORLIGHT-100"
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

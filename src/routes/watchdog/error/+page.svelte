<script lang="ts">
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import EscrowBanner from '$lib/Elements/Generic/EscrowBanner.svelte';
	import { onMount } from 'svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';
	let text: string, branding_text: string, subtitle: string, status_text: number;
	let onlinePoller: number;
	let statusTextDecrementer: number;
	let notFound: boolean = false;
	let offLine: boolean = false;
	status_text = 10; // Start at 10

	onMount(async () => {
		if (localStorage.watchdog) {
			toast.push(
				'You have been disconnected from the server. Please wait while we try to reconnect you.'
			);

			// Poll the server and check to see if the API is online/working
			onlinePoller = setInterval(async () => {
				status_text = 11; // Start again
				localStorage.removeItem('serverOffline');
				const isOnline = (await fetchWebApi(
					'v1/dash',
					'GET',
					undefined,
					undefined,
					undefined,
					true
				)) as Response;
				if (isOnline) {
					localStorage.removeItem('watchdog');
					localStorage.removeItem('watchDogReason');
					toast.push('Back online! 🎉');
					await goto(window.location.href ?? '/');
					clearInterval(onlinePoller); // Remove this shizz (lol)
					clearInterval(statusTextDecrementer); // Remove this shizz too!! (lollol)
				} else {
					localStorage.setItem('serverOffline', 'true');
				}
			}, 10000); // 10s
			statusTextDecrementer = setInterval(async () => {
				status_text -= 1;
			}, 1000); // 1s
		} else {
			location.href = '/';
		}
		if (localStorage.status === 404) {
			text = "Sorry, looks like we couldn't find that one 😅";
			notFound = true;
		} else {
			text = 'Whoops, looks like we messed up 😅';
		}
		if (navigator.onLine) {
			subtitle =
				localStorage.watchDogReason ??
				`Technical details: HTTP_${localStorage.status} ${
					localStorage.error
						? JSON.parse(localStorage.error).message
						: 'Could not connect. Please try again'
				}`;
		} else {
			offLine = true;
			// Looks like you're not connected to the server and you're
			// not connected to the server yet and you should disconnect
			// from the server and try again later
			branding_text = '🔗💔';
			text = "Looks like you're not connected.";
			subtitle = "You've been disconnected from the server. Try again later! 😭";
		}
	});
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex items-center justify-center h-full">
		<EscrowBanner
			branding_text={branding_text ?? "You've hit an error"}
			text={text ?? 'One moment while we fetch what went wrong'}
			subtitle={subtitle ??
				"Getting error details. If this doesn't change and you can still see this text, please get in touch with one of our team members."}
			><div class="flex justify-center items-center w-full pt-8 pb-4">
				{#if notFound}
					<SearchBar />
				{/if}
				<div class="block">
					{#if offLine}
						🌐 Functionality may be limited, or completely unavailable. 🦕
					{/if}

					<div class="font-light">
						Feel free to retry reloading at any time, or coming back later.
					</div>
					<div class="font-semibold">Retrying in: {status_text}</div>
				</div>
			</div></EscrowBanner
		>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

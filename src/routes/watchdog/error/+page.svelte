<script lang="ts">
	import { page } from '$app/stores';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import EscrowBanner from '$lib/Elements/Generic/EscrowBanner.svelte';
	import { onMount } from 'svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	let text: string, branding_text: string, subtitle: string;
	let notFound: boolean = false;
	let offLine: boolean = false;
	
	onMount(() => {
		if (localStorage.status === 404) {
			text = "Sorry, looks like we couldn't find that one 😅";
			notFound = true;
		} else {
			text = 'Whoops, looks like we messed up 😅';
		}
		if (navigator.onLine) {
			subtitle = localStorage.watchDogReason ?? `Technical details: HTTP_${localStorage.status} ${
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
			subtitle={subtitle ?? "Getting error details. If this doesn't change and you can still see this text, please get in touch with one of our team members."}
			><div class="flex justify-center items-center w-full pt-8 pb-4">
				{#if notFound}
					<SearchBar />
				{/if}
				{#if offLine}
					🌐 Functionality may be limited, or completely unavailable. 🦕
				{/if}
			</div></EscrowBanner
		>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

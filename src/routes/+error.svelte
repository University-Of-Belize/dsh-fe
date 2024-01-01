<script lang="ts">
	import { page } from '$app/stores';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import EscrowBanner from '$lib/Elements/Generic/EscrowBanner.svelte';
	import { onMount } from 'svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	let text: string, branding_text: string, subtitle: string;
	let notFound: boolean = false;
	onMount(() => {
		if ($page.status === 404) {
			text = "Sorry, looks like we couldn't find that one 😅";
			notFound = true;
		} else {
			text = 'Whoops, looks like we messed up 😅';
		}
		subtitle = `Technical details: HTTP_${$page.status} ${$page.error?.message}`;
	});
</script>

<svelte:head>
	<title>Plattr | {$page.status}</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex h-full items-center justify-center">
		<EscrowBanner
			branding_text={branding_text ?? "You've hit an error"}
			text={text ?? 'One moment while we fetch what went wrong'}
			subtitle={subtitle ??
				"Getting error details. If this doesn't change and you can still see this text, please get in touch with one of our team members."}
			><div class="flex w-full items-center justify-center pb-4 pt-8">
				{#if notFound}
					<SearchBar />
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

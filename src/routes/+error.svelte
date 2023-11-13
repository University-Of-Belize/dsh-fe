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

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex items-center justify-center h-full">
		<EscrowBanner
			{branding_text}
			text={text ?? 'Oops'}
			subtitle={subtitle ?? 'Getting error details.'}
			><div class="flex justify-center items-center w-full pt-8 pb-4">
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

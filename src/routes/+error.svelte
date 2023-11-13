<script lang="ts">
	import { page } from '$app/stores';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import EscrowBanner from '$lib/Elements/Generic/EscrowBanner.svelte';
	import { onMount } from 'svelte';
	let text: string, branding_text: string, subtitle: string;
	onMount(() => {
		if ($page.status === 404) {
			text = "Sorry, looks like we couldn't find that one 😅";
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
		/>
	</div>
</main>

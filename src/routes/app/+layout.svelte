<script lang="ts">
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
</script>

<main class="h-screen w-full overflow-hidden text-COLORLIGHT-100">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div
		class="content-wrapper absolute z-10 flex h-full w-full items-start justify-start overflow-auto pb-40"
	>
		<slot />
	</div>
</main>
<div class="footer relative z-10">
	<Footer text="Looks like you've reached the end.">
		<div class="block">
			<!-- <div class="text-xl font-light">Shop our entire menu by creating an account</div> -->
			<div class="flex w-full items-center justify-center pb-4 pt-8">
				<SearchBar />
			</div>
		</div>
	</Footer>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	:global(body)::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	:global(body) {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>

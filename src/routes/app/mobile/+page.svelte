<script lang="ts">
	import { page } from '$app/stores';
	import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
	import { writable } from 'svelte/store';

	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import Product from '$lib/Elements/Generic/ProductElement.svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	import type { EngineProduct } from '$lib/types/Product';
	import Fa from 'svelte-fa';

</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div
		class="content-wrapper w-full h-full absolute flex items-start justify-start overflow-auto z-10 pb-40"
	>
	xx

	</div>
</main>
<div class="footer relative z-10">
	<Footer text="Looks like you've reached the end.">
		<div class="block">
			<!-- <div class="text-xl font-light">Shop our entire menu by creating an account</div> -->
			<div class="flex justify-center items-center w-full pt-8 pb-4">
				<SearchBar />
			</div>
		</div>
	</Footer>
</div>

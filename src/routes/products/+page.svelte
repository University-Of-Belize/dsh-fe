<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import config from '$lib/config/settings.json';
	import { writable } from 'svelte/store';
	import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

	import IconButton from '$lib/Elements/Generic/IconButton.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import Fa from 'svelte-fa';

	interface Product {
		id: string;
		score: number;
		terms: string[];
		match: {
			[key: string]: string[];
		};
		description: string;
		productName: string;
		category: {
			_id: string;
			name: string;
			alias: string;
			description: string;
			hidden: boolean;
			__v: number;
		};
		image: string;
		in_stock: number;
		price: {
			$numberDecimal: string;
		};
		reviews: {
			_id: string;
			content: string;
			original_content: string;
			rating: number;
			reviewer: string;
			hidden: boolean;
			product: string;
			__v: number;
		}[];
		slug: string;
	}

	const products = writable<Product[]>([]);
	$: params = $page.url.searchParams.get('search');

	// Thread run everytime the params change
	$: (async () => {
		const response = await fetch(
			`${config.server.HTTPOrigin}/api/v1/search?filter=productName&q=${params?.toString().toLowerCase()}`
		);
		if (response.body == null) return;
		let r;
		try {
			r = await response.json();
		} catch (e) {
			console.error('Error parsing JSON:', e);
			products.set([]);
			return;
		}
		if (r && r.length > 0) {
			products.set(r); // @ts-ignore
		} else {
			products.set([]);
		}
	})();
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} value={params}/>
	</div>
	<div class="content-wrapper w-full h-full absolute flex items-start justify-start z-10">
		{#if $products && $products.length > 0}
			<div class="flex flex-wrap">
				{#each $products as product}<!-- This way, we filter out all the products from reviews -->
					{#if product.price != undefined}
						<div class="bg-white rounded-lg shadow-lg p-4 m-4 flex max-w-lg">
							<div class="flex-none">
								<img
									src={product.image || config['product-view']['default-image']}
									alt={product.productName}
									class="w-48 h-48 object-cover rounded-lg"
									on:error={() => {
										product.image = config['product-view']['default-image'];
									}}
									on:load={() => {
										console.log('Image loaded successfully');
									}}
								/>
							</div>
							<div class="relative flex-grow ml-4">
								<h2 class="text-lg font-semibold text-gray-700">{product.productName}</h2>
								<p class="mt-2 text-gray-600 font-light">{product.description.length > 100 ? `${product.description.slice(0, 100)}...` : product.description}</p>
								<p class="mb-16 text-gray-600 font-bold">
									${parseFloat(product.price?.$numberDecimal).toFixed(2)}
								</p>
								<div class="comboBox flex flex-wrap absolute bottom-1">
									<div
										class="details font-semibold bg-COLORRED text-COLORWHT1 button w-fit flex rounded-sm hover:bg-opacity-80 cursor-pointer px-4 py-2 items-center text-sm select-none mr-2"
										on:click={() => {
											window.location = `/products/${product.slug}`;
										}}
										role="link"
									>
										Details
									</div>

									<IconButton icon={faShoppingCart} color="COLORYLW" />
									
									<IconButton icon={faHeart} color="COLORRED" class="hidden lg:flex"/>
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="flex items-center justify-center item-center h-full w-full flex-wrap">
				<div class="flex items-center justify-center item-center h-fit w-full flex-wrap">
					<div class="icon basis-full h-fit flex items-center justify-center w-full text-gray-800">
						<Fa icon={faShoppingCart} size="2x" />
					</div>
					<p class="font-semibold">No products found</p>
				</div>
			</div>
		{/if}
	</div>
</main>

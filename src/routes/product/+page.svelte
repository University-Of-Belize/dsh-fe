<script lang="ts">
	import { page } from '$app/stores';
	import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
	import { writable } from 'svelte/store';

	import Product from '$lib/Elements/Dashboard/ProductElement.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import type { EngineProduct } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import type { Category } from '$lib/types/Category';
	import Fa from 'svelte-fa';
	import { goto } from '$app/navigation';

	const products = writable<EngineProduct[]>([]);
	$: params = $page.url.searchParams.get('search');
	$: params_filter = $page.url.searchParams.get('filter');
	let cachedCategories = localStorage.getItem('categories');
	let categories: Category[] = [];

	// Thread run everytime the params change
	$: (async () => {
		let searchResults, nameResults;
		try {
			const searchPromise = (await fetchWebApi(
				`v1/search?filter=productName&q=${
					params?.toString().toLowerCase() ?? params_filter?.toString().toLowerCase()
				}`,
				'GET'
			)) as Response;

			const searchResponse = await searchPromise;
			if (searchResponse.status === 404) {
				throw new Error('Search not found');
			}
			searchResults = await searchResponse.json();
			getCategories();
		} catch (e) {
			console.error('Error parsing JSON:', e);
			products.set([]);
			return;
		}
		if (searchResults && searchResults.length > 0) {
			products.set(searchResults); // @ts-ignore
		} else {
			try {
				const namePromise = (await fetchWebApi(
					`v1/search?filter=alias&q=${
						params_filter?.toString().toLowerCase() ?? params?.toString().toLowerCase()
					}`,
					'GET'
				)) as Response;
				const nameResponse = await namePromise;
				if (nameResponse.status === 404) {
					throw new Error('Name not found');
				}
				nameResults = await nameResponse.json();
			} catch (e) {
				console.error('Error parsing JSON:', e);
				products.set([]);
				return;
			}
			if (nameResults && nameResults.length > 0) {
				products.set(nameResults); // @ts-ignore
			} else {
				products.set([]);
			}
		}
	})();

	async function getCategories() {
		if (!cachedCategories) {
			const response = (await fetchWebApi('v1/category', 'GET')) as Response;
			if (!response) return;
			const data = await response.json();
			categories = data.is; // Category[]
			categories = categories.filter((category: Category) => !category.hidden);
			localStorage.setItem('categories', JSON.stringify(categories));
		} else {
			categories = JSON.parse(cachedCategories);
		}
	}
</script>

<svelte:head>
	<title>UniFood | Product Search / {params?.toString().toLowerCase() ?? 'Product Search'}</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<!-- Params to empty string--not undefined otherwise it will make the value actually be the string 'undefined' -->
		<Navigation transparency={5} search={true} value={params ?? ''} />
	</div>
	<div
		class="content-wrapper absolute z-10 h-full w-full items-start justify-start overflow-auto pb-40 lg:flex"
	>
		{#if $products && $products.length > 0}
			<!-- The categories -->

			<div class="block w-full">
				<div class="stub hidden bg-gray-200 bg-gray-300 text-gray-900 text-white" />
				<div class="categoryp-wrap flex w-full overflow-x-auto rounded-md">
					{#if categories.length > 0}
						{#each categories as category}
							<a
								on:click={() => {
									goto(
										// We filter by alias, display by name
										`/product?filter=${
											category.alias
												? category.alias.toString().toLowerCase()
												: category.name.toString().toLowerCase()
										}`
									);
								}}
								href={`/product?filter=${
									category.alias
										? category.alias.toString().toLowerCase()
										: category.name.toString().toLowerCase()
								}`}
								class="w-full border-b border-t border-gray-200 {params_filter
									?.toString()
									.toLowerCase() === category.alias?.toString().toLowerCase()
									? 'bg-gray-200 text-gray-900'
									: 'bg-gray-800 text-white'} flex items-center justify-center border-gray-700 px-4 py-2 text-center text-sm font-medium leading-tight hover:opacity-90 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
								style="min-width: 150px; max-height: 50px;"
							>
								{category.name.trim() ?? category.alias.trim()}
							</a>
						{/each}
					{/if}
				</div>

				<!-- The products -->
				<div class="flex flex-wrap justify-between lg:mx-10 lg:my-4">
					{#each $products as product}<!-- This way, we filter out all the products from reviews -->
						{#if product.price != undefined}
							<Product
								id={product.id}
								image={product.image}
								name={product.productName}
								description={product.description ?? ''}
								price={product.price?.$numberDecimal}
								slug={product.slug}
							/>
							<!-- <div class="bg-white rounded-lg shadow-lg p-4 m-4 flex max-w-lg">
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
								<p class="mt-2 text-gray-600 font-light">
									{product.description.length > 100
										? `${product.description.slice(0, 100)}...`
										: product.description}
								</p>
								<p class="mb-16 text-gray-600 font-bold">
									${parseFloat(product.price?.$numberDecimal).toFixed(2)}
								</p>
								<div class="comboBox flex flex-wrap absolute bottom-1">
									<div
										class="details font-semibold bg-COLORRED text-COLORWHT button w-fit flex rounded-sm hover:bg-opacity-80 cursor-pointer px-4 py-2 items-center text-sm select-none mr-2"
										on:click={() => {
											window.location = `/product/${product.slug}`;
										}}
										role="link"
									>
										Details
									</div>

									<IconButton icon={faShoppingCart} color="COLORYLW" />

									<IconButton icon={faHeart} color="COLORRED" class="hidden lg:flex" />
								</div>
							</div>
						</div> -->
						{/if}
					{/each}
				</div>
			</div>
		{:else}
			<div
				class="not-found flex h-full w-full flex-wrap items-center justify-center text-COLORWHT3"
			>
				<div class="flex h-fit w-full flex-wrap items-center justify-center">
					<div class="icon flex h-fit w-full basis-full items-center justify-center">
						<Fa icon={faShoppingCart} size="2x" />
					</div>
					<p class="font-semibold">No products found</p>
				</div>
			</div>
		{/if}
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
	.categoryp-wrap::-webkit-scrollbar {
		height: 1px !important;
	}
</style>

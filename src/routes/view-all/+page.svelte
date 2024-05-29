<script lang="ts">
	import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from "svelte";
	import { writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import Product from '$lib/Elements/Dashboard/ProductElement.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import type { Category } from '$lib/types/Category';
	import type { EngineProduct } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import Fa from 'svelte-fa';

	const products = writable<EngineProduct[]>([]);
	let cachedCategories = localStorage.getItem('categories');
	let categories: Category[] = [];

	// Thread run everytime the params change
	onMount(async () => {
		let searchResults, nameResults;

		try {
			const searchPromise = (await fetchWebApi(
				"v1/menu/",
				'GET'
			)) as Response;

			const searchResponse = await searchPromise;
			if (searchResponse.status === 404) {
				throw new Error('Search not found');
			}
			const res = await searchResponse.json();
			searchResults = res.is; // What _is_ the response?
			if (searchResults && searchResults.length > 0) {
			products.set(searchResults); // @ts-ignore
		    }
			getCategories();
		} catch (e) {
			console.error('Error parsing JSON:', e);
			products.set([]);
			return;
		}
	});

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
	<title>UniFood | View the Menu</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<!-- Params to empty string--not undefined otherwise it will make the value actually be the string 'undefined' -->
		<Navigation transparency={5} search={true}/>
	</div>
	<div
		class="content-wrapper absolute z-10 h-full w-full lg:mx-6 items-start justify-start overflow-auto pb-40 lg:flex"
	>
		{#if $products && $products.length > 0}
			<!-- The categories -->

			<div class="block w-full">
				<span class="stub hidden bg-gray-200 bg-gray-300 text-gray-900 text-white" />
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
								class="w-full border-b border-t border-gray-200 flex items-center justify-center border-gray-700 px-4 py-2 text-center text-sm font-medium leading-tight hover:opacity-90 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700"
								style="min-width: 150px; max-height: 50px;"
							>
								{category.name.trim() ?? category.alias.trim()}
							</a>
						{/each}
					{/if}
				</div>

				<!--- The title -->
				<div class="block my-8 w-full text-2xl font-semibold text-COLORWHT">
					<div>Product Availability</div>
					<div class="text-sm font-light">This is the entire menu. Browse through it as you'd like.</div>
				</div>

				<!-- The products -->
				<div class="flex flex-wrap justify-center lg:justify-start md:space-x-4 lg:my-4">
					<!-- This way, we filter out all the products from reviews -->
					{#each [...$products] as product}
						{#if product.price != undefined}
							<Product
								id={product.id}
								image={product.image}
								name={product.productName}
								description={product.description ?? ''}
								price={product.price?.$numberDecimal}
								slug={product.slug}
								out_of_stock={product.in_stock <= 0}
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

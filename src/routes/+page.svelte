<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import ProductBanner from '$lib/Elements/Generic/ProductBanner.svelte';
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	import type { Product as Product_ } from '$lib/types/Product.ts';
	import { faGift, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let categories = [];
	let product: Product_[] | null;
	onMount(async () => {
		try {
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/menu/random`);
			const r = await res.json();
			product = r.is;
			// console.log(product);
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while contacting our servers: ${error.message}`
			);
		}
	});

	async function getCategories() {
		const response = await fetch(`${config.server.HTTPOrigin}/api/v1/category`);
		const data = await response.json();
		categories = data.is; // Category[]
		categories = categories.filter((category: Category) => !category.hidden);
		if (localStorage.categories) {
			if (localStorage.categories !== JSON.stringify(categories)) {
				localStorage.removeItem('categories'); // Time for an update
			}
		}
	}

	getCategories();
</script>

<main class="w-full h-screen">
	<div class="hero">
		<div class="image-and-wrapper relative" style="height: 800px">
			<div class="navigation absolute w-full top-0 z-20">
				<Navigation transparency={5} search={true} />
			</div>
			<div class="content-wrapper w-full h-full absolute flex items-center justify-center z-10">
				<div class="content flex-1 flex items-center justify-center">
					<div class="block content-wrapper px-4 md:px-8 lg:px-0">
						<div
							class="running-heading text-COLORWHT py-10 text-7xl font-medium flex w-full justify-center items-center"
						>
							Order Anytime,<br /> Anywhere
						</div>
						<div class="running-subheading">
							<div
								on:click={() => {
									goto('/auth/login');
								}}
							>
								<Button icon={faRightToBracket} color="COLORYLW" text="Log in" />
							</div>
						</div>
					</div>
				</div>
				<div class="hidden lg:block fix flex-1">&nbsp;</div>
			</div>
			<div
				class="wrapper bg-black opacity-50 w-full h-full absolute flex items-center justify-center"
			>
				<!-- Nothing, this is an overlay-->
			</div>
			<div class="hero-image h-full w-full" />
		</div>
	</div>
	<div class="content block">
		<div class="category-grid flex justify-center items-center w-full flex-wrap">
			<div class="gridelement h-16 w-full flex justify-center items-center relative">
				<div
					class="content-wrapper w-full h-full absolute flex items-center justify-start text-2xl font-semibold text-COLORWHT bg-COLORBLK px-8 z-10"
				>
					Categories
				</div>
			</div>
		</div>
		<div
			class="category-grid ltr flex flex-wrap justify-center items-center w-full h-96 overflow-auto"
		>
			{#if categories.length > 0}
				{#each categories as category}
					<div
						class="gridelement flex-grow flex-shrink-0 lg:basis-1/4 h-full w-full flex justify-center items-center relative hover:opacity-80 cursor-pointer"
					>
						<div
							class="content-wrapper w-full h-full absolute flex items-center justify-center text-7xl font-semibold text-COLORWHT z-10"
							on:click={() => {
								goto(`/product?filter=${category.name.toString().toLowerCase()}`);
							}}
						>
							{category.alias ?? category.name}
						</div>

						<div
							class="wrapper bg-black opacity-50 w-full h-full absolute flex items-center justify-center"
						>
							<!-- Nothing, this is an overlay-->
						</div>
						<div
							class="hero-image-base h-full w-full"
							style="background-image: url('{category.image ||
								config['home-page']['default-image']}'); "
							on:error={() => {
								document.querySelector(
									'.hero-image-base'
								).style.backgroundImage = `url(${config['home-page']['default-image']})`;
							}}
						/>
					</div>
				{/each}
			{:else}
				<div class="gridelement h-full w-full flex justify-center items-center relative">
					<div
						class="content-wrapper w-full h-full absolute flex items-center justify-center text-7xl font-semibold text-COLORWHT z-10"
					>
						<!-- Loading data... -->
					</div>

					<div
						class="wrapper bg-black opacity-50 w-full h-full absolute flex items-center justify-center"
					>
						<!-- Nothing, this is an overlay-->
					</div>
					<div class="hero-image-1 h-full w-full" />
				</div>
			{/if}
		</div>

		<div class="gridelement h-16 w-full flex justify-center items-center relative">
			<div
				class="content-wrapper w-full h-full absolute flex items-center justify-start text-2xl font-semibold text-COLORWHT bg-COLORBLK px-8 z-10"
			/>
		</div>
	</div>
	<div class="featured block">
		<div
			class="banner-featured flex justify-start items-center text-2xl bg-COLORWHT font-semibold text-COLORBLK px-8 py-12"
		>
			Daily Special
		</div>
		{#if product}
			{#each product as product}
				<div class="flex w-full">
					<ProductBanner
						id={product._id}
						image={product.image}
						name={product.productName}
						description={product.description}
						price={product.price?.$numberDecimal}
						slug={product.slug}
						reviews={product.reviews}
					/>
				</div>{/each}
		{/if}
	</div>
	<Footer text="There's more to explore">
		<div class="block">
			<div class="text-xl font-light">Shop our entire menu by creating an account</div>
			<div
				class="btn-wrp p-2 w-full flex justify-center items-center"
				on:click={async () => {
					await goto('/auth/signup');
				}}
			>
				<Button icon={faGift} color="COLORPNK" text="Sign up" color_t="COLORWHT" />
			</div>
		</div>
	</Footer>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	.hero-image {
		background-image: url('/homepage/hero.png');
		background-size: cover;
	}
	.hero-image-base {
		background-size: cover;
	}

	.rtl {
		direction: rtl;
	}
	/* .ltr {
        direction: ltr;
    } */
	.rtl::-webkit-scrollbar {
		width: 15px;
	}
	.ltr::-webkit-scrollbar {
		width: 15px;
	}

	@media (max-width: 640px) {
		.ltr::-webkit-scrollbar {
			width: 8px;
		}
	}
</style>

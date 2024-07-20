<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DataCard from '$lib/Elements/Cards/DataCard.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import type { Category } from '$lib/types/Category';
	import type { Product as Product_ } from '$lib/types/Product';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faGift } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	let categories: Category[] = [];
	let logging_in: boolean = false;
	let debounceTimeout: number;
	let landingPhoto: string;
	// let clientWidth: number;
	// let clientHeight: number;
	let product: Product_[] | null;

	let LCP: string;
	let LCP_EXT: string;

	onMount(async () => {
		// Get the root element
		const root = document.documentElement;

		// Get the computed styles of the root element
		const style = getComputedStyle(root);

		// Get the value of the variable
		LCP = style.getPropertyValue('--LANDINGPHOTO');
		LCP = LCP.substring(4, LCP.length - 1).replace(/['"]+/g, ''); // Remove the dumb quotes

		LCP_EXT = LCP.split('.').pop(); // Get the extension

		try {
			const res = (await fetchWebApi('menu/random', 'GET')) as Response;
			if (!res) return;
			const r = await res.json();
			product = r.is;
			getCategories();
			// console.log(product);
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while contacting our servers: ${
					error?.message ?? 'Error unavailable.'
				}`
			);
		}
		landingPhoto = getComputedStyle(document.documentElement)
			.getPropertyValue('--LANDINGPHOTO')
			.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
		// clientWidth = window.innerWidth;
		// clientHeight = window.innerHeight;
	});
	async function getCategories() {
		const response = (await fetchWebApi('category', 'GET')) as Response;
		const data = await response.json();
		categories = data.is; // Category[]
		categories = categories.filter((category: Category) => !category.hidden);
		if (localStorage.categories) {
			if (localStorage.categories !== JSON.stringify(categories)) {
				localStorage.removeItem('categories'); // Time for an update
			}
		}
	}
</script>

<svelte:head>
	<!-- Preload the LCP image with a high fetchpriority so it starts loading with the stylesheet. -->
	<link rel="preload" fetchpriority="high" as="image" href={LCP} type="image/{LCP_EXT}" />
</svelte:head>

<main class="h-screen w-full text-COLORWHT">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<!-- {#if !localStorage.user} -->
	<div class="hero mb-8">
		<!-- <div
			class="image-and-wrapper relative"
			style="height: 250px;{localStorage.token ? '100vh' : '800px'}"
		>
			<div
				class="content-wrapper absolute z-10 flex h-full w-full items-center justify-start px-4 lg:px-10"
			>
				<div class="content-wrapper block px-4 md:px-8 lg:px-0">
					<div class="running-heading block w-fit space-y-6 text-4xl font-medium text-COLORWHT">
						<div class="block">
							This is it!<br />

							<div class="mt-6 text-sm font-light">
								<b class="font-normal">Introducing Plattr! Your one-stop shop for the latest food-dealings @ the University of Belize cafeteria! Online Test #1 is officially here!</b> Sign up using the button
								below 👇
							</div>
							<!-- Order Anytime,<br /> Anywhere --
						</div>
						<div class="running-subheading">
							<div
								class="w-fit"
								on:click={() => {
									goto('/auth/login');
								}}
							>
								<Button icon={faRightToBracket} color="COLORBLK2" color_t="COLORWHT" text="Log in" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="wrapper absolute flex h-full w-full items-center justify-center bg-COLORBLK opacity-20"
			>
				<!-- Nothing, this is an overlay--
			</div>
			<div class="hero-image h-full w-full" />
		</div> -->

		<div class="hero-image w-full p-8">
			<div class="mb-4 w-20 rounded-md bg-COLORBLK2 px-2 py-1 text-sm font-medium text-COLORWHT">
				BETA
			</div>
			<p class="mb-2 text-2xl">This is it! 😊🎉</p>
			<p class="mb-6 text-COLORWHT2">
				Introducing Plattr! Your one-stop shop for the latest food-dealings @ the University of
				Belize cafeteria!<br />Online Test #2 is officially here! Sign up using the button below 👇
			</p>
			<button
				class="flex items-center space-x-2 rounded-md border-2 border-COLORWHT px-4 py-2 font-medium text-COLORWHT transition hover:bg-COLORBLK1 hover:opacity-80"
			>
				<a href="/auth/create"><span> Sign up </span></a>
				<span
					><svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="h-6 w-6"
					>
						<path
							fill-rule="evenodd"
							d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			</button>
		</div>
	</div>

	<div class="content block">
		<div class="category-grid flex w-full flex-wrap items-center justify-center">
			<div class="gridelement relative flex h-16 w-full items-center justify-center bg-COLORBLK">
				<div
					class="content-wrapper absolute z-10 flex h-full w-full items-center justify-start bg-COLORBLK px-8 text-2xl font-semibold text-COLORWHT"
				>
					Categories
				</div>
			</div>
		</div>
		<div
			class="category-grid flex h-full w-full flex-wrap items-center justify-center overflow-auto lg:justify-start"
		>
			<DataCard
				url="/product/view-all"
				image="/assets/home/all_products.png"
				name="View the menu"
				description="View the entire menu and product availability."
			/>
			{#if categories.length > 0}
				{#each categories as category}
					<DataCard
						url={`/product?filter=${category.alias.toString().toLowerCase()}`}
						image={category.image}
						name={category.name}
						description={category.description}
					/>
				{/each}
				<!-- {:else}
				<div class="flex h-16 w-full items-center justify-center">
					<div class="text-2xl font-semibold text-COLORWHT">No categories available</div>
				</div> -->
			{/if}
		</div>

		<div class="featured block">
			<div
				class="banner-featured flex items-center justify-start bg-COLORBLK1 px-8 py-12 text-2xl font-semibold text-COLORWHT"
			>
				For You
			</div>
			<div
				class="category-grid flex h-full w-full flex-wrap items-center justify-center lg:justify-start"
			>
				{#if product}
					{#each product as product}
						<DataCard
							url={`/product/${product.slug}`}
							image={product.image}
							name={product.productName + `<br/>$${product.price?.$numberDecimal}`}
							description={product.description
								? product.description.length > 500
									? product.description.substring(0, 500) + '...'
									: product.description
								: '' ?? ''}
							reviews={product.reviews}
						/>
					{/each}
				{/if}
			</div>
		</div>
		{#if !localStorage.token}
			<Footer text="There's more to explore">
				<div class="block">
					<div class="text-xl font-light">Shop our entire menu by creating an account</div>
					<div
						class="btn-wrp flex w-full items-center justify-center p-2"
						on:click={async () => {
							await goto('/auth/signup');
						}}
					>
						<Button icon={faGift} color="COLORPNK" text="Sign up" color_t="COLORWHT" />
					</div>
				</div>
			</Footer>{/if}
	</div>
	<!-- {:else}
		<SuperDashboard />
	{/if} -->
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	.hero-image {
		background-image: var(--LANDINGPHOTO) !important;
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

	/* @media (min-width: 1024px) {
		/* Circle over title /
		.hero-image::before {
			/* Small box shadow that blends into the background /
			/* box-shadow: 1px 0 8px 4px rgb(var(--COLORBLK) / 0.25); /
			width: 50%;
			height: 100%;
			display: block;
			content: '';
			position: absolute;
			bottom: 0;
			background: linear-gradient(90deg, rgb(var(--COLORBLK)), transparent);
		}
	} */
	.hero {
		transition-property: -webkit-transform;
		transition-property: transform;
		transition-duration: 200ms;
	}
	.image-and-wrapper {
		overflow: clip;
		border-radius: 5% 0;
		z-index: 1;
	}
</style>

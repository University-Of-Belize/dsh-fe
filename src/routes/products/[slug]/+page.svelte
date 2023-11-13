<script lang="ts">
	import { page } from '$app/stores';
	import config from '$lib/config/settings.json';
	import {
		faHeart,
		faShoppingCart,
		faStar,
		faStarHalfAlt
	} from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import IconButton from '$lib/Elements/Generic/IconButton.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import Fa from 'svelte-fa';
	import type { Product } from '$lib/types/Product.ts';
	import StarCount from '$lib/Elements/Generic/StarCount.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	let hero_image: HTMLDivElement;

	const product = writable<Product | null>(null);
	const params = $page.params.slug;

	onMount(async () => {
		try {
			// Check if the slug even exists
			const response = await fetch(`${config.server.HTTPOrigin}/api/v1/menu/slug?id=${params}`);
			if (!response.ok) {
				history.back();
			}
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while loading our products: ${error.message}`
			);
		}
	});

	// Thread run everytime the params change
	$: (async () => {
		const response = await fetch(
			`${config.server.HTTPOrigin}/api/v1/search?filter=productName&q=${params}`
		);
		if (response.body == null) return;
		let r;
		try {
			r = await response.json();
		} catch (e) {
			console.error('Error parsing JSON:', e);
			product.set(null);
			return;
		}

		if (r && r.length > 0) {
			product.set(r[0]); // take the first result
		} else {
			product.set(null);
		}
	})();
	function calculateRating(reviews: Product['reviews'][], count: boolean) {
		let sum = 0;
		let index = 0;
		reviews.forEach((review, i) => {
			// @ts-ignore
			sum += review.rating;
			index = i;
		});
		const result = (sum / reviews.length).toFixed(2);
		console.log(Number.isNaN(parseFloat(result)));
		if (Number.isNaN(parseFloat(result))) return 'No reviews yet';
		return count ? index : result; // I know this is bad and unscalable, but I'm lazy
	}
	function getPercentage(reviews: Product['reviews'][], rating: Number) {
		const totalReviews = reviews.length;
		const ratingCount = reviews.filter((review) => review.rating === rating).length;
		const percentage = (ratingCount / totalReviews) * 100;
		return percentage.toFixed(0);
	}
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="hero">
		<div class="image-and-wrapper relative" style="height: 800px">
			<div
				class="content-wrapper w-full h-full absolute flex items-center justify-center z-10 flex-wrap"
			>
				<div class="content lg:flex-1 flex h-full items-start justify-start mx-12 py-24">
					{#if $product}
						<div class="block content-wrapper">
							<div
								class="running-heading text-COLORWHT text-4xl font-medium flex w-full justify-start items-center"
							>
								{$product.productName || "Oops, this product doesn't exist!"}
							</div>
							<StarCount reviews={$product.reviews} />
							<div class="text-sm lg:text-lg font-light text-COLORWHT">
								{@html $product.description}
							</div>
							<div class="text-md lg:text-xl py-4 font-semibold text-COLORWHT">
								${parseFloat($product.price.$numberDecimal).toFixed(2)}BZD
							</div>
							<div class="comboBox flex absolute py-4">
								<div
									class="details font-semibold bg-COLORRED text-COLORWHT1 button w-fit flex rounded-sm hover:bg-opacity-80 cursor-pointer px-4 py-2 items-center text-sm select-none mr-2"
									on:click={() => {
										window.location = `/checkout?single_cart=${$product.slug}`;
									}}
									role="link"
								>
									Purchase Now
								</div>

								<IconButton icon={faShoppingCart} color="COLORYLW" />
								<IconButton icon={faHeart} color="COLORRED" />
							</div>
						</div>{/if}
				</div>
				<div class="fix flex-1">&nbsp;</div>
			</div>
			<div
				class="wrapper bg-black opacity-50 w-full h-full absolute flex items-center justify-center"
			>
				<!-- Nothing, this is an overlay-->
			</div>
			{#if $product}
				<div
					class="hero-image h-full w-full"
					style="background-image: url('{$product.image}')"
				/>{/if}
		</div>
	</div>
	<div class="main-content mx-8 py-8">
		{#if $product}
			<div class="text-4xl text-COLORBLK font-semibold pt-2">Reviews</div>
			<div class="review-graph flex w-full py-2 pb-2">
				<div class="rating">
					<div class="rating-as-text font-bold text-6xl">
						{calculateRating($product.reviews)}
					</div>
					<div
						class="rating-as-stars flex w-full justify-start items-center pl-1 text-xl text-COLORYLW"
					>
						<StarCount reviews={$product.reviews} />
					</div>
					<div class="rating-as-text w-full flex items-center justify-start pl-1 py-2">
						{calculateRating($product.reviews, true)} Reviews
					</div>
				</div>
				<div class="graphed-reviews w-1/4 px-8 flex-1 lg:flex-none">
					{#each Array.from({ length: 5 }, (_, i) => i + 1) as rating}
						<div class="flex items-center justify-between py-1">
							<div class="text-COLORBLK px-2">{rating}</div>
							<div class="w-full bg-COLORBLK h-2 rounded-sm">
								<div
									class="bg-COLORYLW h-full rounded-sm"
									style="width: {getPercentage($product.reviews, rating)}%"
								/>
							</div>
						</div>
					{/each}
				</div>
			</div>

			{#each $product.reviews as review}
				<div class="review my-4 bg-COLORWHT3 bg-opacity-50 px-4 py-2 rounded-md">
					<div class="flex bg-opacity-100">
						<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
							<img
								class="rounded-md"
								src={review.reviewer?.profile_picture ||
									config['product-showcase']['default-image']}
								alt="{review.reviewer?.username}'s avatar"
								on:error={() => {
									review.reviewer.profile_picture = config['product-showcase']['default-image'];
								}}
								style="width: 50px; height: 50px;"
							/>
						</div>
						<div class="review-content text-COLORBLK">
							<div class="text-lg font-semibold flex">
								{review.reviewer?.username || 'Anonymous'}
								<div class="starcount flex text-COLORYLW items-center justify-center px-2">
									<!-- Copilot Logic-->
									{#each Array.from({ length: 5 }, (_, i) => i) as _}
										{#if _ < Math.floor(calculateRating([review]))}
											<Fa icon={faStar} size="1x" />
										{:else if _ === Math.floor(calculateRating( [review] )) && calculateRating( [review] ) % 1 >= 0.5}
											<Fa icon={faStarHalfAlt} size="1x" />
										{:else}
											<Fa icon={faStar} size="1x" class="opacity-25" />
										{/if}
									{/each}
								</div>
							</div>
							<div class="text-md font-light text-COLORBLE">{review.content}</div>
						</div>
					</div>
				</div>
			{/each}
			<!--- Create a review --->
			<!-- <div class="review my-4 bg-COLORWHT3 bg-opacity-50 px-4 py-2 rounded-md">
				<div class="flex bg-opacity-100">
					<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
						<img class="rounded-md"
							src={review.reviewer?.profile_picture ||
								config['product-showcase']['default-image']}
							alt="{review.reviewer?.username}'s avatar"
							on:error={() => {
								review.reviewer.profile_picture = config['product-showcase']['default-image'];
							}}
							style="width: 50px; height: 50px;"
						/>
					</div>
					<div class="review-content text-COLORBLK">
						
						<input type="text" class="text-md font-light text-COLORBLE"/>
					</div>
				</div>
			</div> -->
		{/if}
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	.hero-image {
		background-size: cover;
	}
</style>

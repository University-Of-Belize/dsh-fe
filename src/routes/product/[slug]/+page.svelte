<script lang="ts">
	import { page } from '$app/stores';
	import config from '$lib/config/settings.json';
	import {
		faCog,
		faHeart,
		faPencil,
		faShoppingCart,
		faStar,
		faStarHalfAlt
	} from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import Button from '$lib/Elements/Generic/Button.svelte';
	import IconButton from '$lib/Elements/Generic/IconButton.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import StarCount from '$lib/Elements/Generic/StarCount.svelte';
	import type { Product } from '$lib/types/Product.ts';
	import { toast } from '@zerodevx/svelte-toast';
	import Fa from 'svelte-fa';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	// let hero_image: HTMLDivElement;
	const user = localStorage.user; // The user
	const product = writable<Product | null>(null);
	let product_id: string;
	const params = $page.params.slug;
	let newReviewContent: HTMLTextAreaElement;
	let rating = 0;

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
			product_id = r[0].id;
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
		// console.log(Number.isNaN(parseFloat(result)));
		if (Number.isNaN(parseFloat(result))) return 'No reviews yet';
		return count ? index + 1 : result; // I know this is bad and unscalable, but I'm lazy
	}
	function getPercentage(reviews: Product['reviews'][], rating: Number) {
		const totalReviews = reviews.length;
		const ratingCount = reviews.filter((review) => review.rating === rating).length;
		const percentage = (ratingCount / totalReviews) * 100;
		return percentage.toFixed(0);
	}
	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}
	const handleSubmit = (event) => {
		event.preventDefault();
		newReviewContent.disabled = true;
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);
		// console.log(valueArray[0], rating);
		if (rating <= 0 || valueArray[0].trim() === '') {
			toast.push(
				'You cannot leave an empty comment and your rating must be <b>greater than 0</b>',
				{
					dismissable: false,
					theme: {
						'--toastBarBackground': '#842d69'
					}
				}
			);
		} else {
			Review(valueArray[0], rating); // Pass in the comment and the rating
		}
	};

	function setRating(value: number) {
		rating = value;
	}

	async function Review(comment: string, rating: number) {
		const response = await fetch(`${config['server']['HTTPOrigin']}/api/v1/review/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.token}`
			},
			body: JSON.stringify(what_is(what.public.review, [product_id, rating, comment]))
		});
		const data = await response.json();
		if (!response.ok) {
			return toast.push(data.message, {
				dismissable: false,
				theme: {
					'--toastBarBackground': '#842d69'
				}
			});
		}
		toast.push(
			"Your review was created. It'll take a few minutes to show up. Indexing every: <b>3 minutes</b>"
		);
		setTimeout(() => {
			window.location.reload();
		}, 2000);
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
										window.location = `/product/checkout?single_cart=${$product.slug}`;
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

			<!-- New reviews first -->
			<div class="flex flex-col-reverse justify-start w-full">
				{#if $product.reviews.length === 0}<b>No reviews yet. Be the first.</b>{/if}
				{#each $product.reviews as review}
					<div class="review my-4 bg-COLORWHT3 bg-opacity-50 px-4 py-2 rounded-md">
						<div class="flex bg-opacity-100">
							<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
								<img
									class="rounded-md w-full"
									src={review.reviewer?.profile_picture || config['user']['default-image']}
									alt="{review.reviewer?.username}'s avatar"
									on:error={() => {
										review.reviewer.profile_picture = config['user']['default-image'];
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
								<div class="text-md font-light text-COLORBLE">
									{@html escapeHtml(review.content).replace(/\n/g, '<br>')}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<!--- Create a review --->
			{#if user}<div class="review my-4 bg-transparent px-4 py-2 rounded-md">
					<div class="flex bg-opacity-100">
						<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
							<img
								class="rounded-md"
								src={user.profile_picture || config['user']['default-image']}
								alt="{user.username}'s avatar"
								on:error={() => {
									user.profile_picture = config['user']['default-image'];
								}}
								style="width: 50px; height: 50px;"
							/>
						</div>
						<form
							class="review-content text-COLORBLK w-full h-full px-1 py-1 rounded-md"
							action="#"
							on:submit={(event) => handleSubmit(event)}
						>
							<div class="review-wrap border border-black rounded-md mb-4">
								<div
									class="text-i-combo flex font-semibold items-center justify-start text-COLORGRY"
								>
									<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
									Write a review...
								</div>
								<textarea
									bind:this={newReviewContent}
									name="review"
									class="text-md font-light text-COLORBLE h-full w-full px-2 py-1 mx-6 bg-transparent focus:outline-none"
									rows="6"
									placeholder="What's on your mind?"
								/>
							</div>
							<div
								class="star-rating flex flex-row-reverse items-center justify-end select-none text-2xl font-light py-4"
							>
								{#each [5, 4, 3, 2, 1] as value}
									<div class="star flex items-center justify-center text-COLORYLW">
										<div class="star-wrapper relative">
											<input
												type="radio"
												id={value}
												name="rating"
												{value}
												class="absolute z-10 w-8 h-8 opacity-0"
												on:change={() => setRating(value)}
											/>
											<label for={value} class="relative z-0" class:active={rating >= value}
												><Fa icon={faStar} size="1x" /></label
											>
										</div>
									</div>
								{/each}
								<div class="pr-2">Your Rating</div>
							</div>
							<button type="submit"
								><Button
									icon={faCog}
									text="Apply Changes"
									color_t="COLORWHT"
									color="COLORBLK"
								/></button
							>
						</form>
					</div>
				</div>{/if}
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

	.star-rating .star-wrapper label {
		color: #c79f1f;
		opacity: 0.5;
	}
	.star-rating .star-wrapper label.active {
		opacity: 1;
	}
</style>
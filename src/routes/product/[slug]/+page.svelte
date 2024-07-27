<script lang="ts">
	import { page } from '$app/stores';
	import config from '$lib/config/settings';
	import {
		faCheckDouble,
		faCog,
		faLink,
		faLock,
		faPencil,
		faShoppingCart,
		faStar,
		faStarHalfAlt,
		faTrash
	} from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import IconButton from '$lib/Elements/Buttons/IconButton.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import StarCount from '$lib/Elements/Generic/StarCount.svelte';
	import { addToCart } from '$lib/Elements/Utility/Cart';
	import { createReview, deleteReview, escapeHtml } from '$lib/Elements/Utility/Review';
	import { locateNodeUsingHash } from '$lib/Elements/Utility/page';
	import type { Product } from '$lib/types/Product.ts';
	import type { User } from '$lib/types/User';
	import type { VariationData } from '$lib/types/Variation';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import Fa from 'svelte-fa';
	// let hero_image: HTMLDivElement;
	const staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // The user
	const user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // The user
	const product = writable<Product | null>(null);
	let product_id: string;
	const params = $page.params.slug;
	let newReviewContent: HTMLTextAreaElement;
	let rating = 0;

	let added_to_cart = false;
	let clicked_times = 0;
	let debounceTimeout: NodeJS.Timeout;

	let descriptionPaneSelection: HTMLAnchorElement;
	let productDescription: HTMLDivElement;

	let reviewPaneSelection: HTMLAnchorElement;
	let productReviews: HTMLDivElement;

	let productVariations: VariationData;
	let selectedVariations: string[] = [];

	onMount(async () => {
		// Mounted scrolling to anchors
		locateNodeUsingHash('review');

		try {
			// Check if the slug even exists
			const response = (await fetchWebApi(`menu/slug?id=${params}`, 'GET')) as Response;
			if (!response.ok) {
				history.back();
			}

			const retVal = await getProduct();
			if ($product == null || retVal !== 1) return;

			// Check if this product has variations
			const variations_response = (await fetchWebApi(
				`menu/variation/${$product._id}`,
				'GET'
			)) as Response;
			if (variations_response.ok) {
				const variations = await variations_response.json();
				productVariations = variations.is; // What is?
			}

			// console.log($product);
			// **************** TELEMETRY ******************
			gtag('event', 'view_item', {
				currency: 'BZD',
				value: $product.price['$numberDecimal'],
				items: [
					{
						item_id: $product._id,
						item_name: $product.productName.trim(),
						//affiliation: "Google Merchandise Store",
						//coupon: "SUMMER_FUN",
						discount: 0.0,
						index: 0,
						item_brand: 'UniFood',
						item_category: $product.category.name.trim(),
						//item_category2: "Adult",
						//item_category3: "Shirts",
						//item_category4: "Crew",
						//item_category5: "Short sleeve",
						//item_list_id: "related_products",
						item_list_name: $product.productName.trim(),
						item_variant: $product.slug.trim(),
						//location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
						price: $product.price['$numberDecimal'],
						quantity: 1
					}
				]
			});
			// ************** END TELEMETRY ****************
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while loading our products: ${error.message}`
			);
		}
	});

	async function getProduct() {
		const response = (await fetchWebApi(`menu/lookup?slug=${params}`, 'GET')) as Response;
		if (!response || response.body == null) return;
		let r;
		try {
			r = await response.json();
			// if (r && r.length > 0) {
			// product.set(r[0]); // take the first result
			// product_id = r[0].id;
			product.set(r.is); // take the first result
			product_id = r.is._id;
			document.title = `UniFood | Product / ${r.is.productName}`;
			// } else {
			// 	product.set(null);
			// }
			return 1;
		} catch (e) {
			console.error('Error parsing JSON:', e);
			product.set(null);
			return;
		}
	}

	// Thread run everytime the params change
	$: (async () => {
		getProduct();
	})();
	function calculateRating(reviews: Product['reviews'], count: boolean = false) {
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
	function getPercentage(reviews: Product['reviews'], rating: Number) {
		const totalReviews = reviews.length;
		const ratingCount = reviews.filter((review) => review.rating === rating).length;
		const percentage = (ratingCount / totalReviews) * 100;
		return percentage.toFixed(0);
	}
	const handleSubmit = (event: Event) => {
		event.preventDefault();
		newReviewContent.disabled = true;
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el: any) => el.name)
			.map((el: any) => el.value);
		// console.log(valueArray[0], rating);
		if (rating <= 0 || valueArray[0].trim() === '') {
			toast.push(
				'You cannot leave an empty comment and your rating must be <b>greater than 0</b>',
				{
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
					}
				}
			);
		} else {
			createReview(product_id, rating, valueArray[0]); // Pass in the comment and the rating
		}
	};

	function setRating(value: number) {
		rating = value;
	}
</script>

<svelte:head>
	<title>UniFood | Product</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	{#if $product}
		<section class="py-12 text-COLORLIGHT-100 sm:py-16">
			<div class="container mx-auto px-4">
				<!-- <nav class="flex">
			<ol role="list" class="flex items-center">
			  <li class="text-left">
				<div class="-m-1">
				  <a href="#" class="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"> Home </a>
				</div>
			  </li>
	  
			  <li class="text-left">
				<div class="flex items-center">
				  <span class="mx-2 text-gray-400">/</span>
				  <div class="-m-1">
					<a href="#" class="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"> Products </a>
				  </div>
				</div>
			  </li>
	  
			  <li class="text-left">
				<div class="flex items-center">
				  <span class="mx-2 text-gray-400">/</span>
				  <div class="-m-1">
					<a href="#" class="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800" aria-current="page"> Coffee </a>
				  </div>
				</div>
			  </li>
			</ol>
		  </nav> -->

				<div
					class="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16"
				>
					<div class="lg:col-span-3 lg:row-end-1">
						<div class="lg:flex lg:items-start">
							<div class="lg:order-2 lg:ml-5">
								<div class="max-w-xl overflow-hidden rounded-lg">
									<img
										class="h-full w-full max-w-full object-cover"
										src={$product.image}
										alt="Photo of {$product.productName || 'non-existing product'}"
									/>
								</div>
							</div>

							<!-- <div class="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
				  <div class="flex flex-row items-start lg:flex-col">
					<button type="button" class="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-gray-900 text-center">
					  <img class="h-full w-full object-cover" src="/images/JHxMnVrtPMdcNU1s_7g7f.png" alt="" />
					</button>
					<button type="button" class="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-transparent text-center">
					  <img class="h-full w-full object-cover" src="/images/JHxMnVrtPMdcNU1s_7g7f.png" alt="" />
					</button>
					<button type="button" class="flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 border-transparent text-center">
					  <img class="h-full w-full object-cover" src="/images/JHxMnVrtPMdcNU1s_7g7f.png" alt="" />
					</button>
				  </div>
				</div> -->
						</div>
					</div>

					<div class="lg:col-span-2 lg:row-span-2 lg:row-end-2">
						<h1 class="sm: text-2xl font-bold sm:text-3xl">
							{$product.productName || "Oops, this product doesn't exist!"}
						</h1>

						<div class="mt-1 flex items-center">
							<div class="flex items-center">
								<StarCount reviews={$product.reviews} />
							</div>
							<!-- <div class="flex items-center">
				  <svg class="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" class=""></path>
				  </svg>
				  <svg class="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" class=""></path>
				  </svg>
				  <svg class="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" class=""></path>
				  </svg>
				  <svg class="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" class=""></path>
				  </svg>
				  <svg class="block h-4 w-4 align-middle text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" class=""></path>
				  </svg>
				</div> -->
							<!-- <p class="ml-2 text-sm font-medium text-gray-500">1,209 Reviews</p> -->
						</div>

						<!-- @todo Make this into a form -->
						<!-- Loop through the variations array and map them to their respective vcategories -->
						<!-- We use the VCategory_id property (second subarray) to identify which category these elements belong to by matching it against the first subarray elements' property _id -->
						{#if productVariations}
							{#each productVariations[0] as variation, vcat_index}
								<div class="mt-8">
									<h2 class="mt-8 text-base">{variation.Name}</h2>
									<div class="mt-3 flex select-none flex-wrap items-center gap-1">
										{#each productVariations[1] as v, variation_index}
											{#if v.VCategory_id.trim() === variation._id.trim()}
												<label class="">
													<input
														id={v._id}
														on:click={() => {
															selectedVariations[vcat_index] = v._id;
															console.log(selectedVariations);
														}}
														type="radio"
														name={variation.Name}
														value={v.Name}
														class="peer sr-only cursor-pointer"
													/>
													<p
														class="rounded-lg border border-COLORLIGHT-100 px-6 py-2 font-bold peer-checked:bg-COLORLIGHT-100 peer-checked:text-COLORDARK-100"
													>
														{v.Name}
													</p>
												</label>
											{/if}
										{/each}
									</div>
								</div>
							{/each}
						{/if}

						<div
							class="mt-10 flex flex-col items-center justify-between space-y-4 border-y border-COLORLIGHT-100 py-4 sm:flex-row sm:space-y-0"
						>
							<div class="flex items-end">
								<h1 class="text-3xl font-bold">
									{parseFloat($product.price.$numberDecimal).toLocaleString('en-US', {
										style: 'currency',
										currency: config['checkout']['currency'],
										minimumFractionDigits: 2
									})}
								</h1>
							</div>

							<div class="buttongroup flex">
								<span class="hidden rounded-l-none rounded-r-none" />
								<a
									href="#"
									on:click={() => {
										addToCart($product, $product?._id, 1, selectedVariations);
										clearTimeout(debounceTimeout);
										debounceTimeout = setTimeout(async () => {
											added_to_cart = true;
											clicked_times += 1;
										}, 500);
									}}
									class="flex items-center justify-center space-x-2 rounded-lg rounded-r-none transition-all {added_to_cart
										? 'bg-green-700'
										: 'bg-blue-700'} px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									<Fa icon={added_to_cart ? faCheckDouble : faShoppingCart} />
								</a>
								<a
									href="#"
									on:click={() => {
										localStorage.setItem('wants_single_cart', 'true');
										localStorage.setItem('selected_variations', JSON.stringify(selectedVariations));
										goto(`/product/checkout?single_cart=${$product?._id}`);
									}}
									class="flex items-center justify-center space-x-2 rounded-r-lg {staff
										? 'rounded-r-none'
										: ''} bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									<Fa icon={faLock} />
									<div>Buy now</div></a
								>
								{#if staff}
									<div
										class="editProduct"
										on:click={() =>
											goto(`/admin/dashboard/product/manage?product_id=${$product?._id}`)}
									>
										<IconButton icon={faPencil} color=COLORDARK-75 />
									</div>{/if}
							</div>
						</div>

						<ul class="mt-8 space-y-2">
							<li class="flex items-center text-left text-sm font-medium text-COLORLIGHT-100">
								<svg
									class="mr-2 block h-5 w-5 align-middle text-COLORLIGHT-15"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
										class=""
									></path>
								</svg>
								Secure checkout
							</li>
						</ul>
					</div>

					<div class="lg:col-span-3">
						<div class="border-b border-COLORLIGHT-100">
							<nav class="flex gap-0.5">
								<a
									href="#"
									bind:this={descriptionPaneSelection}
									on:click={(e) => {
										e.preventDefault();
										productDescription.classList.remove('hidden');
										productReviews.classList.add('hidden');

										reviewPaneSelection.classList.remove('bg-COLORDARK-75');
										reviewPaneSelection.classList.add('border-transparent');

										descriptionPaneSelection.classList.remove('border-transparent');
										descriptionPaneSelection.classList.add('bg-COLORDARK-75');
									}}
									title=""
									class="border-b-2 border-COLORLIGHT-15 border-transparent px-4 py-4 text-sm font-medium hover:border-COLORLIGHT-100 hover:bg-COLORDARK-75 hover:opacity-80"
								>
									Description
								</a>

								<a
									href="#"
									bind:this={reviewPaneSelection}
									on:click={(e) => {
										e.preventDefault();
										productDescription.classList.add('hidden');
										productReviews.classList.remove('hidden');

										descriptionPaneSelection.classList.remove('bg-COLORDARK-75');
										descriptionPaneSelection.classList.add('border-transparent');

										reviewPaneSelection.classList.remove('border-transparent');
										reviewPaneSelection.classList.add('bg-COLORDARK-75');
									}}
									title=""
									class="inline-flex items-center border-b-2 border-COLORLIGHT-15 bg-COLORDARK-75 px-4 py-4 text-sm font-medium hover:bg-COLORDARK-75"
								>
									Reviews
								</a>
							</nav>
						</div>

						<div
							bind:this={productDescription}
							class="root-content mt-8 flow-root hidden overflow-clip sm:mt-12"
						>
							{@html escapeHtml($product.description ?? '').replace(/\n/g, '<br>')}
						</div>
						<div bind:this={productReviews} class="mt-8 flow-root overflow-clip sm:mt-12">
							{#if $product}
								<div class="pt-2 text-4xl font-semibold text-COLORLIGHT-100">Reviews</div>
								<div class="review-graph flex w-full py-2 pb-2">
									<div class="rating">
										<div class="rating-as-text text-6xl font-bold text-COLORLIGHT-15">
											{calculateRating($product.reviews)}
										</div>
										<div
											class="rating-as-stars flex w-full items-center justify-start pl-1 text-xl text-COLORACCENTL"
										>
											<StarCount reviews={$product.reviews} />
										</div>
										<div
											class="rating-as-text flex w-full items-center justify-start py-2 pl-1 text-COLORLIGHT-50"
										>
											{calculateRating($product.reviews, true)} Reviews
										</div>
									</div>
									<div class="graphed-reviews hidden w-full flex-1 px-8 lg:block lg:flex-none">
										{#each Array.from({ length: 5 }, (_, i) => i + 1) as rating}
											<div class="flex items-center justify-between py-1">
												<div class="px-2 text-COLORLIGHT-100">{rating}</div>
												<div class="h-2 w-full rounded-sm bg-COLORDARK-75">
													<div
														class="h-full rounded-sm bg-COLORACCENTL"
														style="width: {getPercentage($product.reviews, rating)}%"
													/>
												</div>
											</div>
										{/each}
									</div>
								</div>

								<!-- New reviews first -->
								<div class="flex w-full flex-col-reverse justify-start">
									{#if $product.reviews.length === 0}<b>No reviews yet. Be the first.</b>{/if}
									{#each $product.reviews as review}
										{#if !review.hidden}
											<div
												class="review my-4 rounded-md bg-COLORDARK-50 bg-opacity-50 px-4 py-2"
												id={review._id}
											>
												<div class="flex bg-opacity-100">
													<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
														<img
															class="hidden w-full rounded-md lg:block"
															src={review.reviewer?.profile_picture ||
																config['user']['default-image']}
															alt="{review.reviewer?.username}'s avatar"
															on:error={() => {
																review.reviewer.profile_picture = config['user']['default-image'];
															}}
															style="width: 50px; height: 50px;"
														/>
													</div>
													<div class="review-content text-COLORLIGHT-100">
														<div class="flex text-lg font-semibold">
															<a href="/app/space/{review.reviewer?._id}" class="hover:underline"
																><span>{review.reviewer?.username || 'Anonymous'}</span></a
															>
															<div
																class="starcount flex items-center justify-center px-2 text-COLORACCENTL"
															>
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
														<div class="text-md font-light text-COLORLIGHT-15">
															{@html escapeHtml(review.content).replace(/\n/g, '<br>')}
														</div>
														{#if JSON.parse(localStorage.staff ?? false)}
															<div
																class="actions my-4 flex flex-1 items-center justify-start text-COLORLIGHT-100 lg:justify-end"
															>
																<div class="controls flex space-x-2">
																	<div class="stub hidden bg-COLORACCENTL" />
																	<div
																		class="edit-wrap h-fit w-fit"
																		on:click={() => {
																			deleteReview(review._id);
																			try {
																				document
																					.getElementById(review._id)
																					.classList.add('bg-COLORACCENTL');
																				document
																					.getElementById(review._id)
																					.classList.remove('bg-COLORLIGHT-50');
																			} catch (error) {
																				console.warn(
																					'[DELETE_REVIEW]: Failed to update UI state.',
																					error
																				);
																			}
																			setTimeout(() => {
																				window.location.reload();
																			}, 3000);
																		}}
																	>
																		<Button
																			icon={faTrash}
																			color="transparent"
																			custom_style="border border-COLORACCENTL"
																			color_t="COLORACCENTL"
																			text="Delete review"
																		/>
																	</div>

																	<div
																		class="edit-wrap h-fit w-fit"
																		on:click={() =>
																			navigator.clipboard
																				.writeText(
																					`${window.location.origin}${window.location.pathname}#${review._id}`
																				)
																				.then(() => {
																					toast.push('Copied link to review to clipboard.');
																				})}
																	>
																		<Button
																			icon={faLink}
																			color="COLORACCENTD"
																			color_t="COLORLIGHT-100"
																			text="Copy link to review"
																		/>
																	</div>
																</div>
															</div>{/if}
													</div>
												</div>
											</div>{/if}
									{/each}
								</div>
								<!--- Create a review --->
								{#if user && localStorage.token}
									<div class="review my-4 rounded-md bg-transparent px-4 py-2">
										<div class="flex bg-opacity-100">
											<div
												class="reviewer-pfp flex hidden flex-col items-center justify-start pr-4 lg:block"
											>
												<img
													class="rounded-md object-cover"
													src={user.profile_picture || config['user']['default-image']}
													alt="{user.username}'s avatar"
													on:error={() => {
														user.profile_picture = config['user']['default-image'];
													}}
													style="width: 50px; height: 50px;"
												/>
											</div>
											<form
												class="review-content h-full w-full rounded-md px-1 py-1 text-COLORLIGHT-100"
												action="#"
												on:submit={(event) => handleSubmit(event)}
											>
												<div class="review-wrap mb-4 rounded-md border border-COLORACCENTL">
													<div
														class="text-i-combo flex items-center justify-start font-semibold text-COLORACCENTL"
													>
														<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
														Write a review...
													</div>
													<textarea
														bind:this={newReviewContent}
														name="review"
														class="text-md mx-6 h-full w-full bg-transparent px-2 py-1 font-light text-COLORLIGHT-15 focus:outline-none"
														rows="6"
														placeholder="What's on your mind?"
													/>
												</div>
												<div
													class="star-rating flex select-none flex-row-reverse items-center justify-end py-4 text-2xl font-light"
												>
													{#each [5, 4, 3, 2, 1] as value}
														<div
															class="star flex items-center justify-center text-COLORACCENTL hover:opacity-80"
														>
															<div class="star-wrapper relative">
																<input
																	type="radio"
																	id={value}
																	name="rating"
																	{value}
																	class="absolute z-10 h-8 w-8 cursor-pointer opacity-0"
																	on:change={() => setRating(value)}
																/>
																<label
																	for={value}
																	class="relative z-0"
																	class:active={rating >= value}
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
														color="COLORACCENTD"
														color_t="COLORLIGHT-100"
													/></button
												>
											</form>
										</div>
									</div>{/if}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	.hero-image {
		background-size: cover;
	}

	.star-rating .star-wrapper label {
		color: rgb(var(--COLORACCENTL));
		opacity: 0.5;
	}
	.star-rating .star-wrapper label.active {
		opacity: 1;
	}
</style>

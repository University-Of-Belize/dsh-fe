<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import config from '$lib/config/index';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import IconButton from '$lib/Elements/Buttons/IconButton.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import {
		addToCart,
		updateCartQuantity as APIUpdateCartQuantity,
		emptyCart,
		removeFromCart,
		syncCart
	} from '$lib/Elements/Utility/Cart';
	import type { CartProduct } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import whats from '$lib/vendor/dishout/Whats';
	import { faPrint, faTicket, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	const wants_single_cart = localStorage.wants_single_cart === 'true';
	$: single_cart = $page.url.searchParams.get('single_cart');

	// The cart is an array of Products
	let data: CartProduct[] | [] = [];
	let dataLength: number = data?.length;
	let cartTotal: number = 0.0;

	let g_cart: object[] = []; // The modified cart

	let debounceTimeout: NodeJS.Timeout;
	let error_message: HTMLDivElement;
	let error_available: boolean = false;

	let checkout_card: HTMLDivElement;
	let cart_summary: HTMLDivElement;

	function updateCartQuantity(product: CartProduct, quantity: number, index_: number) {
		APIUpdateCartQuantity(product.product.slug, quantity);
		const index = data.findIndex((p) => p.product._id === product.product._id);
		if (index !== -1) {
			data[index].quantity = quantity;
			// @ts-ignore
			g_cart[index].quantity = quantity;
			calculateTotal(data[index].product.price.$numberDecimal, quantity);
			// @ts-ignore
			document.getElementById(`cartQuantityInput_${index_}`).value = quantity;
		}
	}

	onMount(async () => {
		try {
			if (single_cart && wants_single_cart) {
				localStorage.removeItem('wants_single_cart');
				// We need to return and cancel the cart upload/sync
				return addToCart(
					{ _id: single_cart },
					single_cart,
					1,
					localStorage.selected_variations? JSON.parse(localStorage.selected_variations) : []
				)
					.then(() => {
						localStorage.removeItem('selected_variations');
						setTimeout(() => {
							window.location.reload();
						}, 2000);
					})
					.catch((err) => {
						console.error(err);
						toast.push('Failed to add item to cart.');
					});
			}
			setTimeout(async () => {
				const response = (await fetchWebApi('user/cart', 'GET')) as Response;
				if (response.ok) {
					const r = await response.json(); // Copilot logic (efficiently group the same items together)
					data = r.is.reduce((acc: CartProduct[], curr: CartProduct) => {
						const existingProduct = acc.find((p) => p.product._id === curr.product._id);
						if (existingProduct) {
							if (JSON.stringify(existingProduct.variations) === JSON.stringify(curr.variations)) {
								existingProduct.quantity += curr.quantity;
							} else {
								acc.push(curr);
							}
						} else {
							acc.push(curr);
						}
						return acc;
					}, []);
					dataLength = data?.length;

					// Sync the sorted cart with the server
					syncCart(data);
					// *********** TELEMETRY ******************
					data.forEach((item, index) => {
						g_cart.push({
							item_id: item.product._id,
							item_name: item.product.productName.trim(),
							//affiliation: "Google Merchandise Store",
							//coupon: "SUMMER_FUN",
							discount: 0.0,
							index,
							item_brand: 'UniFood',
							//item_category: "Apparel",
							//item_category2: "Adult",
							//item_category3: "Shirts",
							//item_category4: "Crew",
							//item_category5: "Short sleeve",
							//item_list_id: "related_products",
							item_list_name: item.product.productName.trim(),
							item_variant: item.product.slug.trim(),
							//location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
							price: item.product.price['$numberDecimal'],
							quantity: item.quantity
						});
						calculateTotal(item.product.price.$numberDecimal, item.quantity);
					});
					// console.log(g_cart);
					gtag('event', 'view_cart', {
						currency: 'BZD',
						value: cartTotal,
						//coupon: "SUMMER_SALE",
						items: g_cart
					});
					localStorage.setItem('currentCart', JSON.stringify(g_cart));
					// *********** END TELEMETRY **************

					// console.log(data, dataLength === 0);
				} else {
					toast.push('Failed to fetch cart data.');
					console.error('Failed to fetch cart data.');
				}
			}, 500);
		} catch (error) {
			console.log(error);
		}
	});
	function calculateTotal(price: string, quantity: number) {
		cartTotal += parseFloat(price) * quantity;
	}

	async function checkCoupon(event: Event) {
		event.preventDefault();

		clearTimeout(debounceTimeout);
		error_message.innerText = '';
		// error_graphic.classList.add('hidden');
		// error_graphic.classList.remove('absolute');
		debounceTimeout = setTimeout(async () => {
			const valueArray = Array.from(event.target)
				.filter((el) => el.name)
				.map((el) => el.value);

			const coupon_code = valueArray[0];
			if (coupon_code.trim() === '') {
				error_available = true;
				error_message.innerText = 'Please enter a valid coupon code.';
				return;
			}

			const r = (await fetchWebApi(
				'promo/validate',
				'POST',
				what_is(whats.public.promos, coupon_code)
			)) as Response;
			const res = await r.json();
			if (r.ok) {
				error_available = false;
				localStorage.setItem('discount_code', coupon_code);
			} else {
				error_available = true;
			}
			error_message.innerText = res.message;
		}, 500); // bounce every 500ms
	}
</script>

<svelte:head>
	<title>UniFood | Checkout</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleWhere="/" />
	</div>
	<div class="main-content flex h-full items-center justify-start text-COLORLIGHT-100">
		<div
			class="page-content flex h-full w-full flex-wrap items-start justify-center overflow-auto bg-transparent p-2 py-16 lg:space-x-14"
		>
			<!-- <div class="order-summary mx-2 flex flex-wrap h-fit w-full pb-12 lg:m-0"> -->
			<div bind:this={cart_summary} class="cart_summary block">
				{#if data != undefined && dataLength > 0}
					<div class="mb-8 flex w-full flex-wrap items-center justify-start">
						<div class="block">
							<div class="flex text-2xl font-semibold lg:pb-2">Your Cart</div>
							<div class="flex pb-2 text-xl font-semibold lg:pb-12">Review your order</div>
						</div>
						<div class="flex space-x-2 lg:flex-1 lg:justify-end">
							<div class="btn-wrp" on:click={() => history.back()}>
								<Button text="Go Back" color=COLORDARK-75 color_t="COLORLIGHT-100" icon={undefined} />
							</div>
							<div
								class="btn-wrp"
								on:click={() => {
									emptyCart(null);
									setTimeout(() => {
										window.location.reload();
									}, 3000);
								}}
							>
								<IconButton icon={faTrash} color=COLORDARK-75 color_t="COLORACCENTL" />
							</div>
							<div class="btn-wrp" on:click={() => window.print()}>
								<IconButton icon={faPrint} color=COLORDARK-75 color_t="COLORLIGHT-100" />
							</div>
						</div>
					</div>
				{:else}
					<div class="block">
						<div class="flex text-2xl font-semibold lg:pb-2">Your Cart</div>
					</div>
				{/if}
				<ul class="cart_items flex w-full flex-col flex-wrap space-y-2">
					{#if data != undefined && dataLength > 0}
						{#each data as item, index}
							<li
								class="flex flex-col space-y-3 py-6 text-left text-COLORLIGHT-100 sm:flex-row sm:space-x-5 sm:space-y-0"
							>
								<div class="shrink-0">
									<img
										class="h-24 w-24 max-w-full rounded-lg object-cover"
										src={!item.product.image ?? item.product.image?.trim() == ''
											? config['product-showcase']['default-image']
											: item.product.image}
										on:error={() =>
											(item.product.image = config['product-showcase']['default-image'])}
										alt={item.product.productName ?? ''}
									/>
								</div>

								<div class="relative flex flex-1 flex-col justify-between">
									<div class="sm:col-gap-5 sm:grid sm:grid-cols-2">
										<div class="pr-8 sm:pr-5">
											<p
												class="cursor-pointer text-base font-semibold hover:underline"
												on:click={() => goto(`/product/${item.product.slug}`)}
											>
												{item.product.productName ?? ''}
											</p>
											<p class="mx-0 mb-0 mt-1 text-sm text-gray-400">
												In stock: {item.product.in_stock}
											</p>
										</div>

										<div
											class="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end"
										>
											<p
												class="w-20 shrink-0 text-base font-semibold sm:order-2 sm:ml-8 sm:text-right"
											>
												{(
													parseFloat(item.product.price.$numberDecimal) * item.quantity
												).toLocaleString('en-US', {
													style: 'currency',
													currency: config['checkout']['currency'],
													minimumFractionDigits: 2
												}) ??
													'0.00'.toLocaleString('en-US', {
														style: 'currency',
														currency: config['checkout']['currency'],
														minimumFractionDigits: 2
													})}
											</p>

											<div class="sm:order-1">
												<div class="mx-auto flex h-8 items-stretch text-COLORLIGHT-100">
													<button
														id="cartQuantityIncrease_{index}"
														on:click={() => {
															updateCartQuantity(item, item.quantity - 1, index);
														}}
														class="flex items-center justify-center rounded-l-md border border-gray-700 bg-COLORDARK-75 bg-opacity-80 px-4 text-COLORLIGHT-100 transition hover:opacity-70"
														>-</button
													>
													<input
														id="cartQuantityInput_{index}"
														type="text"
														on:change={() => {
															updateCartQuantity(
																item,
																document.getElementById(`cartQuantityInput_${index}`)?.value ??
																	item.quantity,
																index
															);
														}}
														class="m-0 flex h-full w-16 items-center justify-center border-y border-gray-700 bg-COLORDARK-75 p-0 px-4 text-center text-xs uppercase text-COLORLIGHT-100 transition"
														value={item.quantity ?? '1'}
													/>
													<button
														id="cartQuantityDecrease_{index}"
														on:click={() => {
															updateCartQuantity(item, item.quantity + 1, index);
														}}
														class="flex items-center justify-center rounded-r-md border border-gray-700 bg-COLORDARK-75 bg-opacity-80 px-4 text-COLORLIGHT-100 transition hover:opacity-70"
														>+</button
													>
												</div>
											</div>
										</div>
									</div>

									<div class="absolute right-0 top-0 flex sm:bottom-0 sm:top-auto">
										<button
											type="button"
											on:click={() => {
												removeFromCart(index.toString());
												setTimeout(() => {
													window.location.reload();
												}, 3000);
											}}
											class="flex items-center space-x-2 rounded bg-COLORDARK-50 p-2 text-center text-sm font-light text-COLORLIGHT-50 transition-all duration-200 ease-in-out hover:text-gray-900 focus:shadow"
										>
											<svg
												class="block h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M6 18L18 6M6 6l12 12"
													class=""
												></path>
											</svg>
											<span class="hidden lg:inline">Remove item</span>
										</button>
									</div>
								</div>
							</li>
						{/each}
					{:else if dataLength === 0}
						<div class="space-y-4 font-light">
							<div class="cartEmptyMessage">Your cart is empty. Try adding some items to it!</div>
							<SearchBar nomargin />
						</div>{:else}
						<div class="font-light">There was a problem while loading your shopping cart.</div>{/if}
				</ul>
				<div class="my-4 w-full lg:hidden">
					<Button
						text="Next"
						color=COLORDARK-75
						color_t="COLORLIGHT-100"
						icon={undefined}
						custom_style="w-full justify-center py-4 text-md"
						on:click={() => {
							checkout_card.classList.remove('hidden');
							checkout_card.classList.add('block');
							cart_summary.classList.add('hidden');
							cart_summary.classList.remove('block');
						}}
					/>
				</div>
			</div>

			<!-------- CHECKOUT CARD ------->
			<div
				bind:this={checkout_card}
				class="checkout_card hidden h-fit rounded-lg p-1 lg:block lg:border lg:p-8"
			>
				<div class="cart_controls mb-8 lg:hidden">
					<div class="block">
						<div class="flex text-2xl font-semibold lg:pb-2">Your Cart</div>
						<div class="flex pb-2 text-xl font-semibold lg:pb-12">Review your order</div>
					</div>
					<div class="flex space-x-2 lg:flex-1 lg:justify-end">
						<div class="btn-wrp" on:click={() => history.back()}>
							<Button text="Go Back" color=COLORDARK-75 color_t="COLORLIGHT-100" icon={undefined} />
						</div>
						<div
							class="btn-wrp"
							on:click={() => {
								emptyCart(null);
								setTimeout(() => {
									window.location.reload();
								}, 3000);
							}}
						>
							<IconButton icon={faTrash} color=COLORDARK-75 color_t="COLORACCENTL" />
						</div>
						<div class="btn-wrp" on:click={() => window.print()}>
							<IconButton icon={faPrint} color=COLORDARK-75 color_t="COLORLIGHT-100" />
						</div>
					</div>
				</div>

				<div class="total_amount flex w-full flex-col items-center">
					<div
						class="mb-4 flex w-full items-center justify-start border-b border-COLORLIGHT-100 pb-4 text-2xl font-semibold text-COLORLIGHT-100"
					>
						Total amount
					</div>
					<div class="total_block block w-full items-center">
						<div
							class="total_item flex w-full flex-wrap items-center overflow-clip rounded-xl bg-COLORDARK-25 py-4 text-COLORLIGHT-100"
						>
							<div class="content mx-4 block">
								<div class="product-name font-normal text-xl">Total amount due today</div>
								<div class="product-quantity text-sm font-light text-COLORLIGHT-25">
									Your total amount to pay (excl. discounts)
								</div>
							</div>
							<div class="price mx-4 block font-semibold">
								<div class="product-price">
									{parseFloat(cartTotal).toLocaleString('en-US', {
										style: 'currency',
										currency: config['checkout']['currency'],
										minimumFractionDigits: 2
									}) ??
										parseFloat('0.00').toLocaleString('en-US', {
											style: 'currency',
											currency: config['checkout']['currency'],
											minimumFractionDigits: 2
										})}
								</div>
							</div>
						</div>
						<div class="coupon_checker_section my-6 block w-full items-center">
							<div
								class="text-md mb-4 flex w-full items-center justify-start border-b border-COLORLIGHT-100 pb-4 font-semibold text-COLORLIGHT-100"
							>
								Apply a coupon code
							</div>
							<form
								class="coupon_checker flex h-fit flex-wrap items-center overflow-clip rounded-lg border border-COLORLIGHT-100 bg-COLORDARK-75 text-COLORLIGHT-100"
								action="#check-voucher"
								on:submit={(e) => checkCoupon(e)}
							>
								<TextInput
									icon={faTicket}
									name="coupon_code"
									placeholder="Type in a coupon code and press 'Check'"
									custom_style="text-COLORLIGHT-100 bg-transparent border-0 h-full -mt-0.5"
								/>
								<Button
									text="Check"
									color=COLORDARK-75
									color_t="COLORLIGHT-100"
									type="submit"
									icon={undefined}
									rounding="sm"
									custom_style="py-4"
								/>
							</form>
							<span class="hidden text-emerald-600 text-rose-600" />
							<p
								bind:this={error_message}
								class="mt-2 text-xs {error_available ? 'text-rose-600' : 'text-emerald-600'}"
								id="email-error"
							></p>
						</div>
					</div>
				</div>

				<div style="margin-top: 2rem !important;">
					<a
						href="/product/checkout/payments"
						on:click={() => {
							localStorage.setItem('cart_total', JSON.stringify(cartTotal));
							gtag('event', 'begin_checkout', {
								currency: 'BZD',
								value: cartTotal,
								//coupon: "SUMMER_SALE",
								items: g_cart
							});

							goto('/product/checkout/payments');
						}}
						class="flex items-center justify-center space-x-2 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>
						Proceed to checkout</a
					>
				</div>
			</div>
			<!------ CHECKOUT CARD ---->
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
	/* .page-content {
		 background: linear-gradient(rgba(239, 235, 222, 0.75), rgba(239, 235, 222, 0.75)),
			url('/patterns/checkout.svg'); 
	} */
	.page-content::-webkit-scrollbar {
		display: none;
	}
</style>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import IconButton from '$lib/Elements/Buttons/IconButton.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import { addToCart, emptyCart } from '$lib/Elements/Utility/Cart';
	import config from '$lib/config/settings';
	import type { CartProduct } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';

	const wants_single_cart = localStorage.wants_single_cart ?? false;
	$: single_cart = $page.url.searchParams.get('single_cart');

	// The cart is an array of Products
	let data: CartProduct[] | [] = [];
	let dataLength: number = data?.length;
	let cartTotal: number = 0.0;

	onMount(async () => {
		try {
			if (single_cart && JSON.parse(wants_single_cart)) {
				localStorage.removeItem('wants_single_cart');
				addToCart(single_cart, 1)
					.then(() => {
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
				const response = (await fetchWebApi('v1/user/cart', 'GET')) as Response;
				if (response.ok) {
					const r = await response.json(); // Copilot logic (efficiently group the same items together)
					data = r.is.reduce((acc: CartProduct[], curr: CartProduct) => {
						const existingProduct = acc.find((p) => p.product._id === curr.product._id);
						if (existingProduct) {
							existingProduct.quantity += curr.quantity;
						} else {
							acc.push(curr);
						}
						return acc;
					}, []);
					dataLength = data?.length;
					localStorage.setItem("currentCart", JSON.stringify(data));
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
</script>

<svelte:head>
	<title>UniFood | Checkout</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleWhere="/" />
	</div>
	<div class="main-content flex h-full items-center justify-start text-COLORWHT">
		<div class="page-content flex h-full w-full justify-center overflow-auto bg-transparent py-16">
			<div class="order-summary mx-2 block h-fit w-full pb-12 lg:m-0 lg:w-1/2">
				<div class="mb-8 flex w-full flex-wrap items-center justify-start">
					<div class="block">
						<div class="flex text-2xl font-semibold lg:pb-2">Order Summary / My Cart</div>
						<div class="flex pb-2 text-xl font-semibold lg:pb-12">Review your order</div>
					</div>
					<div class="flex space-x-2 lg:flex-1 lg:justify-end">
						<div class="btn-wrp" on:click={() => history.back()}>
							<Button text="Go Back" color="COLORBLK4" color_t="COLORWHT" icon={undefined} />
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
							<IconButton icon={faTrash} color="COLORBLK4" color_t="COLORHPK" />
						</div>
						<div class="btn-wrp" on:click={() => window.print()}>
							<IconButton icon={faPrint} color="COLORBLK4" color_t="COLORWHT" />
						</div>
					</div>
				</div>

				<div class="cart_items flex w-full flex-col flex-wrap space-y-2">
					{#if data != undefined && dataLength > 0}
						{#each data as item}
							{(() => {
								calculateTotal(item.product.price.$numberDecimal, item.quantity);
								return ''; // Weird hack
							})()}

							<div
								class="flex w-full flex-col items-center rounded-lg border border-COLORHPK bg-COLORBLK2 shadow hover:opacity-90 md:flex-row"
							>
								<img
									class="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
									src={!item.product.image ?? item.product.image?.trim() == ''
										? config['product-showcase']['default-image']
										: item.product.image}
									on:error={() =>
										(item.product.image = config['product-showcase']['default-image'])}
									alt={item.product.productName ?? ''}
								/>
								<div class="flex w-full flex-col justify-between p-4 leading-normal">
									<h5
										class="mb-2 text-2xl font-bold tracking-tight text-COLORWHT hover:underline"
										on:click={() => goto(`/product/${item.product.slug}`)}
									>
										{item.product.productName ?? ''}
									</h5>
									<p class="mb-3 font-normal text-COLORWHT">
										(x{item.quantity ?? ''}) @
										<b
											>{(
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
												})}</b
										>
									</p>
								</div>
							</div>
						{/each}
						<div class="total_amount my-8 flex w-full flex-col items-center">
							<div
								class="my-8 flex w-full items-center justify-start text-2xl font-semibold text-COLORWHT"
							>
								Total Amount
							</div>
							<div class="total_block flex w-full items-center">
								<div
									class="total_item flex w-full items-center rounded-sm bg-COLORBLK3 py-4 text-COLORWHT"
								>
									<div class="content mx-4 block flex-1">
										<div class="product-name font-base text-xl">Total amount due today</div>
										<div class="product-quantity text-sm font-light text-COLORWHT2">
											Your total amount to pay
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
							</div>
						</div>

						<div style="margin-top: 2rem !important;">
							<a
								href="/product/checkout/payments"
								on:click={() => {
									localStorage.setItem('cart_total', JSON.stringify(cartTotal));
									goto('/product/checkout/payments');
								}}
								class="flex items-center justify-center space-x-2 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							>
								Proceed to checkout</a
							>
						</div>
					{:else if dataLength === 0}
						<div class="space-y-4 font-light">
							<div class="cartEmptyMessage">Your cart is empty. Try adding some items to it!</div>
							<SearchBar nomargin />
						</div>{:else}
						<div class="font-light">There was a problem while loading your shopping cart.</div>{/if}
				</div>
			</div>
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

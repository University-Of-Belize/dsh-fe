<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import IconButton from '$lib/Elements/Generic/IconButton.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	import { addToCart, emptyCart } from '$lib/Elements/Utility/Cart';
	import config from '$lib/config/settings';
	import type { CartProduct } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faClone, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
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

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} titleText="Cafe" titleWhere="/" />
	</div>
	<div class="main-content flex items-center justify-start h-full text-COLORWHT">
		<div class="page-content block px-16 py-16 w-full h-full bg-transparent">
			<div class="flex items-center w-full">
				<div class="block">
					<div class="flex text-2xl font-semibold pb-2">Checkout / My Cart</div>
					<div class="flex text-xl font-semibold pb-12">Confirm your order</div>
				</div>
				<div class="flex flex-1 justify-end space-x-2">
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

			<div class="cart_items flex flex-col space-y-2 flex-wrap w-full">
				{#if data != undefined && dataLength > 0}
					{#each data as item}
						{(() => {
							calculateTotal(item.product.price.$numberDecimal, item.quantity);
							return ''; // Weird hack
						})()}
						<div
							class="cart_item bg-COLORBLK2 flex flex-wrap items-center w-full text-COLORWHT rounded-sm"
						>
							<div class="product-image h-full">
								<img
									class="object-cover"
									src={item.product.image ?? config['product-showcase']['default-image']}
									alt={item.product.productName ?? ''}
									width="128px"
								/>
							</div>
							<div class="content block flex-1 mx-4">
								<div
									class="product-name text-xl font-base hover:underline cursor-pointer"
									on:click={() => goto(`/product/${item.product.slug}`)}
								>
									{item.product.productName ?? ''}
								</div>
								<div class="product-quantity font-light text-sm text-COLORWHT">
									(x{item.quantity ?? ''})
								</div>
							</div>
							<div class="price block mx-4 font-semibold">
								<!-- Product price = product_quantity * product_price -->
								<div class="product-price">
									{(parseFloat(item.product.price.$numberDecimal) * item.quantity).toLocaleString(
										'en-US',
										{
											style: 'currency',
											currency: config['checkout']['currency'],
											minimumFractionDigits: 2
										}
									) ??
										'0.00'.toLocaleString('en-US', {
											style: 'currency',
											currency: config['checkout']['currency'],
											minimumFractionDigits: 2
										})}
								</div>
							</div>
						</div>
					{/each}
					<div class="total_amount flex flex-col items-center w-full my-8">
						<div
							class="flex text-2xl font-semibold w-full items-center justify-start text-COLORWHT my-8"
						>
							Total Amount
						</div>
						<div class="total_block flex w-full items-center">
							<div
								class="total_item bg-COLORBLK3 flex items-center w-full text-COLORWHT rounded-sm py-4"
							>
								<div class="content block flex-1 mx-4">
									<div class="product-name text-xl font-base">Total amount due today</div>
									<div class="product-quantity font-light text-sm text-COLORRED">
										Your total amount to pay
									</div>
								</div>
								<div class="price block mx-4 font-semibold">
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
						<div class="pay_now flex w-full justify-start items-center py-4">
							<div class="btn_wrp" on:click={() => goto('/product/checkout/confirmed')}>
								<Button color="COLORHPK" color_t="COLORWHT" text="Queue Now" icon={faClone} />
							</div>
						</div>
					</div>
				{:else if dataLength === 0}
					<div class="font-light space-y-4">
						<div class="cartEmptyMessage">Your cart is empty. Try adding some items to it!</div>
						<SearchBar nomargin />
					</div>{:else}
					<div class="font-light">There was a problem while loading your shopping cart.</div>{/if}
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
	.page-content {
		/* background: linear-gradient(rgba(239, 235, 222, 0.75), rgba(239, 235, 222, 0.75)),
			url('/patterns/checkout.svg'); */
	}
</style>

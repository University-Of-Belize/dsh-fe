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
	import { faClone, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	const wants_single_cart = localStorage.wants_single_cart ?? false;
	$: single_cart = $page.url.searchParams.get('single_cart');

	// The cart is an array of Products
	let data: CartProduct[] | [] = [];
	let dataLength: number = data?.length;
	let cartTotal: number = 0.0;
	let cardEl: HTMLDivElement;
	let inputCardNumber: HTMLInputElement;
	let imageCardNumber: HTMLParagraphElement;
	let inputCVVNumber: HTMLInputElement;
	let imageCVVNumber: HTMLParagraphElement;
	let expirationDate: HTMLInputElement;
	let imageExpDate: HTMLParagraphElement;
	let inputCardName: HTMLInputElement;
	let imageCardName: HTMLParagraphElement;

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

	/*** Card animations and stuff */
	const flipCard = (flip: string) => {
		if (flip === 'flipToRear' && !cardEl.classList.contains('rearIsVisible')) {
			cardEl.classList.add('rearIsVisible');
		}
		if (flip === 'flipToFront' && cardEl.classList.contains('rearIsVisible')) {
			cardEl.classList.remove('rearIsVisible');
		}
		if (flip === 'flip') {
			if (cardEl.classList.contains('rearIsVisible')) {
				cardEl.classList.remove('rearIsVisible');
			} else {
				cardEl.classList.add('rearIsVisible');
			}
		}
	};

	/*** END card stuff*/
</script>

<svelte:head>
	<title>Plattr | Checkout</title>
</svelte:head>

<div class="stub hidden rearIsVisible"></div>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleWhere="/" />
	</div>
	<div class="main-content flex h-full items-center justify-start text-COLORWHT">
		<div class="page-content block h-full w-full bg-transparent px-16 py-16">
			<div class="flex w-full">
				<div class="order-summary mr-8 block flex-1">
					<div class="flex w-full items-center">
						<div class="block">
							<div class="flex pb-2 text-2xl font-semibold">Order Summary / My Cart</div>
							<div class="flex pb-12 text-xl font-semibold">Confirm your order</div>
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

					<div class="cart_items flex w-full flex-col flex-wrap space-y-2">
						{#if data != undefined && dataLength > 0}
							{#each data as item}
								{(() => {
									calculateTotal(item.product.price.$numberDecimal, item.quantity);
									return ''; // Weird hack
								})()}
								<div
									class="cart_item flex w-full flex-wrap items-center rounded-sm bg-COLORBLK2 text-COLORWHT"
								>
									<div class="product-image h-full">
										<img
											class="object-cover"
											src={item.product.image ?? config['product-showcase']['default-image']}
											alt={item.product.productName ?? ''}
											width="128px"
										/>
									</div>
									<div class="content mx-4 block flex-1">
										<div
											class="product-name font-base cursor-pointer text-xl hover:underline"
											on:click={() => goto(`/product/${item.product.slug}`)}
										>
											{item.product.productName ?? ''}
										</div>
										<div class="product-quantity text-sm font-light text-COLORWHT">
											(x{item.quantity ?? ''})
										</div>
									</div>
									<div class="price mx-4 block font-semibold">
										<!-- Product price = product_quantity * product_price -->
										<div class="product-price">
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
										</div>
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
											<div class="product-quantity text-sm font-light text-COLORRED">
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
								<div class="pay_now flex w-full items-center justify-start py-4">
									<div class="btn_wrp" on:click={() => goto('/product/checkout/confirmed')}>
										<Button color="COLORHPK" color_t="COLORWHT" text="Queue Now" icon={faClone} />
									</div>
								</div>
							</div>
						{:else if dataLength === 0}
							<div class="space-y-4 font-light">
								<div class="cartEmptyMessage">Your cart is empty. Try adding some items to it!</div>
								<SearchBar nomargin />
							</div>{:else}
							<div class="font-light">
								There was a problem while loading your shopping cart.
							</div>{/if}
					</div>
				</div>
				<div class="payment-form mr-l block flex-1 text-COLORBLK">
					<form
						class="payment-form flex w-full flex-col-reverse items-center justify-center rounded-sm bg-COLORBLK1 px-6 py-8 text-COLORBLK shadow-md"
					>
						<div class="card-info mt-4 w-1/2 border-t-2 border-COLORBLK2 pt-8">
							<label class="mb-2 block text-sm font-bold text-COLORWHT">Card number</label>
							<input
								type="text"
								class="ring-offset-background focus-visible:ring-ring mb-4 flex h-10 w-full rounded-md border-2 px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								bind:this={inputCardNumber}
								on:input={(event) => {
									//   Remove all non-numeric characters from the input
									const input = event.target.value.replace(/\D/g, '');

									// Add a space after every 4 digits
									let formattedInput = '';
									for (let i = 0; i < input.length; i++) {
										if (i % 4 === 0 && i > 0) {
											formattedInput += ' ';
										}
										formattedInput += input[i];
									}

									inputCardNumber.value = formattedInput;
									imageCardNumber.innerHTML = formattedInput;
								}}
								on:click={() => flipCard('flipToFront')}
								on:input={() => flipCard('flipToFront')}
								maxlength="19"
								placeholder="XXXX XXXX XXXX XXXX"
								value="1234 1234 1234 1234"
							/>
							<div class="mb-4 flex gap-x-2">
								<div class="flex-1">
									<label class="mb-2 block text-sm font-bold text-COLORWHT">Exp. date</label>
									<input
										type="text"
										class="ring-offset-background focus-visible:ring-ring mb-4 flex h-10 w-full rounded-md border-2 px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										bind:this={expirationDate}
										on:input={()=>flipCard('flipToFront')}
										on:input={(event) => {
											
											// Remove all non-numeric characters from the input
											const input = event.target.value.replace(/\D/g, '');

											// Add a '/' after the first 2 digits
											let formattedInput = '';
											for (let i = 0; i < input.length; i++) {
												if (i % 2 === 0 && i > 0) {
													formattedInput += '/';
												}
												formattedInput += input[i];
											}

											expirationDate.value = formattedInput;
											imageExpDate.innerHTML = formattedInput;
										}}
										on:click={() => flipCard('flipToFront')}
										maxlength="5"
										placeholder="MM/YY"
										value="12/24"
									/>
								</div>
								<div class="flex-1">
									<label class="mb-2 block text-sm font-bold text-COLORWHT">CVV</label>
									<input
										type="text"
										class="ring-offset-background focus-visible:ring-ring mb-4 flex h-10 w-full rounded-md border-2 px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										bind:this={inputCVVNumber}
										on:input={() => flipCard('flipToRear')}
										on:input={(event) => {
											// Remove all non-numeric characters from the input
											const input = event.target.value.replace(/\D/g, '');
											inputCVVNumber.value = input;
											imageCVVNumber.innerHTML = input;
										}}
										on:click={() => flipCard('flipToRear')}
										maxlength="3"
										placeholder="456"
										value="456"
									/>
								</div>
							</div>

							<label class="mb-2 block text-sm font-bold text-COLORWHT">Card holder</label>
							<input
								type="text"
								class="ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border-2 px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								bind:this={inputCardName}
								on:input={() => flipCard('flipToFront')}
								on:input={(event) => {
									imageCardName.innerHTML = event.target.value;
								}}
								on:click={() => flipCard('flipToFront')}
								placeholder="John Doe"
								value="John Doe"
							/>
						</div>
						<div class="credit-card w-1/2 overflow-clip">
							<div class="h-56 w-full" style="perspective: 1000px">
								<div
									bind:this={cardEl}
									class="creditCard relative cursor-pointer transition-transform duration-500"
									style="transform-style: preserve-3d"
									on:click={()=>flipCard('flip')}
								>
									<div
										class="absolute m-auto w-full rounded-xl shadow-2xl"
										style="backface-visibility: hidden"
									>
										<img
											src="/assets/checkout/card-front.svg"
											class="relative h-full w-full rounded-xl object-cover"
										/>
										<div class="absolute top-12 w-full px-8 text-white">
											<div class="pt-1">
												<p class="font-light">Card Number</p>
												<p bind:this={imageCardNumber} class="tracking-more-wider h-6 font-medium">
													1234 1234 1234 1234
												</p>
											</div>
											<div class="flex justify-between pt-6">
												<div>
													<p class="font-light">Name</p>
													<p bind:this={imageCardName} class="h-6 font-medium tracking-widest">
														John Doe
													</p>
												</div>
												<div>
													<p class="font-light">Expiry</p>
													<p bind:this={imageExpDate} class="h-6 w-14 font-medium tracking-wider">
														12/24
													</p>
												</div>
											</div>
										</div>
									</div>
									<div
										class="absolute m-auto w-full rounded-xl shadow-2xl"
										style="backface-visibility: hidden; transform: rotateY(180deg)"
									>
										<img
											src="/assets/checkout/card-back.svg"
											class="relative h-full w-full rounded-xl object-cover"
										/>
										<div class="absolute top-8 w-full">
											<div class="mt-12 px-8">
												<p
													bind:this={imageCVVNumber}
													class="ml-auto pl-2 py-2 flex w-14 items-center text-COLORBLK"
												>
													456
												</p>
												<p class="pt-4 mr-2 flex justify-end text-sm font-bold text-COLORWHT">
													security code
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
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

	.rearIsVisible {
		transform: rotateY(-180deg);
	}
</style>

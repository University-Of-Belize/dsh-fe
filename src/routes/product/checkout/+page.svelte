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
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faClone, faLock, faPrint, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import creditCardType from 'credit-card-type';
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
	let inputCVCNumber: HTMLInputElement;
	let imageCVCNumber: HTMLParagraphElement;
	let expirationDate: HTMLInputElement;
	let imageExpDate: HTMLParagraphElement;
	let inputCardName: HTMLInputElement;
	let imageCardName: HTMLParagraphElement;
	let conductingTransaction: boolean = false;
	let transactionConfirm: boolean = false; //@remind Implement soon

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

	/*** Fulfullment of order using credit card */
	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		if (conductingTransaction) return toast.push('Transaction already in progress.');
		if (!transactionConfirm && !conductingTransaction) {
			// Ensures that the user indeed wants to conduct the payment
			return (transactionConfirm = true);
		}
		conductingTransaction = true;
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);
		// console.log(valueArray);

		const r = (await fetchWebApi(
			'v1/order/place',
			'POST',
			what_is(what.public.order, { method: 'card', data: valueArray })
		)) as Response;
		if (!r) return;
		if (!r.ok) {
			const res = await r.json();
			toast.push(`${res.message}`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORRED))'
				}
			});
			setTimeout(() => {
				conductingTransaction = false; // Slight "bounce"
			}, 450);
			return console.error(res);
		}
		const res = await r.json();
		toast.push(`${res.message ?? 'Thank you for your order.'}`);
		setTimeout(() => {
			goto('/admin/dashboard');
		}, 3000);
	};
</script>

<svelte:head>
	<title>Plattr | Checkout</title>
</svelte:head>

<div class="stub rearIsVisible hidden"></div>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleWhere="/" />
	</div>
	<div class="main-content flex h-full items-center justify-start text-COLORWHT">
		<div class="page-content block h-full w-full bg-transparent px-8 py-16 lg:px-16">
			<div class="flex w-full flex-wrap">
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
				<div class="payment-form lg:mr-l block flex-1 text-COLORBLK">
					<form
						class="payment-form flex w-full flex-col-reverse items-center justify-center rounded-sm bg-opacity-10 py-8 text-COLORWHT md:bg-COLORWHT lg:px-6"
						on:submit={(e) => handleSubmit(e)}
					>
						<div
							class="card-info mt-4 w-full border-t-2 border-COLORBLK2 bg-opacity-100 text-COLORWHT lg:w-1/2"
						>
							<div class="mb-4 w-full border-l border-l-COLORGRN bg-COLORBLK1 p-4 text-COLORWHT">
								Local cards are also accepted! This means you can use your local debit card here,
								too!
							</div>
							<label class="mb-2 block text-sm font-bold">Card number</label>
							<input
								required
								type="text"
								name="cc-number"
								autocomplete="cc-number"
								autocorrect="off"
								spellcheck="false"
								class="ring-offset-background focus-visible:ring-ring mb-4 flex h-10 w-full rounded-sm border border-COLORBLK4 bg-transparent px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
							/>
							<div class="expiry-date flex gap-x-2">
								<div class="flex-1">
									<label class="mb-2 block text-sm font-bold">Exp. date</label>
									<input
										required
										type="text"
										name="cc-exp"
										autocomplete="cc-exp"
										autocorrect="off"
										spellcheck="false"
										class="ring-offset-background focus-visible:ring-ring mb-4 flex h-10 w-full rounded-sm border border-COLORBLK4 bg-transparent px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										bind:this={expirationDate}
										on:input={() => flipCard('flipToFront')}
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
									/>
								</div>
								<div class="flex-1">
									<label class="mb-2 block text-sm font-bold">CVC</label>
									<input
										required
										type="text"
										name="cc-csc"
										autocomplete="cc-csc"
										autocorrect="off"
										spellcheck="false"
										class="ring-offset-background focus-visible:ring-ring mb-4 flex h-10 w-full rounded-sm border border-COLORBLK4 bg-transparent px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										bind:this={inputCVCNumber}
										on:input={() => flipCard('flipToRear')}
										on:input={(event) => {
											// Remove all non-numeric characters from the input
											const input = event.target.value.replace(/\D/g, '');
											inputCVCNumber.value = input;
											imageCVCNumber.innerHTML = input.trim() != '' ? input : '&nbsp;';
										}}
										on:click={() => flipCard('flipToRear')}
										maxlength="3"
										placeholder="456"
									/>
								</div>
							</div>
							<div class="card-holder">
								<label class="mb-2 block text-sm font-bold">Card holder</label>
								<input
									required
									type="text"
									name="cc-name"
									autocomplete="cc-name"
									autocorrect="off"
									spellcheck="false"
									class="ring-offset-background focus-visible:ring-ring mb-4 flex h-10 w-full rounded-sm border border-COLORBLK4 bg-transparent px-4 py-1.5 text-lg focus-visible:border-purple-600 focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									bind:this={inputCardName}
									on:input={() => flipCard('flipToFront')}
									on:input={(event) => {
										imageCardName.innerHTML =
											event.target?.value.trim() != '' ? event.target?.value : '&nbsp;';
									}}
									on:click={() => flipCard('flipToFront')}
									placeholder="D'ALESSEO REQUENA"
								/>
							</div>
							<div class="mt-6 flex w-full flex-col items-center space-x-2 text-center">
								<div class="pay_now flex w-full basis-full items-center justify-start py-4">
									<div class="stub hidden animate-pulse"></div>
									<button
										class="btn_wrp w-full {conductingTransaction ? 'animate-pulse' : ''}}"
										type="submit"
										disabled={conductingTransaction}
									>
										<Button
											color="COLORBLE"
											color_t="COLORWHT"
											text={transactionConfirm ? 'Confirm Payment?' : 'Pay now'}
											icon={faLock}
											disabled={conductingTransaction}
											disabled_text="Please wait for the current transaction to complete."
											custom_style="w-full justify-center items-center {transactionConfirm
												? 'bg-COLORRED'
												: ''}"
										/>
									</button>
								</div>
								<div class="flex w-full items-center justify-between">
									<div class="pay_later flex w-full items-center justify-start py-4">
										<button
											disabled
											title="Not implemented yet"
											class="btn_wrp"
											on:click={() => {
												localStorage.setItem('payment_data', JSON.stringify({ method: 'pickup' }));
												setTimeout(() => {
													goto('/product/checkout/confirmed');
												}, 3000);
											}}
										>
											<Button
												color="COLORHPK"
												color_t="COLORWHT"
												text="Pay in-person"
												disabled
												icon={faClone}
												custom_style="w-full justify-center items-center"
											/>
										</button>
									</div>
									<div class="pay_with_credit flex w-full items-center justify-start py-4">
										<button
											disabled={conductingTransaction}
											class="btn_wrp w-full"
											on:click={() => {
												conductingTransaction = true;
												localStorage.setItem('payment_data', JSON.stringify({ method: 'credit' }));
												setTimeout(() => {
													goto('/product/checkout/confirmed');
												}, 3000);
											}}
										>
											<Button
												color="COLORPNK"
												color_t="COLORWHT"
												text="Pay with credit"
												icon={faClone}
												disabled={conductingTransaction}
												disabled_text="Please wait for the current transaction to complete."
												custom_style="w-full justify-center items-center"
											/>
										</button>
									</div>
								</div>
							</div>
							<div
								class="flex items-center justify-between space-x-2 rounded-sm border border-COLORWHT5 bg-COLORBLK pl-4 text-sm text-COLORWHT1"
							>
								<div>Secure payment processing<br />powered by</div>
								<a href="https://onelink.bz" target="_blank" class="bg-COLORBLK1 px-4 py-4">
									<img
										src="/assets/checkout/brands/one-link.svg"
										width="50px"
										class="cursor-pointer hover:opacity-75"
									/></a
								>
							</div>
						</div>
						<div
							class="credit-card w-full select-none lg:w-1/2"
							on:mouseenter={() => flipCard('flip')}
							on:mouseleave={() => flipCard('flip')}
						>
							<div class="h-60 w-full" style="perspective: 1000px">
								<div
									bind:this={cardEl}
									class="creditCard relative cursor-pointer font-mono transition-transform duration-500"
									style="transform-style: preserve-3d"
									on:click={() => flipCard('flip')}
								>
									<div
										class="absolute m-auto w-full rounded-xl shadow-2xl"
										style="backface-visibility: hidden"
									>
										<img
											src="/assets/checkout/card-front.svg"
											class="relative h-full w-full rounded-xl object-cover"
										/>
										<div class="absolute top-28 w-full overflow-clip px-8 text-white">
											<div class="pt-1">
												<!-- <p class="font-light">Card Number</p> -->
												<p
													bind:this={imageCardNumber}
													class="tracking-more-wider h-6 text-xl font-medium"
												>
													1234 1234 1234 1234
												</p>
											</div>
											<div class="block pt-2 text-sm font-normal">
												<div class="flex items-center justify-start space-x-2 pt-1">
													<p class="text-xs font-light">VALID<br />FROM</p>
													<p bind:this={imageExpDate} class="w-14 font-medium tracking-wider">
														12/24
													</p>
												</div>
												<div class="flex items-center justify-between">
													<p bind:this={imageCardName} class="pt-2 font-medium tracking-widest">
														D'ALESSEO REQUENA
													</p>
													<p class="absolute right-8 mb-4 font-light">
														<img
															src="/assets/checkout/brands/{creditCardType(
																inputCardNumber?.value ?? ''
															)[0]?.type ?? 'question'}.svg"
															width="50px"
														/>
													</p>
												</div>
											</div>
										</div>
									</div>
									<div
										class="absolute m-auto w-full rounded-xl bg-opacity-100 shadow-2xl"
										style="backface-visibility: hidden; transform: rotateY(180deg)"
									>
										<img
											src="/assets/checkout/card-back.svg"
											class="relative h-full w-full rounded-xl object-cover"
										/>
										<div class="absolute top-8 w-full">
											<div class="mt-12 px-8">
												<b>
													<p
														bind:this={imageCVCNumber}
														class="ml-auto flex w-14 items-center py-2 pl-2 text-COLORBLK"
													>
														456
													</p></b
												>
												<p class="mr-2 flex justify-end pt-4 text-sm font-bold text-COLORWHT">
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

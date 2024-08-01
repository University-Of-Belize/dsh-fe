<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import type { CartProduct } from '$lib/types/Product';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faLock } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { v4 } from 'uuid';

	import config from '$lib/config/index';
	import creditCardType from 'credit-card-type';

	// The cart is an array of Products
	let data: CartProduct[] | [] = [];
	let dataLength: number = data?.length;
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
	let transactionConfirm: boolean = false;
	let cartTotal = localStorage.cart_total;
	let currentCart = localStorage.currentCart;
	let cardPayment: boolean = false; // @remind Change to `true` after one month
	// let paymentMethod = 'card'; // @remind Uncomment after one month
	let paymentMethod = 'credit';

	let checkout_card: HTMLDivElement;
	let cart_summary: HTMLDivElement;

	/*** Card animations and stuff */
	function flipCard(flip: string) {
		if (flip === 'flipToRear' && !cardEl.classList.contains('rearIsVisible')) {
			cardEl.classList.add('rearIsVisible');
			cardEl.style.setProperty('transform', 'rotateY(-180deg)');
		}
		if (flip === 'flipToFront' && cardEl.classList.contains('rearIsVisible')) {
			cardEl.classList.remove('rearIsVisible');
			cardEl.style.removeProperty('transform');
		}
		if (flip === 'flip') {
			if (cardEl.classList.contains('rearIsVisible')) {
				cardEl.classList.remove('rearIsVisible');
				cardEl.style.removeProperty('transform');
			} else {
				cardEl.classList.add('rearIsVisible');
				cardEl.style.setProperty('transform', 'rotateY(-180deg)');
			}
		}
	}

	/*** END card stuff*/

	/*** Order fulfillment using credit card */
	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		if (conductingTransaction) return toast.push('Transaction already in progress.');
		if (!transactionConfirm && !conductingTransaction) {
			// Ensures that the user indeed wants to conduct the payment
			return (transactionConfirm = true);
		}
		conductingTransaction = true;

		// Check the current payment method
		switch (paymentMethod) {
			case 'credit': {
				localStorage.setItem(
					'payment_data',
					JSON.stringify({
						method: 'credit',
						toDeduct: cartTotal,
						discount_code: localStorage.discount_code ?? ''
					})
				);
				setTimeout(() => {
					goto('/product/checkout/confirmed');
				}, 3000);
				return;
			}
		}
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);
		// console.log(valueArray);

		const r = (await fetchWebApi(
			'order/place',
			'POST', // "silent" errors
			what_is(what.public.order, { method: 'card', data: valueArray }),
			undefined,
			undefined,
			true
		)) as Response;
		if (!r) return;
		if (!r.ok) {
			const res = await r.json();
			toast.push(`${res.message}`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
				}
			});
			setTimeout(() => {
				conductingTransaction = false; // Slight "bounce"
			}, 450);
			return console.error(res);
		}
		const res = await r.json();
		toast.push(`${res.message ?? 'Thank you for your order.'}`);

		// *********** TELEMETRY ******************
		gtag('event', 'add_payment_info', {
			currency: 'BZD',
			value: cartTotal,
			//coupon: "SUMMER_SALE",
			payment_type: paymentMethod == 'card' ? 'Credit Card' : 'Prepaid',
			items: JSON.parse(currentCart)
		});

		gtag('event', 'purchase', {
			// Learn more: https://support.google.com/analytics/answer/12313109
			transaction_id: `t_${v4()}`,
			currency: 'BZD',
			value: cartTotal,
			tax: 0,
			shipping: 0,
			//coupon: "SUMMER_SALE",
			items: JSON.parse(currentCart)
		});

		// *********** END TELEMETRY **************

		setTimeout(() => {
			goto('/admin/dashboard');
		}, 3000);
	};
</script>

<svelte:head>
	<title>UniFood | Checkout / Payment Control</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleWhere="/" />
	</div>
	<div class="main-content flex h-full items-center justify-start text-COLORLIGHT-100">
		<div
			class="page-content flex h-full w-full flex-wrap items-start justify-center overflow-auto bg-transparent p-2 py-16 lg:space-x-14"
		>
			<div bind:this={cart_summary} class="block text-center">
				<div class="mb-8 block">
					<div class="flex pb-2 text-2xl font-semibold">Checkout</div>
					<div class="flex text-xl font-light lg:pb-12">Confirm your payment</div>
				</div>
				<form class="grid grid-cols-1 gap-2 text-left sm:w-96 w-60">
					
					<!-- @remind REMOVE 'select-none' and 'pointer-events-none' AFTER 1 MONTH -->
					<div
						class="relative w-full select-none pointer-events-none opacity-50"
						on:click={() => {
							cardPayment = true;
							paymentMethod = 'card';
						}}
					>
						<input
							class="peer hidden"
							id="credit_debit"
							type="radio"
							name="payment_method"
							checked
						/>
						<!-- <div class="absolute -z-10 w-full" style="height: 40%;">
						<span
							class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-4 border-gray-300 bg-white peer-checked:border-indigo-500"
						></span>

					</div> -->
						<label
							class="flex cursor-pointer select-none flex-col rounded-lg border border-gray-300 p-4 peer-checked:border peer-checked:border-indigo-700"
							for="credit_debit"
						>
							<span class="text-xs font-semibold uppercase">DIRECT</span>
							<span class="mt-2 text-xl font-bold">Credit/Debit Card</span>
							<ul class="mt-2 text-sm">
								<li>Pay with your credit or debit card</li>
								<li>Local and international cards are accepted</li>
							</ul>

							<!-- on:mouseenter={() => flipCard('flip')}
							on:mouseleave={() => flipCard('flip')} -->
							<div
								class="credit-card pointer-events-none mb-6 mt-4 hidden h-fit w-full select-none lg:block"
							>
								<div class="w-full" style="perspective: 1000px;">
									<div
										bind:this={cardEl}
										class="creditCard relative cursor-pointer font-mono transition-transform duration-500"
										style="transform-style: preserve-3d"
										on:click={() => flipCard('flip')}
									>
										<div
											class="w-full rounded-xl border border-COLORLIGHT-100 pb-8 pt-14 opacity-100 shadow-md"
											style="backface-visibility: hidden"
										>
											<div class="w-full overflow-clip px-8 text-COLORLIGHT-100">
												<div class="pt-1">
													<!-- <p class="font-light">Card Number</p> -->
													<p
														bind:this={imageCardNumber}
														class="tracking-more-wider h-6 font-medium lg:text-xl"
													>
														1234 1234 1234 1234
													</p>
												</div>
												<div class="block pt-2 text-sm font-normal">
													<div class="flex items-center justify-start space-x-2 pt-1">
														<p class="text-xs font-light">VALID<br />TO</p>
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
											class="absolute w-full rounded-xl border border-COLORLIGHT-100 pb-8 pt-12 opacity-100 shadow-2xl"
											style="backface-visibility: hidden; transform: rotateY(180deg); top: 0;"
										>
											<div class="block w-full">
												<div class="mt-8 px-8">
													<b>
														<p
															bind:this={imageCVCNumber}
															class="ml-auto flex w-14 items-center py-2 pl-2 text-COLORLIGHT-100"
														>
															456
														</p></b
													>
													<p class="mr-2 flex justify-end pt-4 text-sm font-bold text-COLORLIGHT-100">
														security code
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</label>
					</div>
					<div
						class="relative w-full"
						on:click={() => {
							cardPayment = false;
							paymentMethod = 'credit';
						}}
					>
						<input class="peer hidden" id="pre_paid" type="radio" name="payment_method" />
						<!-- <span
							class="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-4 border-gray-300 bg-white peer-checked:border-indigo-500"
						></span> -->
						<label
							class="flex cursor-pointer select-none flex-col rounded-lg border border-gray-300 p-4 peer-checked:border peer-checked:border-indigo-700"
							for="pre_paid"
						>
							<span class="text-xs font-semibold uppercase">PREPAID</span>
							<span class="mt-2 text-xl font-bold">Virtual Currency</span>
							<ul class="mt-2 text-sm">
								<li>Pay with your account's pre-paid balance</li>
							</ul>
						</label>
					</div>
				</form>

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

			<div
				bind:this={checkout_card}
				class="checkout_card hidden h-fit rounded-lg p-1 lg:block lg:border lg:p-8"
			>
				<form on:submit={(e) => handleSubmit(e)}>
					<div class="total_amount flex w-full flex-col items-center">
						<div
							class="mb-4 flex w-full items-center justify-start border-b border-COLORLIGHT-100 pb-4 text-2xl font-semibold text-COLORLIGHT-100"
						>
							Order summary
						</div>

						<div class="total_block flex w-full flex-col items-center">
							<!-- Credit card form -->
							{#if cardPayment}
								<div class="my-4 block">
									<label for="card-holder" class="mb-2 mt-4 block text-sm font-medium"
										>Card Holder</label
									>
									<div class="relative text-black">
										<input
											required
											type="text"
											id="card-holder"
											name="card-holder"
											autocomplete="cc-name"
											autocorrect="off"
											spellcheck="false"
											class="w-full rounded-sm border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
											bind:this={inputCardName}
											on:input={() => flipCard('flipToFront')}
											on:input={(event) => {
												imageCardName.innerHTML =
													event.target?.value.trim() != ''
														? event.target?.value.toUpperCase()
														: '&nbsp;';
											}}
											on:click={() => flipCard('flipToFront')}
											placeholder="D'ALESSEO REQUENA"
										/>
										<div
											class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4 text-gray-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
												/>
											</svg>
										</div>
									</div>
									<label for="card-no" class="mb-2 mt-4 block text-sm font-medium"
										>Card Details</label
									>
									<div class="inline space-y-1 text-black lg:space-y-2">
										<div class="relative flex-shrink-0">
											<input
												required
												type="text"
												id="card-no"
												name="card-no"
												autocomplete="cc-number"
												autocorrect="off"
												spellcheck="false"
												class="w-full rounded-sm border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
												placeholder="xxxx-xxxx-xxxx-xxxx"
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
											/>
											<div
												class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3"
											>
												<svg
													class="h-4 w-4 text-gray-400"
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="currentColor"
													viewBox="0 0 16 16"
												>
													<path
														d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z"
													/>
													<path
														d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z"
													/>
												</svg>
											</div>
										</div>
										<input
											required
											type="text"
											name="credit-expiry"
											autocomplete="cc-exp"
											autocorrect="off"
											spellcheck="false"
											class="w-full rounded-sm border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500 lg:w-fit"
											placeholder="MM/YY"
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
										/>
										<input
											required
											type="text"
											name="credit-cvc"
											autocomplete="cc-csc"
											autocorrect="off"
											spellcheck="false"
											class="w-full flex-shrink-0 rounded-sm border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500 lg:w-fit"
											placeholder="CVC"
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
										/>
									</div>
								</div>
							{/if}
							<!--- Credit card form ENDS -->
							<div
								class="total_item flex w-full flex-wrap items-center overflow-clip rounded-lg bg-COLORDARK-25 py-4 text-COLORLIGHT-100"
							>
								<div class="content mx-4 block w-full">
									<div class="product-name font-normal text-xl">Total amount due today</div>
									<div class="product-quantity text-sm font-light text-COLORWHT2">
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
						</div>
					</div>

					<div style="margin-top: 2rem !important;">
						<button
							disabled={cartTotal ? conductingTransaction : true}
							title={cartTotal ? 'Pay with a credit/debit card' : 'Disabled reason: Cart is empty'}
							class="btn_wrp w-full {conductingTransaction ? 'animate-pulse' : ''}}"
							type="submit"
						>
							<Button
								color="COLORACCENTL"
								color_t="COLORLIGHT-100"
								text={transactionConfirm ? 'Confirm Payment?' : 'Pay now'}
								icon={faLock}
								disabled={cartTotal ? conductingTransaction : true}
								disabled_text="Please wait for the current transaction to complete."
								custom_style="w-full justify-center items-center {transactionConfirm
									? 'bg-COLORACCENTL'
									: ''}"
							/>
						</button>
					</div>
				</form>
				<div
					class="mt-8 flex items-center justify-between space-x-2 overflow-clip rounded-xl border border-COLORLIGHT-100 bg-COLORDARK-100 pl-4 text-sm text-COLORLIGHT-15"
				>
					<div>Secure payment processing<br />powered by</div>
					<a href="https://onelink.bz" target="_blank" class="bg-COLORDARK-75 px-4 py-4">
						<img
							src="/assets/checkout/brands/one-link.svg"
							width="50px"
							class="cursor-pointer hover:opacity-75"
						/></a
					>
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

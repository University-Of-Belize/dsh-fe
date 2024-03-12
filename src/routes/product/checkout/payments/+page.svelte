<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import type { CartProduct } from '$lib/types/Product';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faClone, faLock } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';

	import config from '$lib/config/settings';
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
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);
		// console.log(valueArray);

		const r = (await fetchWebApi(
			'v1/order/place',
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
	<title>UniFood | Checkout / Payment Control</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleWhere="/" />
	</div>
	<div class="main-content flex h-full items-center justify-start text-COLORWHT">
		<div
			class="page-content mx-2 flex h-full w-full justify-center overflow-auto bg-transparent py-16 lg:m-0 lg:px-16"
		>
			<div class="mb-8 block w-full lg:w-1/2">
				<div class="block w-full">
					<div class="flex pb-2 text-2xl font-semibold">Checkout</div>
					<div class="flex text-xl font-light lg:pb-12">Confirm your payment</div>
				</div>
				<div class="payment-form block text-COLORBLK">
					<form
						class="payment-form flex w-full flex-col-reverse items-center justify-center rounded-sm bg-opacity-10 py-8 text-COLORWHT md:bg-COLORWHT"
						on:submit={(e) => handleSubmit(e)}
					>
						<div
							class="card-info mt-4 w-full border-t-2 border-COLORBLK2 bg-opacity-100 text-COLORWHT lg:w-1/2"
						>
							<div class="mb-4 w-full border-l border-l-COLORGRN bg-COLORBLK1 p-4 text-COLORWHT">
								Local cards are also accepted! This means you can use your local debit card here,
								too!
							</div>
							<label class="mb-2 block text-sm font-light">Card number</label>
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
									<label class="mb-2 block text-sm font-light">Exp. date</label>
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
									<label class="mb-2 block text-sm font-light">CVC</label>
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
								<label class="mb-2 block text-sm font-light">Card holder</label>
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
							<div class="mt-6 flex w-full flex-col items-center text-center lg:space-x-2">
								<div>
									Note that you will be paying <b
										>{cartTotal
											? parseFloat(cartTotal).toLocaleString('en-US', {
													style: 'currency',
													currency: config['checkout']['currency'],
													minimumFractionDigits: 2
												}) ??
												parseFloat('0.00').toLocaleString('en-US', {
													style: 'currency',
													currency: config['checkout']['currency'],
													minimumFractionDigits: 2
												})
											: (() => {
												toast.push('Add some items to your cart first.');
												goto('/product/checkout');
												})()}</b
									>
								</div>
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
												text="Pay F2F"
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
												localStorage.setItem(
													'payment_data',
													JSON.stringify({ method: 'credit', toDeduct: cartTotal })
												);
												setTimeout(() => {
													goto('/product/checkout/confirmed');
												}, 3000);
											}}
										>
											<Button
												color="COLORPNK"
												color_t="COLORWHT"
												text="Pay with VC"
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
						<!-- Credit card graphic -- hide on small screens, show on large screens -->
						<div
							class="flex w-full bg-opacity-100 pb-8 text-xl font-semibold text-COLORWHT lg:hidden"
						>
							Pay below using Credit/Debit or your account's Virtual Currency
						</div>
						<div
							role="content"
							class="credit-card hidden h-fit w-full select-none lg:block lg:w-1/2"
							on:mouseenter={() => flipCard('flip')}
							on:mouseleave={() => flipCard('flip')}
						>
							<div
								class="w-full"
								style="width: 21.7375vw; perspective: 1000px; padding-bottom: 15vw;"
							>
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
										<div
											class="absolute w-full overflow-clip px-8 text-white"
											style="top: 7.03125vw;"
										>
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
										class="absolute m-auto w-full rounded-xl bg-opacity-100 shadow-2xl"
										style="backface-visibility: hidden; transform: rotateY(180deg)"
									>
										<img
											src="/assets/checkout/card-back.svg"
											class="relative h-full w-full rounded-xl object-cover"
										/>
										<div class="absolute w-full" style="top: 6vh;">
											<div class="mt-12 px-8">
												<b>
													<p
														bind:this={imageCVCNumber}
														class="ml-auto flex w-14 items-center py-2 pl-2 text-white"
													>
														456
													</p></b
												>
												<p class="mr-2 flex justify-end pt-4 text-sm font-bold text-white">
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
	.page-content::-webkit-scrollbar {
		display: none;
	}
</style>

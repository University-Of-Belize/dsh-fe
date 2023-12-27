<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import DateTimeInput from '$lib/Elements/Generic/DateTimeInput.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import Select from '$lib/Elements/Generic/Select2.svelte';
	import TextInput from '$lib/Elements/Generic/TextInput.svelte';
	import { getPromo } from '$lib/Elements/Utility/Promo';
	import { getLocaleDateTime } from '$lib/Elements/Utility/time';
	import config from '$lib/config/settings';
	import type { Order } from '$lib/types/Order';
	import type { Promo } from '$lib/types/Promo';
	import type { User } from '$lib/types/User';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faCalendar,
		faCheck,
		faClone,
		faCog,
		faCopy,
		faDollarSign,
		faQuestionCircle,
		faSave,
		faShare,
		faTag,
		faTrash,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import _ from 'lodash';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import ProductPill from './../../../../lib/Elements/Generic/ProductPill.svelte';
// What is what?
	import { userDeleteOrderProduct } from '$lib/Elements/Utility/Order';
	import type { CartProduct } from '$lib/types/Product';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // User data
	let data: Order[]; // List of orders
	let data_raw: Order[]; // Order data (raw, ungrouped)
	let promos: Promo['code'][];
	let currentAction: [number, string] = [-1, '']; // Not selected
	let drawerOpenBy: number;
	async function catchAll() {
		// Do not run if there is no product_id provided

		const res = (await fetchWebApi('v1/admin/order/manage', 'GET')) as Response;
		const r = await res.json();
		if (res.status === 403) {
			localStorage.removeItem('token');
			localStorage.removeItem('user_id');
			localStorage.removeItem('user');
			toast.push('You need to log in.');
			goto('/auth/login');
		}
		if (!res.ok) {
			return toast.push(r.message);
		}

		// data = r.is; // Rizz
		data_raw = r.is; // Rizzler
		// Group duplicate products together
		// Copilot logic (very efficient it says, lol)
		let copy = _.cloneDeep(r.is);
		let productsMap = new Map();

		r.is.forEach((order: Order, i: number) => {
			if (copy[i].products.length != 0) {
				// Clear (if not already)
				copy[i].products = [];
			}

			order.products.forEach((product: CartProduct) => {
				const productId = product.product?._id;
				if (productsMap.has(productId)) {
					const existingProduct = productsMap.get(productId);
					existingProduct.quantity += product.quantity;
				} else {
					productsMap.set(productId, { ...product });
				}
			});

			copy[i].products = Array.from(productsMap.values());
			productsMap.clear();
		});
		data = copy;
		// Filter data array
		// @ts-ignore
		// data = data.filter((element) => element._id === product_id);
		// Flatten
		// @ts-ignore
		// data = data[0];
		// @ts-ignore
		if (data.length === 0) {
			toast.push('Nothing here to see! 👻');
		}
		console.log(data);
	}

	onMount(async () => {
		try {
			await catchAll();
			if (staff) {
				const pR = await getPromo();
				promos = pR.is.map((item: Promo) => item.code);
				console.log(promos); // This will log an array of codes
			}
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while loading the order page: ${error.message}`
			);
		}
	});

	const getId = (id: string) => document.getElementById(id);
	function go_order(action: number, orderId: string) {
		switch (action) {
			case 1: // Accept
				toast.push('You accepted this order.');
				getId(`order-${orderId}`)?.classList.remove('border-red-300'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.remove('border-COLORYLW'); // @ts-ignore
				if (drawerOpenBy != 1) {
					// Keepthe drawer open as long as we're switching tabs
					getId(`pulldown-${orderId}`)?.classList.add('hidden'); // @ts-ignore
					drawerOpenBy = 1;
				}
				getId(`pulldown-${orderId}`)?.classList.toggle('hidden'); // @ts-ignore
				getId(`pulldown-content-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
				getId(`modify-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`user-modify-content-${orderId}`)?.classList.add('hidden');
				getId(`title-${orderId}`).innerHTML =
					'You <b class="font-normal text-COLORWHT">accepted</b> this order.';
				currentAction = [action, orderId];
				break;
			case 2: // Decline
				toast.push(staff ? 'You rejected this order.' : "You're about to delete this order.");
				getId(`order-${orderId}`)?.classList.remove('border-COLORYLW'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.add('border-red-300'); // @ts-ignore
				if (drawerOpenBy != 2) {
					// Keep the drawer open as long as we're switching tabs
					getId(`pulldown-${orderId}`)?.classList.add('hidden'); // @ts-ignore
					drawerOpenBy = 2;
				}
				getId(`pulldown-${orderId}`)?.classList.toggle('hidden'); // @ts-ignore
				getId(`pulldown-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`modify-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`user-modify-content-${orderId}`)?.classList.add('hidden');
				getId(`title-${orderId}`).innerHTML = staff
					? 'You <b class="font-normal text-COLORHPK">rejected</b> this order.'
					: 'Are you <b class="font-normal text-COLORHPK underline">absolutely sure</b> you want to remove this order?';
				currentAction = [action, orderId];
				break;
			case 3: // Modify
				toast.push("You're altering this order.");
				// @ts-ignore
				getId(`title-${orderId}`).innerHTML =
					'You\'re <b class="font-normal text-COLORYLW">altering</b> this order.';
				getId(`order-${orderId}`)?.classList.remove('border-red-300'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.add('border-COLORYLW'); // @ts-ignore
				if (drawerOpenBy != 3) {
					// Keep the drawer open as long as we're switching tabs
					getId(`pulldown-${orderId}`)?.classList.add('hidden'); // @ts-ignore
					drawerOpenBy = 3;
				}
				getId(`pulldown-${orderId}`)?.classList.toggle('hidden'); // @ts-ignore
				if (staff) {
					getId(`pulldown-content-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
					getId(`modify-content-${orderId}`)?.classList.remove('hidden');
					getId(`user-modify-content-${orderId}`)?.classList.remove('hidden');
				} else {
					getId(`pulldown-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
					getId(`modify-content-${orderId}`)?.classList.add('hidden');
					getId(`user-modify-content-${orderId}`)?.classList.remove('hidden');
				}
				currentAction = [action, orderId];
				break;
			default: // WTF
				toast.push('The parameters provided are incorrect.');
		}
	}

	async function processRequest(event: Event) {
		event.preventDefault();
		console.log('Processing request...');
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		// If we're not deleting
		if (currentAction[0] !== 2) {
			// Convert back to timestamps because, we need those.
			valueArray[valueArray.length - 3] = Date.parse(valueArray[valueArray.length - 3]) / 1000;
		} else {
			valueArray[1] = null; // JSON parseable value
		}
		console.log(valueArray);
		switch (
			currentAction[0] // The action
		) {
			case 1: // Accept
				// Hide this so that we can't use the accept button anymore
				getId(`pulldown-${currentAction[1]}`)?.classList.add('hidden');
			case 2: // Decline
				// Hide this because it's bugged
				getId(`pulldown-${currentAction[1]}`)?.classList.add('hidden');
			case 3: // Modify
				const r = (await fetchWebApi(
					'v1/admin/order/manage',
					'POST',
					what_is(what.private.order, [
						currentAction[0] === 1
							? 'a'
							: currentAction[0] === 2
							? 'd'
							: currentAction[0] === 3
							? 'm'
							: '?', // Ternary statement to map 'a' for ACCEPT /
						// 'd' for DELETE / 'm' for MODIFY
						currentAction[1], // Order ID
						JSON.parse(valueArray[1]), // The price (We use JSON.parse to turn the string back into a 'real' number/float)
						valueArray[2] === 'placeholder' ? null : valueArray[2], // The promotion
						valueArray[0] // The ETA
					]) // Lol
				)) as Response;
				if (!r.ok) {
					try {
						const res = await r.json();
						toast.push(res.message);
					} catch (error) {
						toast.push(`Failed: ${error}`);
					}
					return;
				}
				const res = await r.json();
				toast.push(
					currentAction[0] === 1
						? 'Order accepted.'
						: currentAction[0] === 2
						? res.is
						: currentAction[0] === 3
						? 'Update successfully issued.'
						: 'Update successfully issued.'
				);
				catchAll(); // Issue UI update
				break;

			default: // What?
				break;
		}
	}
</script>

<div class="stub hidden border border-" />
<main class="w-full h-screen overflow-hidden">
	<div class="navigation w-full z-20">
		<Navigation
			transparency={5}
			search={true}
			titleText="Cafe {staff
				? ''
				: "<div class='font-bold pl-1 overflow-hidden'>| Dashboard</div>"}"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex items-center justify-start h-full text-COLORWHT overflow-hidden">
		<div
			class="drawer hidden lg:block bg-COLORWHT4 bg-opacity-20 px-4 py-2 flex-col justify-start h-screen w-full lg:w-1/4 overflow-auto"
			bind:this={navDrawer}
		>
			<div class="section py-6 bg-opacity-100">
				<div class="title font-semibold pb-5">My Account</div>
				<div
					on:click={async () => {
						await goto(`/admin/dashboard/user/manage?user_id=${localStorage.user_id}`);
					}}
				>
										<Button
						icon={faCog}
						color="COLORBLK3"
						text="My account settings"
						color_t="COLORWHT"
						custom_style="w-full"
					/>
				</div>
			</div>
			<DashList {staff} />
		</div>
		<div class="content block px-16 py-16 w-full h-full bg-transparent overflow-auto pb-40">
			<div class="flex-header flex items-start w-full flex-wrap">
				<div class="block">
					<div class="flex text-2xl font-semibold pb-2">What's Queued?</div>
					<div class="flex text-xl font-semibold pb-12">
						{staff ? 'Accept, decline and modify orders' : 'View and modify your open orders.'}
					</div>
				</div>
				<div class="flex flex-1 justify-end text-2xl font-semibold pb-2">
					Open Orders: {data ? data.length : '--'}
				</div>
			</div>
			<div class="flex flex-wrap flex-col-reverse w-full">
				{#if data != undefined}
					{#if data.length === 0}
						<div class="font-light">No orders are currently available to manage.</div>
					{/if}
					{#if !isNaN(user.id)}
						<!-- This will never run if there are no orders -->
						{#each data as order, index}
							<div class="user_wrap w-full">
								<div class="ctg_wrp w-full" />
							</div>

							<div
								id="order-{order._id}"
								class="orderPane flex flex-col lg:flex-row justify-start w-full bg-COLORBLK1 py-4 px-4 rounded-sm border border-COLORWHT3 my-8"
							>
								<div class="editGroup flex flex-col pb-8 px-4 w-full">
									<div class="flex space-x-4">
										<div class="pfp">
											<img
												class="rounded-md"
												src={order.order_from
													? order.order_from.profile_picture
														? order.order_from.profile_picture
														: config.user['default-image']
													: config.user['default-image']}
												alt="Avatar"
												style="width: 50px; height: 50px;"
											/>
										</div>
										<div class="block">
											<div class="flex">
												<div
													class="flex flex-wrap text-lg lg:text-2xl text-COLORWHT font-medium space-x-2"
												>
													<div class="g-wrap">
														{order.order_from
															? order.order_from.username === user.username
																? 'You'
																: '@' + order.order_from.username
															: '@anonymous'}
													</div>
													<div class="font-semibold">issued an order for</div>
												</div>
											</div>
											<div class="text-base text-COLORWHT font-semibold flex">
												Ordered at {getLocaleDateTime(order.order_date)}
												<!-- <br/>Review or manage this order -->
											</div>
										</div>
									</div>

									{#each order.products as product, index (product.product?._id)}
										<div class="product-order-container w-full mt-4">
											<div class="flex flex-wrap">
												<div class="text-2xl font-semibold my-4">
													{product.product?.productName ?? 'Product Unavailable'}
												</div>
												<div class="flex flex-1 justify-end items-center space-x-2">
													{#if staff}
														<button
															class="btn_wrp w-fit h-fit"
															on:click={() =>
																goto(
																	`/admin/dashboard/product/manage?product_id=${
																		product.product?._id ?? 'back'
																	}`
																)}
														>
															<Button
																icon={faCog}
																color="COLORBLE"
																color_t="COLORWHT"
																text="Edit Listing"
																custom_style="my-2"
															/>
														</button>
													{/if}
													<button
														class="btn_wrp w-fit h-fit"
														on:click={() => goto(`/product/${product.product?.slug ?? 'back'}`)}
													>
														<Button
															icon={faShare}
															color="COLORWHT"
															color_t="COLORBLK"
															text="Go to Listing"
															custom_style="my-2"
														/>
													</button>
												</div>
											</div>
											<div class="banner-top flex flex-wrap w-full space-x-4 items-top">
												<div class="pimg_wrp block bg-COLORBLE h-fit w-fit rounded-md">
													<div class="pimg_wrp2 relative">
														<div
															class="product-image relative block overflow-clip rounded-md hover:opacity-80 cursor-pointer"
															on:click={() => goto(`/product/${product.product?.slug ?? 'back'}`)}
														>
															<img
																src={product.product?.image ??
																	config['product-showcase']['default-image']}
																alt={product.product?.productName ?? 'Untitled Product'}
																title={product.product?.productName ?? 'Untitled Product'}
																class="productImage rounded-sm w-72 h-56 object-cover"
															/>
														</div>
													</div>
												</div>
												<div
													class="inputgroup flex-1 block items-start justify-start lg:items-center my-2"
												>
													<div class="label font-semibold w-full text-lg">Product description</div>
													<div
														class="product-description text-md font-light text-COLORWHT h-full w-full py-1 rounded-md mb-4 bg-transparent"
													>
														<div class="text">
															{@html product.product?.description.length > 250
																? `${product.product?.description.slice(
																		0,
																		250
																  )}... <a class='font-semibold hover:underline' href='/product/${
																		product.product?.slug
																  }'>Read more</a>`
																: product.product?.description ??
																  'This product entry is corrupt, failed to load or has been deleted.'}
														</div>
														<div class="product-price text-xl font-semibold my-2">
															{parseFloat(product.product?.price.$numberDecimal).toLocaleString(
																'en-US',
																{
																	style: 'currency',
																	currency: config['checkout']['currency'],
																	minimumFractionDigits: 2
																}
															) ??
																parseFloat('0.00').toLocaleString('en-US', {
																	style: 'currency',
																	currency: config['checkout']['currency'],
																	minimumFractionDigits: 2
																})}
														</div>
														<div class="quantity font-semibold text-4xl">x{product.quantity}</div>
													</div>
												</div>
											</div>
										</div>{/each}
									<div class="text-2xl font-semibold my-4">
										{parseFloat(order.total_amount.$numberDecimal ?? '0.00').toLocaleString(
											'en-US',
											{
												style: 'currency',
												currency: config['checkout']['currency'],
												minimumFractionDigits: 2
											}
										)}
									</div>
									<div class="flex flex-wrap flex-1 justify-start items-center space-x-2">
										{#if staff}
											<button
												class="btn_wrp w-fit h-fit"
												title={order.is_accepted
													? 'You have already accepted this order'
													: 'Accept this order'}
												disabled={order.is_accepted}
												on:click={() => go_order(1, order._id)}
											>
												<Button
													icon={faCheck}
													color="COLORWHT"
													color_t="COLORBLK"
													text="Accept"
													custom_style="my-2"
													disabled={order.is_accepted}
													disabled_text="You have already accepted this order"
												/>
											</button>
										{/if}
										<button
											class="btn_wrp w-fit h-fit"
											title={staff ? 'Reject/Decline this order' : 'Dequeue this order'}
											on:click={() => go_order(2, order._id)}
										>
											<Button
												icon={faX}
												color="transparent"
												color_t="COLORHPK"
												text={staff ? 'Decline' : 'Delete'}
												custom_style="my-2 border border-COLORHPK"
											/>
										</button>
										<button
											class="btn_wrp w-fit h-fit"
											title="Modify this order"
											on:click={() => go_order(3, order._id)}
										>
											<Button
												icon={faClone}
												color="COLORYLW"
												color_t="COLORBLK"
												text={staff ? 'Override' : 'Modify'}
												custom_style="my-2"
											/>
										</button>
										<div class="flex flex-1 items-center justify-end">
											<div
												role="button"
												tabindex="0"
												title="Copy the order code for reference"
												class="flex items-center justify-center px-4 space-x-2 rounded-md hover:bg-gray-400 hover:bg-opacity-25 opacity-50 cursor-pointer select-none"
												on:click={() => {
													// Copy the selected text to the clipboard
													navigator.clipboard.writeText(order.order_code);
													toast.push('Order code copied to clipboard.');
												}}
												on:keypress={() => {
													// Copy the selected text to the clipboard
													navigator.clipboard.writeText(order.order_code);
													toast.push('Order code copied to clipboard.');
												}}
											>
												<div class="flex text-lg font-light my-4">
													<div class="font-semibold">ORDER #</div>
													{order.order_code}
												</div>
												<div class="copy rounded-md hover:bg-gray-200 opacity-80 p-4">
													<Fa icon={faCopy} size="1.25x" class="text-COLORWHT" />
												</div>
											</div>
										</div>
									</div>
									<div
										id="pulldown-{order._id}"
										class="settings-pulldown {staff ? 'hidden' : ''} my-8 space-y-4"
									>
										<div id="title-{order._id}" class="text-2xl font-semibold">
											{staff ? 'Take Action' : 'Order Details'}
										</div>
										{#if currentAction[0] === 2}
											<button
												class="btn_wrp w-fit h-fit"
												title="Reject/Decline this order"
												on:click={(e) => processRequest(e)}
											>
												<Button
													icon={faTrash}
													color="transparent"
													color_t="COLORHPK"
													text="DELETE"
													custom_style="my-2 border border-COLORHPK"
												/>
											</button>
										{/if}
										<form
											id="pulldown-content-{order._id}"
											action="#"
											on:submit={(e) => processRequest(e)}
										>
											<div
												class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
											>
												<div
													class="flex label font-semibold w-full text-lg justify-start items-center space-x-2"
												>
													<div class="title">Expected ETA</div>
													<div
														title="When should this order arrive?"
														class="icon cursor-help select-none"
													>
														<Fa icon={faQuestionCircle} size="1x" />
													</div>
												</div>
												<DateTimeInput
													icon={faCalendar}
													name="ETA"
													placeholder="Expected Time of Arrival (e.g. 2021-12-31)"
													value={data
														? getLocaleDateTime(order.delay_time)
														: new Date().toISOString().split('T')[0]}
													custom_style="bg-transparent"
													disabled={staff ? false : true}
												/>
											</div>

											<div
												id="modify-content-{order._id}"
												class="modify-content space-y-4 mt-4 {staff ? 'hidden' : ''}"
											>
												<div
													class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
												>
													<div
														class="flex label font-semibold w-full text-lg justify-start items-center space-x-2"
													>
														<div class="title">Total amount due</div>
														<div
															title={staff
																? 'How much does the customer have to pay?'
																: 'The total amount you have to pay--not including any discounts that may have been applied'}
															class="icon cursor-help select-none"
														>
															<Fa icon={faQuestionCircle} size="1x" />
														</div>
													</div>
													<TextInput
														icon={faDollarSign}
														name="name"
														placeholder="Enter a total (e.g. 10.75)"
														custom_style="bg-transparent"
														value={order
															? parseFloat(order.total_amount.$numberDecimal).toFixed(2)
															: ''}
														disabled={staff ? false : true}
														disabled_text={staff
															? ''
															: `Your total ${
																	order
																		? 'is $' +
																		  parseFloat(order.total_amount.$numberDecimal).toFixed(2)
																		: 'failed to load'
															  }`}
													/>
												</div>
												<div
													class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
												>
													<div
														class="flex label font-semibold w-full text-lg justify-start items-center space-x-2"
													>
														<div class="title">Discount code</div>
														<div
															title={staff
																? 'Apply or modify the discount on the order'
																: order
																? order.promo_code
																	? order.promo_code.description
																	: 'No discounts were applied to this order'
																: 'Discount codes that were applied to this order will be here'}
															class="icon cursor-help select-none"
														>
															<Fa icon={faQuestionCircle} size="1x" />
														</div>
													</div>
													{#if staff}
														<Select
															icon={faTag}
															name="discountCode"
															placeholder="Select a discount code"
															value={order
																? order.promo_code
																	? order.promo_code.code
																	: 'placeholder'
																: 'placeholder'}
															custom_style="bg-transparent border border-COLORWHT"
															options={promos}
														/>
													{:else}
														<TextInput
															icon={faTag}
															name="discountCode"
															placeholder="Select a discount code"
															value={order
																? order.promo_code
																	? order.promo_code.code
																	: 'NO DISCOUNT APPLIED'
																: 'NO DISCOUNT APPLIED'}
															custom_style="bg-transparent border border-COLORWHT"
															disabled
															disabled_text={order
																? order.promo_code
																	? `This discount is worth ${order.promo_code.discount_percentage}%`
																	: 'No discounts were applied to this order'
																: 'NO DISCOUNT APPLIED'}
														/>
													{/if}
												</div>
											</div>
											<!--- END user-modify-content-${order.order_code} -->
											{#if staff}
												<button
													class="btn_wrp w-fit h-fit"
													type="submit"
													title="Process this request"
												>
													<Button
														icon={faSave}
														color="COLORWHT"
														color_t="COLORBLK"
														text="Save"
														custom_style="my-2"
													/>
												</button>
											{/if}
										</form>
										<!--- user-modify-content-${order.order_code}-->
										<div id="user-modify-content-{order._id}" class="hidden">
											<div class="title text-2xl font-semibold">
												Products Ordered
											</div>
											{#each data_raw[index].products as product, index}
												<ProductPill
													product={product.product ?? config.ui['default-product']}
													description={product.product?.description}
													image={product.product?.image}
													widget={false}
													tag={true}
													tagText={'x' + product.quantity}
												>
													<div class="controls flex justify-center items-center space-x-2">
														<div
															class="edit-wrap w-fit h-fit"
															on:click={() => {
																// Delete the product
																userDeleteOrderProduct(order._id, index);
																setTimeout(() => {
																	catchAll();
																}, 800);
															}}
														>
															<Button
																icon={faTrash}
																color="transparent"
																custom_style="border border-COLORHPK py-2 m-0"
																color_t="COLORHPK"
																text="Delete product"
															/>
														</div>

														<div class="edit-wrap w-fit h-fit">
															<TextInput
																icon={faCog}
																name="quantity"
																placeholder="Input a new quantity"
																custom_style="py-2 m-0"
															/>
														</div>
													</div>
												</ProductPill>
											{/each}
										</div>
									</div>
								</div>
							</div>{/each}
					{/if}
				{:else}<div class="font-light">There was a problem while displaying the data.</div>{/if}
				<!-- {/if}
		-->
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
	:global(body) {
		overflow: hidden;
	}
</style>

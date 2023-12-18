<script lang="ts">
	import Select from '$lib/Elements/Generic/Select2.svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Generic/TextInput.svelte';
	import config from '$lib/config/settings';
	import type { User } from '$lib/types/User';
	import {
		faCalendar,
		faCheck,
		faClone,
		faCog,
		faCopy,
		faDollarSign,
		faQuestionCircle,
		faShare,
		faTag,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import _ from 'lodash';
	import type { Order } from '$lib/types/Order';
	import Fa from 'svelte-fa';
	import DateInput from '$lib/Elements/Generic/DateInput.svelte';
	import { getPromo } from '$lib/Elements/Utility/Promo';
	import type { Promo } from '$lib/types/Promo';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // User data
	let data: Order[]; // List of orders
	let promos: Promo['code'][];
	async function catchAll() {
		// Do not run if there is no product_id provided

		const res = await fetchWebApi('v1/order/manage', 'GET');
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
		// Group duplicate products together
		// Copilot logic (very efficient it says, lol)
		let copy = _.cloneDeep(r.is);
		let productsMap = new Map();

		r.is.forEach((order, i) => {
			if (copy[i].products.length != 0) {
				// Clear (if not already)
				copy[i].products = [];
			}

			order.products.forEach((product) => {
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
			toast.push('Product not found.');
		}
		console.log(data);
	}

	onMount(async () => {
		try {
			await catchAll();
			const pR = await getPromo();
			promos = pR.is.map((item: Promo) => item.code);

			console.log(promos); // This will log an array of codes
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the user: ${error.message}`);
		}
	});

	const getId = (id: string) => document.getElementById(id);
	function go_order(action: number, orderId: string) {
		switch (action) {
			case 1:
				toast.push('You accepted this order.');
				getId(`order-${orderId}`)?.classList.remove('border-red-300'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.remove('border-COLORYLW'); // @ts-ignore
				getId(`pulldown-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
				getId(`pulldown-content-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
				getId(`modify-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`title-${orderId}`).innerHTML =
					'You <b class="font-normal text-COLORBLK">accepted</b> this order.';
				break;
			case 2:
				toast.push('You rejected this order.');
				getId(`order-${orderId}`)?.classList.remove('border-COLORYLW'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.add('border-red-300'); // @ts-ignore
				getId(`pulldown-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
				getId(`pulldown-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`modify-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`title-${orderId}`).innerHTML =
					'You <b class="font-normal text-COLORHPK">rejected</b> this order.';
				break;
			case 3:
				toast.push("You're altering this order.");
				getId(`order-${orderId}`)?.classList.remove('border-red-300'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.add('border-COLORYLW'); // @ts-ignore
				getId(`pulldown-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
				getId(`pulldown-content-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
				getId(`modify-content-${orderId}`)?.classList.remove('hidden'); // @ts-ignore
				getId(`title-${orderId}`).innerHTML =
					'You\'re <b class="font-normal text-COLORYLW">altering</b> this order.';
				break;
			default:
				toast.push('The parameters provided are incorrect.');
		}
	}
</script>

<div class="stub hidden border border-"></div>
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

	<div class="main-content flex items-center justify-start h-full text-COLORBLK overflow-hidden">
		<div
			class="drawer hidden lg:block bg-COLORWHT px-4 py-2 flex-col justify-start h-screen bg-opacity-100 w-full lg:w-1/4"
			bind:this={navDrawer}
		>
			<div class="section py-6">
				<div class="title font-semibold pb-5">My Account</div>
				<div
					on:click={async () => {
						await goto(`/admin/dashboard/user/manage?user_id=${localStorage.user_id}`);
					}}
				>
					<Button
						icon={faCog}
						color="COLORBLK"
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
					<div class="flex text-xl font-semibold pb-12">Accept, decline and modify orders</div>
				</div>
				<div class="flex flex-1 justify-end text-2xl font-semibold pb-2">Open Orders: {data? data.length : "--"}</div>

			</div>
			<div class="flex flex-wrap flex-col-reverse w-full">
				{#if data != undefined}
					{#if !isNaN(user.id) && staff}
						{#each data as order}
							<div class="user_wrap w-full">
								<div class="ctg_wrp w-full" />
							</div>

							<div
								id="order-{order._id}"
								class="orderPane flex flex-col lg:flex-row justify-start w-full bg-COLORWHT py-4 px-4 rounded-sm border border-COLORWHT3 my-8"
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
													class="flex flex-wrap text-lg lg:text-2xl text-COLORBLK font-medium space-x-2"
												>
													<div class="g-wrap">
														{order.order_from ? '@' + order.order_from.username : '@anonymous'}
													</div>
													<div class="font-semibold">just ordered</div>
												</div>
											</div>
											<div class="text-base text-COLORBLK font-semibold flex">
												Review or manage this order
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
															color="COLORBLK"
															color_t="COLORWHT1"
															text="Edit Listing"
															custom_style="my-2"
														/>
													</button>
													<button
														class="btn_wrp w-fit h-fit"
														on:click={() => goto(`/product/${product.product?.slug ?? 'back'}`)}
													>
														<Button
															icon={faShare}
															color="COLORBLK"
															color_t="COLORWHT1"
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
														class="product-description text-md font-light text-COLORBLE h-full w-full py-1 rounded-md mb-4 bg-transparent"
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
										<button
											class="btn_wrp w-fit h-fit"
											title="Accept this order"
											on:click={() => go_order(1, order._id)}
										>
											<Button
												icon={faCheck}
												color="COLORBLK"
												color_t="COLORWHT1"
												text="Accept"
												custom_style="my-2"
											/>
										</button>
										<button
											class="btn_wrp w-fit h-fit"
											title="Reject/Decline this order"
											on:click={() => go_order(2, order._id)}
										>
											<Button
												icon={faX}
												color="transparent"
												color_t="COLORHPK"
												text="Decline"
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
												text="Override"
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
													<Fa icon={faCopy} size="1.25x" class="text-black" />
												</div>
											</div>
										</div>
									</div>
									<div id="pulldown-{order._id}" class="settings-pulldown hidden my-8 space-y-4">
										<div id="title-{order._id}" class="text-2xl font-semibold">Take Action</div>
										<div id="pulldown-content-{order._id}">
											<div
												class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
											>
												<div
													class="flex label font-semibold w-full text-lg justify-start items-center space-x-2"
												>
													<div class="title">Expected ETA</div>
													<div
														title="When should this order arrive?"
														class="icon cursor-pointer select-none"
													>
														<Fa icon={faQuestionCircle} size="1x" />
													</div>
												</div>
												<DateInput
													icon={faCalendar}
													name="ETA"
													placeholder="Expected Time of Arrival (e.g. 2021-12-31)"
													value=""
													custom_style="bg-transparent"
												/>
											</div>

											<div
												id="modify-content-{order._id}"
												class="modify-content space-y-4 mt-4 hidden"
											>
												<div
													class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
												>
													<div
														class="flex label font-semibold w-full text-lg justify-start items-center space-x-2"
													>
														<div class="title">Total amount due</div>
														<div
															title="How much does the customer have to pay?"
															class="icon cursor-pointer select-none"
														>
															<Fa icon={faQuestionCircle} size="1x" />
														</div>
													</div>
													<TextInput
														icon={faDollarSign}
														name="name"
														placeholder="Enter a total (e.g. 10.75)"
														custom_style="bg-transparent"
														value={order ? order.total_amount.$numberDecimal : ''}
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
															title="Apply or modify the discount on the order"
															class="icon cursor-pointer select-none"
														>
															<Fa icon={faQuestionCircle} size="1x" />
														</div>
													</div>
													<Select
														icon={faTag}
														name="discountCode"
														placeholder="Select a discount code"
														value={order
															? order.promo_code
																? order.promo_code.code
																: 'placeholder'
															: 'placeholder'}
														custom_style="bg-transparent border border-COLORBLK"
														options={promos}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>{/each}{/if}{/if}
				<!-- {/if}
				{:else}<div class="font-light">There was a problem while displaying the data.</div>{/if}
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

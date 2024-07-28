<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DateTimeInput from '$lib/Elements/Inputs/DateTimeInput.svelte';
	import Select from '$lib/Elements/Inputs/Select2.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import { getPromo } from '$lib/Elements/Utility/Promo';
	import { getLocaleDateTime } from '$lib/Elements/Utility/time';
	import config from '$lib/config';
	import type { Order } from '$lib/types/Order';
	import type { Promo } from '$lib/types/Promo';
	import type { User } from '$lib/types/User';
	import { what_is } from '$lib/vendor/dishout/What_Is';
// What is what?
	import { userDeleteOrderProduct } from '$lib/Elements/Utility/Order';
	import { locateNodeUsingHash } from '$lib/Elements/Utility/page';
	import type { CartProduct } from '$lib/types/Product';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faCalendar,
		faCheck,
		faCheckCircle,
		faCheckDouble,
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
	import ProductPill from '../../../../lib/Elements/Dashboard/ProductPill.svelte';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // User data
	let data: Order[]; // List of orders
	let data_raw: Order[]; // Order data (raw, ungrouped)
	let promos: Promo['code'][];
	let currentAction: [number, string] = [-1, '']; // Not selected
	let drawerOpenBy: number;
	async function catchAll() {
		// Try to see if we provided an order ID to search for
		locateNodeUsingHash('order');
		// Fetch all orders
		const res = (await fetchWebApi('admin/order/manage?completed=true', 'GET')) as Response;
		const r = await res.json();
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
			// Rewrite the universe a bit.
			copy[i].order_code = order.order_code.substring(0, 8).toUpperCase(); // Make a little bit shorter and easier to read
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
				getId(`order-${orderId}`)?.classList.remove('border-COLORACCENTL'); // @ts-ignore
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
					'You <b class="font-normal text-COLORLIGHT-100">accepted</b> this order.';
				currentAction = [action, orderId];
				break;
			case 2: // Decline
				toast.push(staff ? 'You rejected this order.' : "You're about to delete this order.");
				getId(`order-${orderId}`)?.classList.remove('border-COLORACCENTL'); // @ts-ignore
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
					? 'You <b class="font-normal text-COLORACCENTL">rejected</b> this order.'
					: 'Are you <b class="font-normal text-COLORACCENTL underline">absolutely sure</b> you want to remove this order?';
				currentAction = [action, orderId];
				break;
			case 3: // Modify
				toast.push("You're altering this order.");
				// @ts-ignore
				getId(`title-${orderId}`).innerHTML =
					'You\'re <b class="font-normal text-COLORACCENTL">altering</b> this order.';
				getId(`order-${orderId}`)?.classList.remove('border-red-300'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.add('border-COLORACCENTL'); // @ts-ignore
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
			case 4: // Ready
				toast.push("You're readying this order.");
				getId(`order-${orderId}`)?.classList.remove('border-COLORACCENTL'); // @ts-ignore
				getId(`order-${orderId}`)?.classList.add('border-red-300'); // @ts-ignore
				if (drawerOpenBy != 4) {
					// Keep the drawer open as long as we're switching tabs
					getId(`pulldown-${orderId}`)?.classList.add('hidden'); // @ts-ignore
					drawerOpenBy = 4;
				}
				getId(`pulldown-${orderId}`)?.classList.toggle('hidden'); // @ts-ignore
				getId(`pulldown-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`modify-content-${orderId}`)?.classList.add('hidden'); // @ts-ignore
				getId(`user-modify-content-${orderId}`)?.classList.add('hidden');
				getId(`title-${orderId}`).innerHTML =
					'This will send out the "ready" status to the user.<br/>Are you <b class="font-normal text-COLORACCENTL underline">absolutely sure</b> this order is ready for pick-up?';
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

		// If we're not deleting, or readying the order...
		// convert the delivery time back to a UNIX_TS
		if (currentAction[0] !== 2 && currentAction[0] !== 4) {
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
			case 4: // Ready
				const r = (await fetchWebApi(
					'admin/order/manage',
					'POST',
					what_is(what.private.order, [
						currentAction[0] === 1
							? 'a'
							: currentAction[0] === 2
								? 'd'
								: currentAction[0] === 3
									? 'm'
									: currentAction[0] === 4
										? 'r'
										: '?', // Ternary statement to map 'a' for ACCEPT /
						// 'd' for DELETE / 'm' for MODIFY / 'r' for READY
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

<svelte:head>
	<title>UniFood | Dashboard / Orders</title>
</svelte:head>

<div class="stub border- hidden border" />

<div
	class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 pb-40 lg:px-16 lg:py-16"
>
	<div class="flex-header flex w-full flex-wrap items-start">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">View receipts</div>
			<div class="flex pb-12 text-xl font-light">
				View closed orders
			</div>
		</div>
		<div class="flex flex-1 justify-end pb-2 text-2xl font-semibold">
			Open Orders: {data ? data.length : '--'}
		</div>
	</div>
	<div class="flex w-full flex-col-reverse flex-wrap">
		{#if data != undefined}
			{#if data.length === 0}
				<div class="font-light">No orders are currently available to manage.</div>
			{/if}
			{#if !isNaN(user.id)}
				<!-- This will never run if there are no orders -->
				{#each data as order, index}
					<div
						id="order-{order._id}"
						class="orderPane my-8 flex w-full flex-col justify-start rounded-sm border border-COLORLIGHT-50 bg-COLORDARK-75 px-4 py-4 lg:flex-row"
					>
						<div class="order-details flex w-full flex-col px-4 pb-8" id={order.order_code}>
							<div class="flex lg:space-x-4">
								<div class="customer-photo hidden lg:block">
									<img
										class="rounded-md object-cover"
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
											class="flex flex-wrap space-x-2 text-lg font-medium text-COLORLIGHT-100 lg:text-2xl"
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
									<div class="flex text-sm font-light text-COLORLIGHT-100">
										Ordered at {getLocaleDateTime(order.order_date)}
										<!-- <br/>Review or manage this order -->
									</div>
								</div>
							</div>

							{#each order.products as product, index (product.product?._id)}
								<div class="product-order-container mt-4 w-full">
									<div class="flex flex-wrap">
										<div class="my-4 text-2xl font-semibold">
											{product.quantity + 'x '}
											{product.product?.productName ?? 'Product Unavailable'}
										</div>
										<div
											class="flex flex-1 basis-full items-center justify-start space-x-2 md:basis-0 md:justify-end"
										>
											{#if staff}
												<button
													class="btn_wrp h-fit w-fit"
													on:click={() =>
														goto(
															`/admin/dashboard/product/manage?product_id=${
																product.product?._id ?? 'back'
															}`
														)}
												>
													<Button
														icon={faCog}
														color="COLORACCENTD"
														color_t="COLORLIGHT-100"
														text="Edit Listing"
														custom_style="my-2"
														icon_on_sm
													/>
												</button>

												<button
													class="btn_wrp h-fit w-fit"
													on:click={() => goto(`/product/${product.product?.slug ?? 'back'}`)}
												>
													<Button
														icon={faShare}
														color="COLORLIGHT-100"
														color_t="COLORDARK-100"
														text="Go to Listing"
														custom_style="my-2"
														icon_on_sm
													/>
												</button>
											{/if}
										</div>
									</div>
									<div class="banner-top items-top flex w-full flex-wrap space-x-4">
										<div class="pimg_wrp hidden h-fit w-fit rounded-md bg-COLORACCENTD lg:block">
											<div class="pimg_wrp2 relative">
												<div
													class="product-image relative block cursor-pointer overflow-clip rounded-md hover:opacity-80"
													on:click={() => goto(`/product/${product.product?.slug ?? 'back'}`)}
												>
													<img
														src={product.product?.image ??
															config['product-showcase']['default-image']}
														alt={product.product?.productName ?? 'Untitled Product'}
														title={product.product?.productName ?? 'Untitled Product'}
														class="productImage h-56 w-72 rounded-sm object-cover"
													/>
												</div>
											</div>
										</div>
										<div
											class="inputgroup my-2 block flex-1 items-start justify-start lg:items-center"
										>
											<div class="label hidden w-full text-lg font-semibold">
												Product description
											</div>
											<div
												class="product-description text-md mb-4 hidden h-full w-full rounded-md bg-transparent py-1 font-light text-COLORLIGHT-100"
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
												<div class="product-price my-2 text-xl font-semibold">
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
												<div class="quantity text-4xl font-semibold">x{product.quantity}</div>
											</div>
										</div>
									</div>
								</div>{/each}
							<div class="my-4 hidden text-2xl font-semibold">
								{parseFloat(order.final_amount.$numberDecimal ?? '0.00').toLocaleString('en-US', {
									style: 'currency',
									currency: config['checkout']['currency'],
									minimumFractionDigits: 2
								})}
							</div>
							<div class="flex flex-1 flex-wrap items-center justify-start space-x-2">
								{#if staff}
									<button
										class="btn_wrp h-fit w-fit"
										title={order.is_accepted
											? 'You have already accepted this order'
											: 'Accept this order'}
										disabled={order.is_accepted}
										on:click={() => go_order(1, order._id)}
									>
										<Button
											icon={faCheck}
											color="COLORLIGHT-100"
											color_t="COLORDARK-100"
											text="Accept"
											custom_style="my-2"
											disabled={order.is_accepted}
											disabled_text="You have already accepted this order"
										/>
									</button>
								{/if}
								{#if staff && order.is_accepted}
									<!-- You have to accept the order first before readying it -->
									<button
										class="btn_wrp h-fit w-fit"
										title="Ready this order"
										on:click={() => go_order(4, order._id)}
									>
										<Button
											icon={faCheckDouble}
											color="COLORACCENTD"
											color_t="COLORLIGHT-100"
											text="Ready"
											custom_style="my-2"
										/>
									</button>
								{/if}
								{#if staff || (!staff && !order.is_accepted)}
									<button
										class="btn_wrp h-fit w-fit"
										title={staff ? 'Reject/Decline this order' : 'Dequeue this order'}
										on:click={() => go_order(2, order._id)}
									>
										<Button
											icon={faX}
											color="transparent"
											color_t="COLORACCENTL"
											text={staff ? 'Decline' : 'Delete'}
											custom_style="my-2 border border-COLORACCENTL"
										/>
									</button>
								{/if}
								{#if staff && order.is_accepted}
									<button
										class="btn_wrp h-fit w-fit"
										title="Modify this order"
										on:click={() => go_order(3, order._id)}
									>
										<Button
											icon={faClone}
											color="COLORACCENTL"
											color_t="COLORDARK-100"
											text={staff ? 'Details' : 'Modify'}
											custom_style="my-2"
										/>
									</button>{/if}
								<div class="flex flex-1 items-center justify-end">
									<div
										role="button"
										tabindex="0"
										title="Copy the order code for reference"
										class="flex cursor-pointer select-none items-center justify-center space-x-2 rounded-md px-4 opacity-50 hover:bg-gray-400 hover:bg-opacity-25"
										on:click={() => {
											// Copy the selected text to the clipboard
											navigator.clipboard.writeText(
												`${config.server['bound-domain']}/admin/dashboard/order#${order.order_code}`
											);
											toast.push('Order code copied to clipboard.');
										}}
										on:keypress={() => {
											// Copy the selected text to the clipboard
											navigator.clipboard.writeText(
												`${config.server['bound-domain']}/admin/dashboard/order#${order.order_code}`
											);
											toast.push('Order code copied to clipboard.');
										}}
									>
										<div class="my-4 flex text-lg font-light">
											<div class="font-semibold">ORDER #</div>
											{order.order_code}
										</div>
										<div class="copy rounded-md p-4 opacity-80 hover:bg-gray-200">
											<Fa icon={faCopy} size="1.25x" class="text-COLORLIGHT-100" />
										</div>
									</div>
								</div>
							</div>
							{#if !staff && !order.is_accepted}
								<div class="my-8 space-y-4">
									<span class="border border-COLORLIGHT-100 px-4 py-2">PENDING REVIEW</span>
								</div>
							{/if}
							<div
								id="pulldown-{order._id}"
								class="settings-pulldown {staff
									? 'hidden'
									: order.is_accepted
										? ''
										: 'hidden'} my-8 space-y-4"
							>
								<div id="title-{order._id}" class="text-2xl font-semibold">
									{staff ? 'Take Action' : 'Order Details'}
								</div>
								{#if currentAction[0] === 2}
									<button
										class="btn_wrp h-fit w-fit"
										title="Reject/Decline this order"
										on:click={(e) => processRequest(e)}
									>
										<Button
											icon={faTrash}
											color="transparent"
											color_t="COLORACCENTL"
											text="DELETE"
											custom_style="my-2 border border-COLORACCENTL"
										/>
									</button>
								{:else if currentAction[0] === 4}
									<button
										class="btn_wrp h-fit w-fit"
										title="Ready this order"
										on:click={(e) => processRequest(e)}
									>
										<Button
											icon={faCheckCircle}
											color="COLORACCENTD"
											color_t="COLORLIGHT-100"
											text="THIS ORDER IS READY"
											custom_style="my-2 border border-COLORLIGHT-100"
										/>
									</button>
								{/if}
								<form
									id="pulldown-content-{order._id}"
									action="#"
									on:submit={(e) => processRequest(e)}
								>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div
											class="label flex w-full items-center justify-start space-x-2 text-lg font-semibold"
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
										class="modify-content mt-4 space-y-4 {staff ? 'hidden' : ''}"
									>
										<div
											class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
										>
											<div
												class="label flex w-full items-center justify-start space-x-2 text-lg font-semibold"
											>
												<div class="title">Final amount due</div>
												<div
													title={staff
														? 'How much does the customer have to pay?'
														: 'The total amount you have to pay'}
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
													? parseFloat(order.final_amount.$numberDecimal).toFixed(2)
													: ''}
												disabled={staff ? false : true}
												disabled_text={staff
													? ''
													: `Your total ${
															order
																? 'is $' + parseFloat(order.final_amount.$numberDecimal).toFixed(2)
																: 'failed to load'
														}`}
											/>
										</div>
										<div class="rogroup flex flex-wrap items-start justify-start lg:items-center">
											<div
												class="label flex w-full items-center justify-start space-x-2 text-lg font-semibold"
											>
												<div class="title">Total amount</div>
												<div
													title={staff
														? 'The total amount excl. any discounts that may have been applied'
														: 'The total amount you have to pay--not including any discounts that may have been applied'}
													class="icon cursor-help select-none"
												>
													<Fa icon={faQuestionCircle} size="1x" />
												</div>
											</div>
											<TextInput
												icon={faDollarSign}
												name={undefined}
												placeholder="0"
												custom_style="bg-transparent"
												value={order
													? parseFloat(order.total_amount.$numberDecimal).toFixed(2)
													: ''}
												disabled
												disabled_text={'Total amount excl. any discounts'}
											/>
										</div>
										<div class="rogroup flex flex-wrap items-start justify-start lg:items-center">
											<div
												class="label flex w-full items-center justify-start space-x-2 text-lg font-semibold"
											>
												<div class="title">Discount amount</div>
												<div
													title={'The total discount percentage that was applied to this order'}
													class="icon cursor-help select-none"
												>
													<Fa icon={faQuestionCircle} size="1x" />
												</div>
											</div>
											<TextInput
												icon={faDollarSign}
												name={undefined}
												placeholder="0"
												custom_style="bg-transparent"
												value={order
													? parseFloat(order.discount_amount.$numberDecimal).toFixed(2)
													: ''}
												disabled
												disabled_text={staff
													? 'To edit the percentage, go and edit the promo code applied to this order.'
													: 'Your total discount percentage'}
											/>
										</div>
										<div
											class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
										>
											<div
												class="label flex w-full items-center justify-start space-x-2 text-lg font-semibold"
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
													custom_style="bg-transparent border border-COLORLIGHT-100"
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
													custom_style="bg-transparent border border-COLORLIGHT-100"
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
										<button class="btn_wrp h-fit w-fit" type="submit" title="Process this request">
											<Button
												icon={faSave}
												color="COLORLIGHT-100"
												color_t="COLORDARK-100"
												text="Save"
												custom_style="my-2"
											/>
										</button>
									{/if}
								</form>
								<!--- user-modify-content-${order.order_code}-->
								<div id="user-modify-content-{order._id}" class="hidden">
									<div class="title text-2xl font-semibold">Products Ordered</div>
									{#each data_raw[index].products as product, index}
										<!-- description={product.product?.description} -->
										<ProductPill
											product={product.product ?? config.ui['default-product']}
											description={''}
											image={product.product?.image}
											widget={false}
											tag={true}
											tagText={'x' + product.quantity}
										>
											<div class="controls flex items-center justify-center space-x-2">
												<div
													class="edit-wrap h-fit w-fit"
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
														custom_style="border border-COLORACCENTL py-2 m-0"
														color_t="COLORACCENTL"
														text="Remove"
													/>
												</div>

												<!-- <div class="edit-wrap h-fit w-fit">
													<TextInput
														icon={faCog}
														name="quantity"
														placeholder="Input a new quantity"
														custom_style="py-2 m-0"
													/>
												</div> -->
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

<style>
	:root {
		--tw-bg-opacity: 1;
	}
	/*:global(body) {
		overflow: hidden;
	}*/
</style>
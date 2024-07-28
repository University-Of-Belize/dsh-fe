<script lang="ts">
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Receipt from '$lib/Elements/Dashboard/Receipt.svelte';
	import { getPromo } from '$lib/Elements/Utility/Promo';
	import type { Order } from '$lib/types/Order';
	import type { Promo } from '$lib/types/Promo';
	import type { User } from '$lib/types/User';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import { faFileCsv } from '@fortawesome/free-solid-svg-icons';
// What is what?
	import { locateNodeUsingHash } from '$lib/Elements/Utility/page';
	import type { CartProduct } from '$lib/types/Product';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { saveAs } from 'file-saver';
	import * as converter from 'json-2-csv';
	import _ from 'lodash';

	import { getLocaleDateTime } from '$lib/Elements/Utility/time';
	import { onMount } from 'svelte';
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
	<div class="flex-header lg:flex block w-full flex-wrap items-start">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">View receipts</div>
			<div class="flex pb-4 lg:pb-12 text-xl font-light">View closed orders</div>
		</div>
		<div class="flex flex-1 justify-start lg:justify-end pb-2 text-2xl font-semibold">
			<Button
				text="Download Spreadsheet"
				icon={faFileCsv}
				on:click={async () => {
                    let data_ = JSON.parse(JSON.stringify(data));

                    // Remove unnecessary data
                    data_.forEach((order) => {
                        delete order._id;


                        order["Order Code"] = order.order_code;
                        delete order.order_code;

                        order["Is Accepted"] = order.is_accepted? "Yes": "No";
                        delete order.is_accepted;

                        order["Is Completed"] = order.completed? "Yes": "No";
                        delete order.completed;

                        order["Order From (Username)"] = order.order_from.username;
                        order["Order From (Email)"] = order.order_from.email;
                        delete order.order_from;
                        
                        // order["Accepted by (Username)"] = order?.override_by.username ?? "N/A";
                        // order["Accepted by (Email)"] = order?.override_by.email ?? "N/A";
                        delete order.override_by;

                        order["Order Date"] = getLocaleDateTime(order.order_date)
                        delete order.order_date;

                        order["Products"] = "Various";
                        delete order.products;

                        // order["Delay Time (seconds)"] = parseFloat(order.delay_time) - parseFloat(order.order_date) + " seconds";
                        delete order.delay_time;

                        // order["Promo Code"] = order.promo_code.code;
                        // order["Promo Discount (%)"] = order.promo_code.discount_percentage;
                        delete order.promo_code;

                        order["Total Amount ($)"] = order.total_amount.$numberDecimal;
                        delete order.total_amount;

                        order["Discount Amount ($)"] = order.discount_amount.$numberDecimal;
                        delete order.discount_amount;

                        order["Final amount ($)"] = order.final_amount.$numberDecimal;
                        delete order.final_amount;

                        delete order.__v;
                    })

					const csv = await converter.json2csv(data_);
					// Create the blob
					const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
					saveAs(blob, 'closed_orders.csv');
				}}
			/>
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
					<Receipt {order} {staff} current_user={user} order_index={index} />
				{/each}
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

<script lang="ts">
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import Receipt from '$lib/Elements/Dashboard/Receipt.svelte';
	import { getPromo } from '$lib/Elements/Utility/Promo';
	import type { Order } from '$lib/types/Order';
	import type { Promo } from '$lib/types/Promo';
	import type { User } from '$lib/types/User';
	import { faFileCsv, faFileExcel } from '@fortawesome/free-solid-svg-icons';
// What is what?
	import { locateNodeUsingHash } from '$lib/Elements/Utility/page';
	import type { CartProduct } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import saveAs from 'file-saver';
	import * as converter from 'json-2-csv';
	import _ from 'lodash';
	import * as xlsx from 'xlsx';

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
    let exportMessage: HTMLSpanElement;

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
</script>

<svelte:head>
	<title>UniFood | Dashboard / Receipts</title>
</svelte:head>

<div class="stub border- hidden border" />

<div
	class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 pb-40 lg:px-16 lg:py-16"
>
	<div class="flex-header block w-full flex-wrap items-start lg:flex">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">View receipts</div>
			<div class="flex pb-4 text-xl font-light lg:pb-12">View closed orders</div>
		</div>
		<div
			class="block pb-2 flex-1"
		>
        <div class="block lg:flex flex-1 justify-start space-y-2 text-2xl font-semibold lg:justify-end lg:space-x-2 lg:space-y-0">
			<Button
				text="Download Spreadsheet"
				icon={faFileCsv}
				on:click={async () => {
                    exportMessage.classList.remove('hidden');
					let data_ = JSON.parse(JSON.stringify(data));

					// Remove unnecessary data
					data_.forEach((order) => {
						delete order._id;

						order['Order Code'] = order.order_code;
						delete order.order_code;

						order['Is Accepted'] = order.is_accepted ? 'Yes' : 'No';
						delete order.is_accepted;

						order['Is Completed'] = order.completed ? 'Yes' : 'No';
						delete order.completed;

						order['Order From (Username)'] = order.order_from.username;
						order['Order From (Email)'] = order.order_from.email;
						delete order.order_from;

						// order["Accepted by (Username)"] = order?.override_by.username ?? "N/A";
						// order["Accepted by (Email)"] = order?.override_by.email ?? "N/A";
						delete order.override_by;

						order['Order Date'] = getLocaleDateTime(order.order_date);
						delete order.order_date;

						order['Products'] = 'Various';
						// delete order.products;

						// order["Delay Time (seconds)"] = parseFloat(order.delay_time) - parseFloat(order.order_date) + " seconds";
						delete order.delay_time;

						// order["Promo Code"] = order.promo_code.code;
						// order["Promo Discount (%)"] = order.promo_code.discount_percentage;
						delete order.promo_code;

						order['Total Amount ($)'] = order.total_amount.$numberDecimal;
						delete order.total_amount;

						order['Discount Amount ($)'] = order.discount_amount.$numberDecimal;
						delete order.discount_amount;

						order['Final amount ($)'] = order.final_amount.$numberDecimal;
						delete order.final_amount;

						delete order.__v;
					});

					const csv = await converter.json2csv(data_);
					// Create the blob
					const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
                    exportMessage.classList.add('hidden');
					saveAs(blob, 'closed_orders.csv');
				}}
			/>
			<Button
				text="Download XLSX"
				icon={faFileExcel}
				on:click={async () => {
                    exportMessage.classList.remove('hidden');
					let data_ = JSON.parse(JSON.stringify(data));
					const workbook = xlsx.utils.book_new();

					// Remove unnecessary data
					data_.forEach((order) => {
						delete order._id;

						order['Order Code'] = order.order_code;
						delete order.order_code;

						order['Is Accepted'] = order.is_accepted ? 'Yes' : 'No';
						delete order.is_accepted;

						order['Is Completed'] = order.completed ? 'Yes' : 'No';
						delete order.completed;

						order['Order From (Username)'] = order.order_from.username;
						order['Order From (Email)'] = order.order_from.email;
						delete order.order_from;

						// order["Accepted by (Username)"] = order?.override_by.username ?? "N/A";
						// order["Accepted by (Email)"] = order?.override_by.email ?? "N/A";
						delete order.override_by;

						order['Order Date'] = getLocaleDateTime(order.order_date);
						delete order.order_date;

						// order["Products"] = "Various";
						// Check if "Products Sold" sheet exists
						// Format order.products accordingly
						order.products.forEach((product) => {
							product['Order Code'] = order['Order Code'];

							product['Product Name'] = product.product.productName;
							delete product.product.productName;

							product['Product Price ($)'] = JSON.parse(product.product.price.$numberDecimal);
							delete product.product.price;

							product['Quantity Bought'] = JSON.parse(product.quantity);
							delete product.quantity;

                            product['Product Price x Quantity Bought'] = product['Product Price ($)'] * product['Quantity Bought'];

							product['Product Slug'] = product.product.slug;
							delete product.product.slug;

							product['In Stock'] = JSON.parse(product.product.in_stock);
							delete product.product.in_stock;

							product['Product Description'] = product.product.description;
							delete product.product.description;

							delete product.product;
							delete product.variations;
							delete product._id;
						});

						if (workbook.SheetNames.includes('Products Sold')) {
							// Append to the existing sheet
							const worksheet = workbook.Sheets['Products Sold'];
							let worksheet_data = xlsx.utils.sheet_to_json(worksheet);
							worksheet_data = worksheet_data.concat(order.products);
                            console.log(worksheet_data)
							// Recreate the sheet with the updated data
							const updatedWorksheet = xlsx.utils.json_to_sheet(worksheet_data);
							workbook.Sheets['Products Sold'] = updatedWorksheet;
						} else {
							// Create a new sheet
							const worksheet = xlsx.utils.json_to_sheet(order.products);
							workbook.SheetNames.push('Products Sold');
							workbook.Sheets['Products Sold'] = worksheet;
						}

						delete order.products;

						// delete order.products;

						// order["Delay Time (seconds)"] = parseFloat(order.delay_time) - parseFloat(order.order_date) + " seconds";
						delete order.delay_time;

						// order["Promo Code"] = order.promo_code.code;
						// order["Promo Discount (%)"] = order.promo_code.discount_percentage;
						delete order.promo_code;

						order['Total Amount ($)'] = order.total_amount.$numberDecimal;
						delete order.total_amount;

						order['Discount Amount ($)'] = order.discount_amount.$numberDecimal;
						delete order.discount_amount;

						order['Final amount ($)'] = order.final_amount.$numberDecimal;
						delete order.final_amount;

						delete order.__v;
					});

					const worksheet = xlsx.utils.json_to_sheet(data_);
					workbook.SheetNames.push('Closed Orders');
					workbook.Sheets['Closed Orders'] = worksheet;

					// Reorder the sheets
					workbook.SheetNames = ['Closed Orders', 'Products Sold'];

                    exportMessage.classList.add('hidden');
					// Save the file
					xlsx.writeFile(workbook, 'closed_orders.xlsx');
				}}
			/>
        </div>
        <span bind:this={exportMessage} class="flex hidden flex-1 justify-end my-2 text-COLORLIGHT-25 text-sm font-light">Generating export...</span>
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

<script lang="ts">
	import config from '$lib/config/index';
	import type { Order } from '$lib/types/Order';
	import type { User } from '$lib/types/User';
	import { getLocaleDateTime } from '../Utility/time';

	export let order: Order;
	export let order_index: number;
	export let current_user: User;
	export let staff: boolean;
</script>

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
					<div class="flex flex-wrap space-x-2 text-lg font-medium text-COLORLIGHT-100 lg:text-2xl">
						{order.final_amount.$numberDecimal} Paid
					</div>
				</div>
				<div class="flex text-sm font-light text-COLORLIGHT-100">
					Order #{order.order_code}
					<!-- <br/>Review or manage this order -->
				</div>
			</div>
		</div>
		<!--- START TABLE (R_DETAILS)-->

		<table class="mt-8 mb-2">
			<thead class="hidden border-b bg-COLORDARK-50 text-COLORLIGHT-50 lg:table-header-group">
				<tr class="">
					<td class="whitespace-normal py-4 text-sm font-semibold sm:px-3">Bill to</td>
					<td class="whitespace-normal py-4 text-sm font-semibold sm:px-3">Generated at</td>
					<td class="whitespace-normal py-4 text-sm font-semibold sm:px-3">Receipt/Order #</td>
					<td class="whitespace-normal py-4 text-sm font-semibold sm:px-3">Order status</td>
					<!-- <td class="whitespace-normal py-4 text-sm font-semibold sm:px-3">Payment method</td> -->
					<!-- <td class="whitespace-normal py-4 text-sm font-semibold sm:px-3">Payment status</td> -->
				</tr>
			</thead>
			<tbody class="bg-COLORDARK-75 text-left text-COLORLIGHT-100">
				<tr class="">
					<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell"
						>{order.order_from.email}</td
					>
					<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell"
						>{getLocaleDateTime(order.order_date)}</td
					>
					<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell"
						>{order.order_code}</td
					>
					<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell"
						>{order.completed? "Yes": "No"}</td
					>
		</table>


		<!----- START TABLE -->
		<table class="mb-8 w-full rounded-md border-COLORDARK-25 lg:border">
			<thead class="hidden border-b bg-COLORDARK-50 text-COLORLIGHT-50 lg:table-header-group">
				<tr class="">
					<td class="whitespace-normal py-4 text-sm font-semibold sm:px-3"> Order from </td>

					<td class="whitespace-normal py-4 text-sm font-medium sm:px-3">Product QTY</td>
					<td class="whitespace-normal py-4 text-sm font-medium sm:px-3">Product name</td>
					<td class="whitespace-normal py-4 text-sm font-medium sm:px-3">Order code</td>
					<td class="whitespace-normal py-4 text-sm font-medium sm:px-3">Unit price</td>

					<td class="whitespace-normal py-4 text-sm font-medium sm:px-3">Unit amount</td>
				</tr>
			</thead>
			<tbody class="bg-COLORDARK-75 text-left text-COLORLIGHT-100">
				{#each order.products as product, index (product.product?._id)}
					<tr class={product.product._id}>
						<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell"
							><img
								title="{order.order_from.username} ({order.order_from.email})"
								class="h-8 w-8 cursor-help overflow-hidden rounded-full border p-0.5"
								src={order.order_from
									? order.order_from.profile_picture
										? order.order_from.profile_picture
										: config.user['default-image']
									: config.user['default-image']}
							/></td
						>

						<td class="whitespace-no-wrap py-4 text-sm sm:px-3">
							{product.quantity}
							<div class="mt-1 flex flex-col text-xs font-medium lg:hidden">
								<div class="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-3 w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									Jane Doeson
								</div>
								<div class="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-3 w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4 6h16M4 10h16M4 14h16M4 18h16"
										/>
									</svg>
									Desktop Computer
								</div>
								<div class="">24 x 10 x 5 cm</div>
								<div class="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-3 w-3"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
										/>
									</svg>
									1 Kg
								</div>
							</div>
						</td>

						<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell">
							<div class="items-center justify-start space-x-2 lg:flex">
								<img
									class="h-8 w-8 cursor-help overflow-hidden rounded-full border p-0.5"
									src={product.product?.image ?? config['product-showcase']['default-image']}
									alt={product.product?.productName ?? 'Untitled Product'}
									title={product.product?.productName ?? 'Untitled Product'}
								/><span>{product.product.productName}</span>
							</div>
						</td>
						<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell"
							>{order.order_code}</td
						>

						<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell">
							{parseFloat(product.product?.price.$numberDecimal).toLocaleString('en-US', {
								style: 'currency',
								currency: config['checkout']['currency'],
								minimumFractionDigits: 2
							}) ?? '0.00'}</td
						>
						<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell">
							{parseFloat(product.product?.price.$numberDecimal * product.quantity).toLocaleString(
								'en-US',
								{
									style: 'currency',
									currency: config['checkout']['currency'],
									minimumFractionDigits: 2
								}
							) ?? '0.00'}</td
						>
					</tr>

					<!--- END TABLE-->
				{/each}
				<tr class="sub_total">
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td class="text-right text-sm font-semibold">SUBTOTAL</td>
					<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell">
						{parseFloat(order.total_amount.$numberDecimal ?? '0.00').toLocaleString('en-US', {
							style: 'currency',
							currency: config['checkout']['currency'],
							minimumFractionDigits: 2
						})}
					</td>
				</tr>
				<tr class="discounts">
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td class="text-right text-sm font-medium">DISCOUNTS</td>
					<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell">
						{parseFloat(
							order.final_amount.$numberDecimal - order.total_amount.$numberDecimal ?? '0.00'
						).toLocaleString('en-US', {
							style: 'currency',
							currency: config['checkout']['currency'],
							minimumFractionDigits: 2
						})}
					</td>
				</tr>
				<tr class="final_amount">
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td class="text-right text-xl font-bold">TOTAL</td>
					<td class="whitespace-no-wrap hidden py-4 text-sm font-normal sm:px-3 lg:table-cell">
						{parseFloat(order.final_amount.$numberDecimal ?? '0.00').toLocaleString('en-US', {
							style: 'currency',
							currency: config['checkout']['currency'],
							minimumFractionDigits: 2
						})}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

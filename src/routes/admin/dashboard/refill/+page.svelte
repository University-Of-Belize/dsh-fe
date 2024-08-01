<script lang="ts">
	import { getPromo } from '$lib/Elements/Utility/Promo';
	import type { Order } from '$lib/types/Order';
	import type { Promo } from '$lib/types/Promo';
	import type { User } from '$lib/types/User';
// What is what?
	import { locateNodeUsingHash } from '$lib/Elements/Utility/page';
	import type { CartProduct } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import _ from 'lodash';

	import UserPill from '$lib/Elements/Dashboard/UserPill.svelte';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // User data
	let user_to_refill: User | null = user;
	let data: Order[]; // List of orders
	let data_raw: Order[]; // Order data (raw, ungrouped)
	let promos: Promo['code'][];
	let currentAction: [number, string] = [-1, '']; // Not selected
	let drawerOpenBy: number;
	let exportMessage: HTMLSpanElement;
	let error_message: HTMLParagraphElement;

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

	// Lookup user
	async function lookupUser(username: string) {
		const res = (await fetchWebApi(`admin/user/lookup?user_id=${username}`, 'GET')) as Response;
		const r = await res.json();
		if (!res.ok) {
			error_message.innerText = r.message;
			return undefined;
		}
		return r.is;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		user_to_refill = null;
		error_message.innerText = '';

		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		const username = valueArray[0];
		if (username.trim() === '') {
			error_message.innerText = 'Please enter a username to search for a user.';
			return;
		}
		const user: User | undefined = await lookupUser(username);
		if (user !== undefined) {
			console.log(user);
			user_to_refill = user;
		}
	}
</script>

<svelte:head>
	<title>UniFood | Dashboard / Refill</title>
</svelte:head>

<div class="stub border- hidden border" />

<div
	class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 pb-40 lg:px-16 lg:py-16"
>
	<div class="flex-header block w-full flex-wrap items-start lg:flex">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">Refill Accounts</div>
			<div class="flex pb-4 text-xl font-light lg:pb-12">View and refill an account's balance</div>
		</div>
	</div>
	<div class="flex w-full flex-col flex-wrap">
		<!-- Account refill UI goes here -->
		<!-- Have the admin search for a user first -->

		<form action="#" class="block w-full" on:submit={(e) => handleSubmit(e)}>
			<label for="topbar-search" class="sr-only">Search</label>
			<div class="relative w-full">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<Fa icon={faSearch} class="mr-4 text-COLORLIGHT-100" />
				</div>
				<input
					type="text"
					name="search"
					title="Type in a username to search for a user"
					id="topbar-search"
					class="block w-full rounded-lg border-0 bg-COLORDARK-75 p-1.5 pl-9 text-xs font-light text-COLORLIGHT-100 placeholder-COLORLIGHT-100 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
					placeholder="Type in a username to search for a user"
				/>
			</div>
			<p bind:this={error_message} class="mt-2 text-xs text-rose-600"></p>
		</form>

		{#if user_to_refill !== null}
			<UserPill
				user={user_to_refill}
				description={'Credit balance: ' + user_to_refill.credit.$numberDecimal}
			>
				<svelte:fragment slot="extraContent">
					<div class="w-full">test</div>
				</svelte:fragment>
			</UserPill>
		{/if}
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

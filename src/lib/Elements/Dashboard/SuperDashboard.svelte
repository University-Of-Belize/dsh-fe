<script lang="ts">
	import type { Category } from '$lib/types/Category';
	import type { Product as Product_ } from '$lib/types/Product';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	let categories: Category[] = [];
	let logging_in: boolean = false;
	let debounceTimeout: number;
	let landingPhoto: string;
	// let clientWidth: number;
	// let clientHeight: number;
	let product: Product_[] | null;

	let LCP: string;
	let LCP_EXT: string;

	onMount(async () => {
		// Get the root element
		const root = document.documentElement;

		// Get the computed styles of the root element
		const style = getComputedStyle(root);

		// Get the value of the variable
		LCP = style.getPropertyValue('--LANDINGPHOTO');
		LCP = LCP.substring(4, LCP.length - 1).replace(/['"]+/g, ''); // Remove the dumb quotes

		LCP_EXT = LCP.split('.').pop(); // Get the extension

		try {
			const res = (await fetchWebApi('menu/random', 'GET')) as Response;
			if (!res) return;
			const r = await res.json();
			product = r.is;
			getCategories();
			// console.log(product);
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while contacting our servers: ${
					error?.message ?? 'Error unavailable.'
				}`
			);
		}
		landingPhoto = getComputedStyle(document.documentElement)
			.getPropertyValue('--LANDINGPHOTO')
			.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
		// clientWidth = window.innerWidth;
		// clientHeight = window.innerHeight;
	});
	async function getCategories() {
		const response = (await fetchWebApi('category', 'GET')) as Response;
		const data = await response.json();
		categories = data.is; // Category[]
		categories = categories.filter((category: Category) => !category.hidden);
		if (localStorage.categories) {
			if (localStorage.categories !== JSON.stringify(categories)) {
				localStorage.removeItem('categories'); // Time for an update
			}
		}
	}
</script>

<svelte:head>
	<!-- Preload the LCP image with a high fetchpriority so it starts loading with the stylesheet. -->
	<title>UniFood | Super Dashboard</title>
</svelte:head>

<main class="block h-full w-full bg-COLORDARK-75 px-6 text-COLORLIGHT-100">
	<div class="navbar mb-6 flex space-x-2 bg-COLORDARK-100 py-1 text-sm">
		<button class="rounded-md px-2 py-2 hover:bg-COLORDARK-75"> Overview </button>
		<button class="rounded-md px-2 py-2 hover:bg-COLORDARK-75"> Analytics </button>
	</div>

	<div class="dashboard flex w-full flex-wrap">
		<div class="block w-full rounded-md">
			<div
				class="col-span-2 -mx-4 bg-gradient-to-t from-indigo-500 to-blue-500 px-4 py-8 sm:col-span-1 sm:mx-0 sm:rounded-xl sm:py-4"
			>
				<p class="mb-4 font-medium text-indigo-100">Cases in pipeline</p>
				<div class="mb-6 flex max-w-xs">
					<div
						class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-400 sm:mb-0 sm:mr-3"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
							/>
						</svg>
					</div>
					<div class="px-4">
						<p class="mb-1 text-2xl font-black text-white">1844</p>
						<p class="font-medium text-indigo-100">$192,234.00</p>
					</div>
				</div>
				<div class="flex flex-wrap justify-between">
					<div class="flex flex-col items-center px-4 py-1">
						<p class="text-lg font-medium text-white">232</p>
						<p class="text-xs font-medium text-indigo-100">Quote</p>
					</div>
					<div class="mb-1 flex flex-col items-center px-4 py-1 sm:mb-0 sm:mr-1">
						<p class="text-lg font-medium text-white">$140</p>
						<p class="text-xs font-medium text-indigo-100">CAC</p>
					</div>
					<div
						class="mb-1 flex flex-col items-center rounded-2xl bg-white px-4 py-1 sm:mb-0 sm:mr-1"
					>
						<p class="text-lg font-medium text-indigo-500">21</p>
						<p class="text-xs font-medium text-indigo-500">Refunds</p>
					</div>
					<div class="flex flex-col items-center px-4 py-1">
						<p class="text-lg font-medium text-white">$44</p>
						<p class="text-xs font-medium text-indigo-100">PPC</p>
					</div>
				</div>
			</div>
			<div class="col-span-2 grid grid-cols-2 gap-4 py-4 sm:col-span-1 sm:gap-8 sm:px-4">
				<div class="">
					<p class="text-lg font-bold">32</p>
					<p class="mb-2 font-medium text-slate-400">$230,000</p>
					<span class="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600"
						>Drafts</span
					>
				</div>
				<div class="">
					<p class="text-lg font-bold">621</p>
					<p class="mb-2 font-medium text-slate-400">$230,000</p>
					<span class="rounded-full bg-indigo-200 px-2 py-0.5 text-xs font-medium text-indigo-600"
						>Prending Approval</span
					>
				</div>
				<div class="">
					<p class="text-lg font-bold">68</p>
					<p class="mb-2 font-medium text-slate-400">$230,000</p>
					<span class="rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-medium text-yellow-700"
						>Sent to Clients</span
					>
				</div>
				<div class="">
					<p class="text-lg font-bold">970</p>
					<p class="mb-2 font-medium text-slate-400">$230,000</p>
					<span class="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-600"
						>Signing</span
					>
				</div>
			</div>
			<div
				class="col-span-2 col-start-1 grid grid-cols-2 gap-6 border-t py-4 sm:grid-cols-4 sm:px-4 sm:py-8"
			>
				<div class="">
					<p class="text-sm text-slate-500">Revenue</p>
					<p class="text-xl font-medium">$924,883</p>
				</div>
				<div class="">
					<p class="text-sm text-slate-500">Expense</p>
					<p class="text-xl font-medium">$924,883</p>
				</div>
				<div class="">
					<p class="text-sm text-slate-500">Target</p>
					<p class="text-xl font-medium">$150,000</p>
				</div>
			</div>
		</div>
		<div class="w-screen">
			<div class="mx-auto grid max-w-screen-lg gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
				<div class="max-w-md rounded-lg border px-6 pb-10 pt-6">
					<div
						class="inline-block rounded-full border-8 border-emerald-50 bg-emerald-200 p-2 text-emerald-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
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
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="float-right h-6 w-6 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
						/>
					</svg>
					<p class="text-sm font-medium text-gray-500">Vistors</p>
					<p class="text-4xl font-medium text-gray-800">24,430</p>
					<span class="float-right rounded-full bg-rose-100 px-1 text-sm font-medium text-rose-600">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="inline h-4 w-4 pb-0.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
						</svg>
						3%</span
					>
				</div>

				<div class="max-w-md rounded-lg border px-6 pb-10 pt-6">
					<div
						class="inline-block rounded-full border-8 border-emerald-50 bg-emerald-200 p-2 text-emerald-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
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
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="float-right h-6 w-6 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
						/>
					</svg>
					<p class="text-sm font-medium text-gray-500">Members</p>
					<p class="text-4xl font-medium text-gray-800">3,405</p>
					<span
						class="float-right rounded-full bg-emerald-100 px-1 text-sm font-medium text-emerald-600"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="inline h-4 w-4 pb-0.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
						</svg>
						23%</span
					>
				</div>

				<div class="max-w-md rounded-lg border px-6 pb-10 pt-6">
					<div
						class="inline-block rounded-full border-8 border-emerald-50 bg-emerald-200 p-2 text-emerald-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
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
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="float-right h-6 w-6 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
						/>
					</svg>
					<p class="text-sm font-medium text-gray-500">Active Now</p>
					<p class="text-4xl font-medium text-gray-800">405</p>
					<div class="float-right flex -space-x-2">
						<img
							class="h-7 w-7 rounded-full ring ring-white"
							src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						/>
						<img
							class="h-7 w-7 rounded-full ring ring-white"
							src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						/>
						<img
							class="h-7 w-7 rounded-full ring ring-white"
							src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
						/>
						<img
							class="h-7 w-7 rounded-full ring ring-white"
							src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						/>
						<div
							class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 font-semibold text-white ring ring-white"
						>
							+5
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

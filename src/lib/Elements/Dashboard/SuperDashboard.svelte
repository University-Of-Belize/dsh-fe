<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DataCard from '$lib/Elements/Cards/DataCard.svelte';
	import SuperDashboard from '$lib/Elements/Dashboard/SuperDashboard.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import type { Category } from '$lib/types/Category';
	import type { Product as Product_ } from '$lib/types/Product';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faGift } from '@fortawesome/free-solid-svg-icons';
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
			const res = (await fetchWebApi('v1/menu/random', 'GET')) as Response;
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
		const response = (await fetchWebApi('v1/category', 'GET')) as Response;
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

<main class="block w-full h-full bg-COLORBLK1 text-COLORWHT px-6">
    <div class="navbar flex bg-COLORBLK py-1 text-sm space-x-2">
        <button class="rounded-md hover:bg-COLORBLK1 px-2 py-2">
            Overview
        </button>
        <button class="rounded-md hover:bg-COLORBLK1 px-2 py-2">
            Analytics
        </button>
    </div>

    <div class="dashboard flex w-full">

    <div class="block rounded-md w-full">
        <div class="flex flex-col justify-between border-b py-3 sm:flex-row w-full">
          <p class="font-medium">Overview</p>
          <select class="text-slate-500 hover:bg-slate-200 rounded-lg border-2 px-4 py-2 font-medium focus:outline-none focus:ring">
            <option value="last-month">Last Month</option>
            <option value="last-month">Last 2 Months</option>
            <option value="last-month">This Year</option>
          </select>
        </div>
        <div class="col-span-2 -mx-4 bg-gradient-to-t from-indigo-500 to-blue-500 px-4 py-8 sm:col-span-1 sm:mx-0 sm:rounded-xl sm:py-4">
          <p class="mb-4 font-medium text-indigo-100">Cases in pipeline</p>
          <div class="mb-6 flex max-w-xs">
            <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-400 sm:mr-3 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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
            <div class="mb-1 flex flex-col items-center px-4 py-1 sm:mr-1 sm:mb-0">
              <p class="text-lg font-medium text-white">$140</p>
              <p class="text-xs font-medium text-indigo-100">CAC</p>
            </div>
            <div class="mb-1 flex flex-col items-center rounded-2xl bg-white px-4 py-1 sm:mr-1 sm:mb-0">
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
            <p class="text-slate-400 mb-2 font-medium">$230,000</p>
            <span class="bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 text-xs font-medium">Drafts</span>
          </div>
          <div class="">
            <p class="text-lg font-bold">621</p>
            <p class="text-slate-400 mb-2 font-medium">$230,000</p>
            <span class="rounded-full bg-indigo-200 px-2 py-0.5 text-xs font-medium text-indigo-600">Prending Approval</span>
          </div>
          <div class="">
            <p class="text-lg font-bold">68</p>
            <p class="text-slate-400 mb-2 font-medium">$230,000</p>
            <span class="rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-medium text-yellow-700">Sent to Clients</span>
          </div>
          <div class="">
            <p class="text-lg font-bold">970</p>
            <p class="text-slate-400 mb-2 font-medium">$230,000</p>
            <span class="rounded-full bg-green-200 px-2 py-0.5 text-xs font-medium text-green-600">Signing</span>
          </div>
        </div>
        <div class="col-span-2 col-start-1 grid grid-cols-2 gap-6 border-t py-4 sm:grid-cols-4 sm:px-4 sm:py-8">
          <div class="">
            <p class="text-slate-500 text-sm">Revenue</p>
            <p class="text-xl font-medium">$924,883</p>
          </div>
          <div class="">
            <p class="text-slate-500 text-sm">Liabilities</p>
            <p class="text-xl font-medium">$924,883</p>
          </div>
          <div class="">
            <p class="text-slate-500 text-sm">Profit</p>
            <p class="text-xl font-medium">$213,002</p>
          </div>
          <div class="">
            <p class="text-slate-500 text-sm">Target</p>
            <p class="text-xl font-medium">$150,000</p>
          </div>
        </div>
      </div>
      
    </div>
</main>
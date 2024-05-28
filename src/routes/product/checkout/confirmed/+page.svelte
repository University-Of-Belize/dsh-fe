<script lang="ts">
	import { goto } from '$app/navigation';
	import EscrowBanner from '$lib/Elements/Banners/EscrowBanner.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import type { User } from '$lib/types/User';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	let payment_data = localStorage.payment_data
		? JSON.parse(JSON.stringify(localStorage.payment_data))
		: {};

	$: branding_text = 'One second...';
	$: text = '';
	$: subtitle = '';

	onMount(async () => {
		localStorage.removeItem('cart_total');
		RunOrder();
	});

	async function postData(data: any, token?: string) {
		try {
			const response = (await fetchWebApi(
				'v1/order/place',
				'POST',
				what_is(
					what.public.order,
					localStorage.payment_data ? JSON.parse(localStorage.payment_data) : ''
				)
			)) as Response;
			// Immediately remove the payment information from the local storage (not card data--none is stored)
			setTimeout(() => {
				localStorage.removeItem('payment_data');
			}, 800);
			if (!response.ok) {
				const json = await response.json();
				branding_text = 'Order not placed';
				document.title = 'UniFood | Checkout / Error';
				text = json.message;
				return toast.push(`${json.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				});
			}
			text = 'Order placed!';
			document.title = 'UniFood | Checkout / Confirmed';
			const json = await response.json();
			toast.push(`${json.message ?? 'All good to go!'}`);

			// Update the user's balance
			user.credit.$numberDecimal = JSON.stringify(
				parseFloat(user.credit.$numberDecimal) - payment_data.toDeduct
			);
			localStorage.user = JSON.stringify(user);
		} catch (error) {
			branding_text = 'Order not placed';
			text = 'There was an error.';
			document.title = 'UniFood | Checkout / Error';
			toast.push(`${error.message}. Try again later.`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORRED))'
				}
			});
			console.log(error);
		}
	}
	async function RunOrder() {
		branding_text = 'Trying to place your order';
		text = 'Please, wait.';
		postData(null, localStorage.token ?? '');
		branding_text = 'Thanks';
		text = 'Thanks for your order';
		subtitle = 'You will be redirected to your dashboard shortly.';
		setTimeout(() => {
			goto('/admin/dashboard/order'); // Redirect to order management page
		}, 5000);
	}
</script>

<svelte:head>
	<title>UniFood | Checkout / Run Order</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex h-full items-center justify-center">
		<EscrowBanner {branding_text} {text} {subtitle}>
			<div class="flex w-full items-center justify-center pb-4 pt-8">
				<SearchBar />
			</div>
		</EscrowBanner>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

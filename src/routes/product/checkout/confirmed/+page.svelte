<script lang="ts">
	import { goto } from '$app/navigation';
	import EscrowBanner from '$lib/Elements/Generic/EscrowBanner.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	import config from '$lib/config/settings';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	$: branding_text = 'One second...';
	$: text = '';
	$: subtitle = '';

	onMount(async () => {
		RunOrder();
	});

	async function postData(data: any, token?: string) {
		try {
			const response = await fetchWebApi('v1/order/place', 'POST', what_is(what.public.order, ''));
			if (!response.ok) {
				const json = await response.json();
				branding_text = 'Order not placed';
				text = json.message;
				return toast.push(`${json.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': '#842d69'
					}
				});
			}
			text = 'Order placed!';
			const json = await response.json();
			toast.push(`${json.message ?? 'All good to go!'}`);
		} catch (error) {
			branding_text = 'Order not placed';
			text = 'There was an error.';
			toast.push(`${error.message}. Try again later.`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': '#842d69'
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
			goto('/admin/dashboard');
		}, 5000);
	}
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex items-center justify-center h-full">
		<EscrowBanner {branding_text} {text} {subtitle}>
			<div class="flex justify-center items-center w-full pt-8 pb-4">
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

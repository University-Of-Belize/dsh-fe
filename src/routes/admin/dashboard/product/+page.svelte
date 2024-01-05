<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import ProductPill from '$lib/Elements/Dashboard/ProductPill.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { deleteProduct } from '$lib/Elements/Utility/Product';
	import type { Product } from '$lib/types/Product';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faCog, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data = writable<Product[]>([]); // Declare the data variable

	async function catchAll() {
		const res = (await fetchWebApi('v1/menu/', 'GET')) as Response;
		if (res.status === 403) {
			localStorage.removeItem('token');
			localStorage.removeItem('user_id');
			localStorage.removeItem('user');
			toast.push('You need to log in.');
			goto('/auth/login');
		}
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data.set(r.is); // Rizz
		// console.log(data);
	}

	onMount(async () => {
		try {
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

<svelte:head>
	<title>Plattr | Dashboard / Products</title>
</svelte:head>

<main class="h-screen w-full overflow-hidden">
	<div class="navigation z-20 w-full">
		<Navigation
			transparency={5}
			search={true}
			titleText="Cafe {staff
				? ''
				: "<div class='font-bold pl-1 overflow-hidden'>| Dashboard</div>"}"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex h-full items-center justify-start text-COLORWHT">
		<div
			class="drawer hidden h-screen w-full flex-col justify-start overflow-auto bg-COLORWHT4 bg-opacity-20 px-4 py-2 lg:block lg:w-1/4"
			bind:this={navDrawer}
		>
			<div class="section bg-opacity-100 py-6">
				<div class="title pb-5 font-semibold">My Account</div>
				<div
					on:click={async () => {
						await goto(`/admin/dashboard/user/manage2?user_id=${localStorage.user_id}`);
					}}
				>
					<Button
						icon={faCog}
						color="COLORBLK3"
						text="My account settings"
						color_t="COLORWHT"
						custom_style="w-full"
					/>
				</div>
			</div>
			<DashList {staff} />
		</div>
		<div class="content block h-full w-full overflow-auto bg-transparent px-16 py-16 pb-40">
			<div class="flex-header flex w-full flex-wrap items-center">
				<div class="block">
					<div class="flex pb-2 text-2xl font-semibold">Product Management</div>
					<div class="flex pb-12 text-xl font-semibold">Product Listing & Management</div>
				</div>
				<div class="flex flex-1 items-center justify-end">
					<div class="flex flex-col items-end space-y-2">
						<div class="btn_wrp" on:click={() => goto('/admin/dashboard/product/manage')}>
							<Button color="COLORGRN2" color_t="COLORWHT" text="New product" icon={faPlus} />
						</div>
					</div>
				</div>
			</div>
			<div class="flex w-full flex-wrap">
				{#if $data && $data.length > 0}
					{#each $data as product, i}
						<div class="user_wrap w-full">
							<ProductPill
								product={product ?? {}}
								description={`Category: ${
									product.category ? product.category.name : 'Uncategorized'
								}`}
							>
								<div class="controls flex space-x-2">
									<div
										class="edit-wrap h-fit w-fit"
										on:click={() => {
											deleteProduct(product.slug);
											setTimeout(() => {
												catchAll();
											}, 800);
										}}
									>
										<Button
											icon={faTrash}
											color="transparent"
											custom_style="border border-COLORHPK"
											color_t="COLORHPK"
											text="Delete product"
										/>
									</div>
									<a href="/product/{product.slug}">
										<div
											class="edit-wrap h-fit w-fit"
											on:click={() => goto(`/product/${product.slug}`)}
										>
											<Button
												icon={faCog}
												color="COLORWHT"
												color_t="COLORBLK"
												text="Go to listing"
											/>
										</div></a
									>
								</div>
							</ProductPill>
						</div>
					{/each}{:else}<div class="font-light">
						There was a problem while displaying the data.
					</div>{/if}
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import ProductPill from '$lib/Elements/Dashboard/ProductPill.svelte';
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
		const res = (await fetchWebApi('menu/', 'GET')) as Response;
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
	<title>UniFood | Dashboard / Products</title>
</svelte:head>

<div
	class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 pb-40 lg:px-16 lg:py-16"
>
	<div class="flex-header flex w-full flex-wrap items-center">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">Product Management</div>
			<div class="flex pb-12 text-xl font-light">Product Listing & Management</div>
		</div>
		<div class="flex flex-1 items-center justify-end">
			<div class="flex flex-col items-end space-y-2">
				<div class="btn_wrp" on:click={() => goto('/admin/dashboard/product/manage')}>
					<Button color="COLORDARK-75" color_t="COLORLIGHT-100" text="New product" icon={faPlus} />
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
						displayPrice
						description={`Category: ${product.category ? product.category.name : 'Uncategorized'}`}
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
									custom_style="border border-COLORACCENTL"
									color_t="COLORACCENTL"
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
										color="COLORLIGHT-100"
										color_t="COLORDARK-75"
										text="Go to listing"
									/>
								</div></a
							>
						</div>
					</ProductPill>
				</div>
			{/each}{:else if $data.length === 0}
			<div class="font-light">No products found. Add a new product to get started.</div>
		{:else}
			<div class="font-light">There was a problem while displaying the data.</div>
		{/if}
	</div>
</div>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

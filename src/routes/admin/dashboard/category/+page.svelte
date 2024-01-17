<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import CategoryPill from '$lib/Elements/Dashboard/CategoryPill.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { deleteCategory } from '$lib/Elements/Utility/Category';
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faCog, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Category[]; // List of users

	async function catchAll() {
		const res = (await fetchWebApi('v1/category', 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
		console.log(data);
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
	<title>Plattr | Dashboard / Categories</title>
</svelte:head>

<main class="h-screen w-full overflow-hidden">
	<div class="navigation z-20 w-full">
		<Navigation
			transparency={5}
			search={true}
			titleText="{config.ui['branding-text']} {staff
				? ''
				: "<div class='font-bold overflow-hidden'>| Dashboard</div>"}"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex h-full items-center justify-start text-COLORWHT">
		<div
			class="drawer hidden h-screen w-full flex-col justify-start overflow-auto bg-COLORWHT4 bg-opacity-20 px-4 py-2 lg:block lg:w-1/4"
		>
			<DashList {staff} />
		</div>
		<div class="content block h-full w-full overflow-auto bg-transparent px-16 py-16 pb-40">
			<div class="flex-header flex w-full flex-wrap items-center">
				<div class="block">
					<div class="flex pb-2 text-2xl font-semibold">Category Management</div>
					<div class="flex pb-12 text-xl font-semibold">Product Category Management</div>
				</div>
				<div class="flex flex-1 items-center justify-end">
					<div class="flex flex-col items-end space-y-2">
						<div class="btn_wrp" on:click={() => goto('/admin/dashboard/category/manage')}>
							<Button color="COLORGRN2" color_t="COLORWHT" text="New category" icon={faPlus} />
						</div>
					</div>
				</div>
			</div>
			<div class="flex w-full flex-wrap">
				{#if data != undefined}
					{#each data as category, i}
						<div class="ctg_wrp w-full">
							<CategoryPill {category} description={category.description}
								><div slot="alias" class="my-2">
									<!-- Categories get the same alias -->
									{#if category.alias != undefined && category.alias != category.name}
										<div class="text-md font-semibold">Also known as</div>
										<ul>
											<li class="flex items-center before:content-['-⠀']">
												<div class="text-sm font-light">{category.alias}</div>
											</li>
										</ul>
									{/if}
								</div>
								<div class="controls flex space-x-2">
									<div
										class="edit-wrap h-fit w-fit"
										on:click={() => {
											deleteCategory(category.name);
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
											text="Delete category"
										/>
									</div>
									<a href="/admin/dashboard/category/manage?category_id={category._id}">
										<div
											class="edit-wrap h-fit w-fit"
											on:click={() =>
												goto(`/admin/dashboard/category/manage?category_id=${category._id}`)}
										>
											<Button
												icon={faCog}
												color="COLORWHT"
												color_t="COLORBLK"
												text="Edit category"
											/>
										</div></a
									>
								</div>
							</CategoryPill>
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

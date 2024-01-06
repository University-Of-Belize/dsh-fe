<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import PromoPill from '$lib/Elements/Dashboard/PromoPill.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { deletePromo } from '$lib/Elements/Utility/Promo';
	import type { Promo } from '$lib/types/Promo';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faCog, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this

	let data: Promo[]; // List of promos

	async function catchAll() {
		const res = (await fetchWebApi('v1/admin/promo/manage', 'GET')) as Response;
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
	<title>Plattr | Dashboard / Promotions</title>
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

	<div class="main-content flex h-full items-center justify-start overflow-hidden text-COLORWHT">
		<div
			class="drawer hidden h-screen w-full flex-col justify-start overflow-auto bg-COLORWHT4 bg-opacity-20 px-4 py-2 lg:block lg:w-1/4"
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
					<div class="flex pb-2 text-2xl font-semibold">Promo Code Management</div>
					<div class="flex pb-12 text-xl font-semibold">Manage promo codes</div>
				</div>
				<div class="flex flex-1 items-center justify-end">
					<div class="flex flex-col items-end space-y-2">
						<div class="btn_wrp" on:click={() => goto('/admin/dashboard/promo/manage')}>
							<Button color="COLORGRN2" color_t="COLORWHT" text="New promo" icon={faPlus} />
						</div>
					</div>
				</div>
				<div class="flex w-full flex-wrap">
					{#if data != undefined}
						{#each data as promo, i}
							<div class="ctg_wrp w-full">
								<PromoPill {promo} description={promo.code}
									><div slot="alias" class="my-2">
										<!-- Categories get the same alias -->

										<div class="text-md font-semibold">Created by</div>
										<ul>
											<li class="flex items-center before:content-['-⠀']">
												<div class="text-sm font-light">
													{promo.created_by ? promo.created_by.username : 'Cannot retrieve author.'}
												</div>
											</li>
										</ul>
									</div>
									<div class="controls flex space-x-2">
										<div
											class="edit-wrap h-fit w-fit"
											on:click={() => {
												deletePromo(promo.code);
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
												text="Delete promotion"
											/>
										</div>
										<a href="/admin/dashboard/promo/manage?promo_code={promo._id}">
											<div
												class="edit-wrap h-fit w-fit"
												on:click={() =>
													goto(`/admin/dashboard/promo/manage?promo_code=${promo._id}`)}
											>
												<Button
													icon={faCog}
													color="COLORWHT"
													color_t="COLORBLK"
													text="Edit promotion"
												/>
											</div></a
										>
									</div>
								</PromoPill>
							</div>
						{/each}{:else}<div class="font-light">
							There was a problem while displaying the data.
						</div>{/if}
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

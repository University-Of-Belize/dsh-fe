<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import PromoPill from '$lib/Elements/Generic/PromoPill.svelte';
	import { deletePromo } from '$lib/Elements/Utility/Promo';
	import config from '$lib/config/settings';
	import type { Promo } from '$lib/types/Promo';
	import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this

	let data: Promo[]; // List of promos

	async function catchAll() {
		const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/promo/manage`, {
			headers: {
				Authorization: `Bearer ${localStorage.token}`
			}
		});
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

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation
			transparency={5}
			search={true}
			titleText="Cafe {staff ? '' : `| <div class='font-bold pl-1'>Dashboard</div>`}"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex items-center justify-start h-full text-COLORBLK">
		<div
			class="drawer hidden lg:block bg-COLORWHT px-4 py-2 flex-col justify-start h-screen bg-opacity-100 w-full lg:w-1/4"
			bind:this={navDrawer}
		>
			<div class="section py-6">
				<div class="title font-semibold pb-5">My Account</div>
				<div
					on:click={async () => {
						await goto(`/admin/dashboard/user/manage?user_id=${localStorage.user_id}`);
					}}
				>
					<Button
						icon={faCog}
						color="COLORBLK"
						text="My account settings"
						color_t="COLORWHT"
						custom_style="w-full"
					/>
				</div>
			</div>
			<DashList {staff} />
		</div>
		<div class="content block px-16 py-16 w-full h-full bg-transparent">
			<div class="flex text-2xl font-semibold pb-2">Promo Code Management</div>
			<div class="flex text-xl font-semibold pb-12">Manage promo codes</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#each data as promo, i}
						<div class="ctg_wrp w-full">
							<PromoPill {promo} description={promo.code}
								><div slot="alias" class="my-2">
									<!-- Categories get the same alias -->

									<div class="text-md font-semibold">Created by</div>
									<ul>
										<li class="before:content-['-⠀'] flex items-center">
											<div class="font-light text-sm">
												{promo.created_by ? promo.created_by.username : 'Cannot retrieve author.'}
											</div>
										</li>
									</ul>
								</div>
								<div class="controls flex space-x-2">
									<div
										class="edit-wrap w-fit h-fit"
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
									<a href="/admin/dashboard/promo/manage?promo_code{promo.code}">
										<div
											class="edit-wrap w-fit h-fit"
											on:click={() => goto(`/admin/dashboard/promo/manage?promo_code${promo.code}`)}
										>
											<Button
												icon={faCog}
												color="COLORBLK"
												color_t="COLORWHT1"
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
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

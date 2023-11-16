<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import UserPill from '$lib/Elements/Generic/UserPill.svelte';
	import config from '$lib/config/settings.json';
	import type { Product } from '$lib/types/Product';
	import type { Review } from '$lib/types/Review';
	import type { User } from '$lib/types/User';
	import { faCog } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Review[]; // List of reviews

	onMount(async () => {
		try {
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/review/manage`, {
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
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>
<main class="w-full h-screen overflow-hidden">
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
		<div class="content block px-16 py-16 w-full h-full bg-transparent overflow-auto">
			<div class="flex text-2xl font-semibold pb-2">Review Management</div>
			<div class="flex text-xl font-semibold pb-12">Reviews & Comment Management</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#each data as review, i}
					<div class="user_wrap w-full">
						<UserPill
							user={review.reviewer ?? {}}
							description={`Content: ${review.content}<br/>Original Content: ${review.original_content}`}
						>
							<div
								class="edit-wrap w-fit h-fit"
								on:click={() => goto(`/product/${review?.product.slug}`)}
							>
								<Button icon={faCog} color="COLORBLK" color_t="COLORWHT1" text="Go to listing" />
							</div>
						</UserPill>
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

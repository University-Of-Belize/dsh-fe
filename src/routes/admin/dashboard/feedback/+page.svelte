<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import UserPill from '$lib/Elements/Generic/UserPill.svelte';
	import { deleteReview, escapeHtml } from '$lib/Elements/Utility/Review';
	import type { Review } from '$lib/types/Review';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import SearchBar from './../../../../lib/Elements/Generic/SearchBar.svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Review[]; // Declare the data variable
	$: data; // List of reviews (Review[])

	async function catchAll() {
		const res = (await fetchWebApi('v1/admin/feedback/manage', 'GET')) as Response;
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
	<title>Plattr | Dashboard / My Feedback</title>
</svelte:head>

<main class="w-full h-screen overflow-hidden">
	<div class="navigation w-full z-20">
		<Navigation
			transparency={5}
			search={true}
			titleText="Feedback Portal"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex items-center justify-start h-full text-COLORWHT overflow-hidden">
		<div
			class="drawer hidden lg:block bg-COLORWHT4 bg-opacity-20 px-4 py-2 flex-col justify-start h-screen w-full lg:w-1/4 overflow-auto"
			bind:this={navDrawer}
		>
			<div class="section py-6 bg-opacity-100">
				<div class="title font-semibold pb-5">My Account</div>
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
		<div class="content block px-16 py-16 w-full h-full bg-transparent overflow-auto pb-40">
			<div class="flex text-2xl font-semibold pb-2">Feedback Hub</div>
			<div class="flex text-xl font-semibold pb-12">Submit or manage your feedback</div>
			<div class="flex flex-wrap flex-col-reverse w-full">
				{#if data != undefined}
					{#if data.length === 0}
						<!-- Note that the reversal of UI elements is intentional because of "flex-reverse-column" -->
						{#if !staff}
							<div class="py-4">
								<SearchBar placeholder="Create a review. Search for something else?" nomargin />
							</div>
						{/if}
						<div class="font-light">
							{staff ? 'Nobody has made a review as yet.' : 'You have not made any reviews as yet.'}
						</div>
					{/if}
					{#each data as review, i}
						<div class="user_wrap w-full">
							<UserPill
								user={review.reviewer ?? {}}
								description={`Feedback ID: ${review._id}<br/>Subject: ${
									review.product.productName
								}`}
							>
								<div class="controls flex space-x-2">
									
										<div
											class="edit-wrap w-fit h-fit"
											on:click={() => {
												deleteReview(review._id);
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
												text="Delete feedback"
											/>
										</div>
								
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

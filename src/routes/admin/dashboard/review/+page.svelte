<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import UserPill from '$lib/Elements/Dashboard/UserPill.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { deleteReview, escapeHtml } from '$lib/Elements/Utility/Review';
	import type { Review } from '$lib/types/Review';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import SearchBar from '../../../../lib/Elements/Search/SearchBar.svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Review[]; // Declare the data variable
	$: data; // List of reviews (Review[])

	async function catchAll() {
		const res = (await fetchWebApi('v1/admin/review/manage', 'GET')) as Response;
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
	<title>Plattr | Dashboard / Review</title>
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
			<div class="flex pb-2 text-2xl font-semibold">Review Management</div>
			<div class="flex pb-12 text-xl font-semibold">Reviews & Comment Management</div>
			<div class="flex w-full flex-col-reverse flex-wrap">
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
								description={`Review ID: ${review._id}<br/>Review For: ${
									review.product.productName
								}<br/>Content: ${escapeHtml(review.content)}<br/>${
									review.content != review.original_content
										? `Original Content: ${escapeHtml(review.original_content)}<br/>`
										: ''
								}Hidden: ${review.hidden ? 'Yes' : 'No'}<br/>`}
							>
								<div class="controls flex space-x-2">
									{#if staff}
										<div
											class="edit-wrap h-fit w-fit"
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
												text="Delete review"
											/>
										</div>{/if}
									<a href="/product/{review?.product.slug}#{review?._id}">
										<div
											class="edit-wrap h-fit w-fit"
											on:click={() => goto(`/product/${review?.product.slug}#${review?._id}`)}
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

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import config from '$lib/config/settings';
	import type { Review } from '$lib/types/Review';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
// import Fa from 'svelte-fa';
	import { faCog, faMessage } from '@fortawesome/free-solid-svg-icons';

	import UserBanner from '$lib/Elements/Banners/UserBanner2.svelte';
	import Button from '$lib/Elements/Buttons/Button.svelte';

	const user_id = $page.params.user_id;
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // User data
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: User;
	let reviews: Review[];

	async function get_userdata() {
		// User lookup
		const res = (await fetchWebApi(`admin/user/lookup?user_id=${user_id}`, 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
		data = data;

		// Reviews lookup
		const rev = (await fetchWebApi(`data/reviews/${user_id}`, 'GET')) as Response;
		if (!res.ok) {
			const r = await rev.json();
			return toast.push(r.message);
		}
		const r_ = await rev.json();
		reviews = r_.is;
		reviews = reviews;
	}

	onMount(get_userdata);
</script>

<svelte:head>
	<title>UniFood | User Space</title>
</svelte:head>

<div class="content m-1 flex w-full flex-col items-center justify-center lg:m-4">
	{#if data}
		<div
			class="user_wrap relative flex h-56 w-full items-end justify-center rounded-md bg-COLORDARK-50"
		>
			<img
				class="absolute h-full w-full rounded-md object-cover"
				src={(data?.banner ?? '/homepage/eNkPGV.webp') || config['user']['default-image']}
				alt="{data?.username}'s banner"
				on:error={() => {
					data.banner = config['user']['default-image'];
				}}
			/>
			<!-- tag--->
			<UserBanner
				user={data}
				description={data?.staff ? 'Administrator' : 'Standard Account'}
				editProfilePicture={// Admins only have so much control over users
				data._id == user._id}
			>
				{#if data}
					{#if staff || user._id == data?._id}
						<div
							class="button-wrapper mr-1 h-fit w-full py-2 lg:w-fit lg:p-0"
							on:click={() => goto(`/admin/dashboard/user/manage2?user_id=${data?._id}`)}
						>
							<Button
								icon={faCog}
								color="COLORACCENTD"
								color_t="COLORDARK-75"
								text="Edit Account"
								custom_style="w-full lg:w-fit justify-center lg:justify-start"
							/>
						</div>
					{/if}
					{#if user._id != data?._id}
						<div
							class="button-wrapper h-fit w-full py-2 lg:w-fit lg:p-0"
							on:click={() => {
								localStorage.setItem(
									'current_interaction',
									JSON.stringify({
										channel_id: data?.channel_id,
										username: data?.username
									})
								);
								goto(`/admin/dashboard/messaging/${data?.channel_id}`);
							}}
						>
							<Button
								icon={faMessage}
								color="COLORDARK-75"
								color_t="COLORLIGHT-100"
								text="Message"
								custom_style="w-full lg:w-fit justify-center lg:justify-start"
							/>
						</div>
					{/if}
				{/if}
			</UserBanner>
		</div>

		<!-- Other stuff -->
		<div class="my-8 block w-full">
			<div class="flex justify-start text-2xl font-semibold">
				{#if data}
					{#if user._id == data?._id}
						<span>Your r</span>
					{:else}
						<span>R</span>
					{/if}
				{/if}
				<span>ecent activity</span>
			</div>
			<div
				class="relative mb-10 mt-6 flex h-full flex-col overflow-hidden rounded-2xl bg-COLORDARK-100 text-COLORLIGHT-100 shadow-lg ring-1 ring-COLORDARK-75"
			>
				<div class="border-b border-COLORDARK-75 p-6">
					<h6 class="mb-2 text-base font-semibold">All recent reviews</h6>
					<p class="mb-2 text-sm font-light">
						{#if reviews}
							<span class="font-semibold">{reviews.length}</span> in total
						{/if}
					</p>
				</div>
				<div class="flex-auto p-6">
					<div class="relative flex flex-col justify-center">
						<div class="absolute left-4 h-full border-r-2 border-COLORDARK-75"></div>
						{#if reviews}
							{#if reviews.length === 0}
								<div class="relative mb-4">
									<span
										class="absolute inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 object-cover text-center text-base font-semibold text-white shadow"
									></span>
									<div class="ml-12 w-auto pt-1">
										<h6 class="text-sm font-semibold text-COLORLIGHT-100">No reviews</h6>
										<p class="mt-1 text-xs text-COLORLIGHT-15">
											@{data?.username} has yet to post their first review
										</p>
									</div>
								</div>
							{/if}
							{#each reviews as review}
								{#if review.original_content != undefined}
									<div class="relative mb-4">
										<img
											class="absolute inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 object-cover text-center text-base font-semibold text-white shadow"
											src={review.product.image}
										/>
										<div class="ml-12 w-auto pt-1">
											<a href="/product/{review.product.slug}#{review._id}" class="w-fit"
												><h6 class="text-sm font-semibold text-COLORLIGHT-100 hover:underline">
													{review.product.productName}
												</h6></a
											>
											<p class="mt-1 text-xs text-COLORLIGHT-15">"{review.content}"</p>
										</div>
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

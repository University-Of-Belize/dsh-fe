<script lang="ts">
	import { page } from '$app/stores';
	import config from '$lib/config/settings';
	import type { Review } from '$lib/types/Review';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	// import Fa from 'svelte-fa';
	// import { faCog } from '@fortawesome/free-solid-svg-icons';

	import UserBanner from '$lib/Elements/Banners/UserBanner2.svelte';

	const user_id = $page.params.user_id;
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // User data
	let data: User;
	let reviews: Review[];

	onMount(async () => {
		// User lookup
		const res = (await fetchWebApi(`v1/admin/user/lookup?user_id=${user_id}`, 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
		data = data;

		// Reviews lookup
		const rev = (await fetchWebApi(`v1/data/reviews/${user_id}`, 'GET')) as Response;
		if (!res.ok) {
			const r = await rev.json();
			return toast.push(r.message);
		}
		const r_ = await rev.json();
		reviews = r_.is;
		reviews = reviews;
	});
</script>

<svelte:head>
	<title>UniFood | User Space</title>
</svelte:head>

<div class="content mx-4 flex w-full flex-col items-center justify-center">
	{#if data}
		<div
			class="user_wrap relative flex h-56 w-full items-end justify-center rounded-md bg-COLORBLK2"
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
			/>
		</div>

		<!-- Other stuff -->
		<div class="my-4 block w-full">
			<div class="text-2xl font-semibold">Recent Activity</div>
			<div
				class="relative my-10 flex h-full flex-col overflow-hidden rounded-2xl bg-white text-gray-600 shadow-lg ring-1 ring-gray-200"
			>
				<div class="border-b p-6">
					<h6 class="mb-2 text-base font-semibold">All recent reviews</h6>
					<p class="mb-2 text-sm font-light">
						{#if reviews}
							<span class="font-semibold">{reviews.length}</span> in total
						{/if}
					</p>
				</div>
				<div class="flex-auto p-6">
					<div class="relative flex flex-col justify-center">
						<div class="absolute left-4 h-full border-r-2"></div>
						{#if reviews}
							{#if reviews.length === 0}
								<div class="relative mb-4">
									<span
										class="absolute inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 object-cover text-center text-base font-semibold text-white shadow"
									></span>
									<div class="ml-12 w-auto pt-1">
										<h6 class="text-sm font-semibold text-blue-900">No reviews</h6>
										<p class="mt-1 text-xs text-gray-500">
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
												><h6 class="text-sm font-semibold text-blue-900 hover:underline">
													{review.product.productName}
												</h6></a
											>
											<p class="mt-1 text-xs text-gray-500">"{review.content}"</p>
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

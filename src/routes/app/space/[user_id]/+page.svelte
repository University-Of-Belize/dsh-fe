<script lang="ts">
	import config from '$lib/config/settings';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';

	import Fa from 'svelte-fa';
	import { faCog } from '@fortawesome/free-solid-svg-icons';

	import UserBanner from '$lib/Elements/Banners/UserBanner2.svelte';

	const user_id = $page.params.user_id;
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // User data
	let data: User;

	onMount(async () => {
		const res = (await fetchWebApi(`v1/admin/user/lookup?user_id=${user_id}`, 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
		data = data;
	});
</script>

<div class="content flex flex-1 items-center justify-center">
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
	{/if}
</div>

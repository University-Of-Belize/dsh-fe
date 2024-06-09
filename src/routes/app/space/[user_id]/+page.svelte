<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';

	const user_id = $page.params.user_id;
	let data: User;

	onMount(async () => {
		const res = (await fetchWebApi(`v1/admin/user/lookup?user_id=${user_id}`, 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
	});
</script>

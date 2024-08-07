<script lang="ts">
	import ExperimentsList from '$lib/Elements/Dashboard/ExperimentsList.svelte';
	import type { Article } from '$lib/types/Article';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Article[]; // Declare the data variable
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	$: data; // List of article (Article[])

	async function catchAll() {
		const res = (await fetchWebApi('dash', 'GET')) as Response; // Check if we're signed in
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
	<title>UniFood | Dashboard / Experiments</title>
</svelte:head>

<div class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 lg:px-16 lg:py-16 pb-40">
	<div class="flex w-full flex-wrap justify-between pb-2 text-2xl font-semibold">
		<div>Experiments</div>
	</div>
	<div class="block pb-12 text-xl font-light">
		<div>Experimental features panel.</div>
		<div class="text-COLORACCENTL">Try at your own risk.</div>
	</div>
	<div class="flex w-full flex-col flex-wrap">
		<div class="block">
			<div class="text-xl font-medium">About Experiments</div>
			<div class="text-md font-normal">
				By enabling these features, you could lose browser data or risk banning or compromising your
				account.<br /><br />Experiments is a way of rolling out features and allowing internal
				testers to try them out before release.<br />
				Experiments is a collection of pages and features of which some may be enabled.<br />Some
				experiments may be unstable, or completely unusable. Nothing is guaranteed.<br /><br />
				Enabled features are session-based for obvious reasons. This means that if you log out, you will
				lose access<br />to the experiment and it has to be enabled again. This is to prevent any
				further data loss or corruption.<br />
				<br />Run into any errors? Submit feedback through the designated panel.<br />
				Use at your own risk.
			</div>
		</div>
		<div class="pt-8 text-2xl font-semibold">Available Experiments</div>
		<div class="flex flex-col-reverse">
			<div class="user_wrap w-full">
				{#if data !== undefined}
					<ExperimentsList />
				{:else}<div class="font-light">There was a problem while displaying the data.</div>{/if}
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

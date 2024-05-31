<script lang="ts">
	import { page } from '$app/stores';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { onMount } from 'svelte';

	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let navDrawer: HTMLDivElement;
</script>

<main class="h-screen w-full overflow-hidden">
	<div class="navigation z-20 w-full">
		<Navigation
			transparency={5}
			search={true}
			titleText=""
			titleWhere="/"
		/>
	</div>
	<div class="main-content flex h-full items-center justify-start overflow-hidden text-COLORWHT">
        <div
        class="drawer h-screen w-full flex-col justify-start overflow-auto bg-COLORWHT4 bg-opacity-20 px-4 py-2 lg:w-1/4"
    >
        <DashList {staff} />
    </div>
		<slot />
	</div>
</main>

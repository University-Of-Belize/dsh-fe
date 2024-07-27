<script lang="ts">
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';

	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let navDrawer: HTMLDivElement;
</script>

<main class="h-screen w-full overflow-hidden">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleText="" titleWhere="/admin/dashboard" />
	</div>
	<div class="main-content flex h-full items-center justify-start overflow-hidden text-COLORLIGHT-100">
		<div
			class="drawer hidden h-screen w-full flex-col justify-start overflow-auto px-4 py-2 lg:block lg:w-1/4"
		>
			<DashList {staff} />
		</div>
		<slot />
	</div>
</main>

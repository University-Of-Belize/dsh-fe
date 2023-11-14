<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import config from '$lib/config/settings.json';
	import {
		faCog,
		faHamburger,
		faList,
		faMessage,
		faPlus,
		faQuestion,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this

	interface DashData {
		what: string;
		is: Array<Array<string | string[]>>;
	}
	let data: DashData;
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation
			transparency={5}
			search={true}
			titleText="Cafe"
			titleWhere="/"
		/>
	</div>
	<div class="main-content flex items-center justify-start h-full text-COLORBLK">
		
		<div class="content hidden lg:block px-16 py-16 w-full h-full bg-transparent">
			<div class="flex text-2xl font-semibold pb-2">
				Checkout / My Cart
			</div>
			<div class="flex text-xl font-semibold pb-12">Confirm your order</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
				{:else}<div class="font-light">
						There was a problem while loading the shortcuts.
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

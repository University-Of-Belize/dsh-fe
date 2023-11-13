<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import config from '$lib/config/settings.json';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import {
		faGift,
		faLock,
		faRectangleAd,
		faRightToBracket,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import Fa from 'svelte-fa';
	
	
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} titleText="Cafe | Dashboard" titleWhere="/admin/dashboard"/>
	</div>
	<div class="main-content flex items-center justify-center h-full">
	
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

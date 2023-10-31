<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faBars,
		faBurger,
		faCog,
		faGift,
		faRightToBracket,
		faSearch,
		faUtensils,
		faWhiskeyGlass
	} from '@fortawesome/free-solid-svg-icons';
	import Button from './Button.svelte';
	import { goto } from '$app/navigation';
	export let transparency: number = 0;
	export let search: boolean = true;
	export let user: object | undefined = undefined;
	let nav: HTMLDivElement;
	let navDrawer: HTMLDivElement;
	let navClose: HTMLDivElement;
	let navToggle: HTMLDivElement;
	let navTransparency: number = 0;

	function toggleNav() {
		// Loop till the opacity reaches zero while moving the drawer to the left
		if (navTransparency == 0) {
			nav.style.opacity = '1';
			navTransparency = 1;
		} else {
			nav.style.opacity = '0';
			navTransparency = 0;
		}
	}
</script>

<div
	class="placeholder bg-opacity-25 bg-opacity-50 bg-opacity-75 bg-opacity-0 bg-opacity-10 hidden"
>
	&nbsp;
</div>

<div class="navigator w-full h-full select-none">
	<div class="navigation bg-COLORWHT bg-opacity-{transparency} w-full pl-2 pr-4 py-4 text-lg">
		<div class="content bg-opacity-100 flex items-center">
			<div
				class="sidenav bg-COLORBLK bg-opacity-5 cursor-pointer hover:bg-opacity-20 px-4 py-3 rounded-sm mr-2"
				bind:this={navToggle}
				on:click={toggleNav}
			>
				<Fa icon={faBars} size="1.01x" class="text-black" />
			</div>
			<h1 class="text-COLORBLK font-semibold">Cafe</h1>
			{#if search}
				<div
					class="searchbar flex-1 flex rounded-sm bg-COLORWHT1 px-4 py-2 mx-8 items-center text-sm"
				>
					<div class="searchicon w-fit">
						<Fa icon={faSearch} size="1.01x" class="text-COLORBLK pr-4" />
					</div>
					<input
						type="text"
						name="search"
						class="w-full font-regular focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Search for snacks, drinks and lunch"
					/>
				</div>
			{:else}<div class="searchbar flex-1 flex px-4 py-2 mx-8 items-center text-sm" />
			{/if}

			{#if !user}
				<Button icon={faRightToBracket} color="COLORYLW" text="Login" />
			{:else}
				<img
					src={user.profile ?? './placeholder/avatar.png'}
					alt="{user.username}'s photo"
					width="40px"
					class="rounded-full cursor-pointer hover:opacity-80"
					style="height: 40px;"
					on:click={async () => {
						await goto('/admin/dashboard/');
					}}
				/>
			{/if}
		</div>
	</div>

	<div
		class="sidebar flex justify-start items-center w-full h-screen bg-black bg-opacity-25"
		style="opacity: 0"
		bind:this={nav}
	>
		<div
			class="drawer bg-COLORWHT px-2 py-2 flex-col justify-start h-screen bg-opacity-100"
			bind:this={navDrawer}
		>
			<div class="top-row flex justify-between items-center w-full pt-2">
				<div class="btn-wrp pr-1">
					<Button icon={faRightToBracket} color="COLORYLW" text="Login" />
				</div>
				<div class="btn-wrp pl-2" />
				<Button icon={faGift} color="COLORPNK" text="Sign up" color_t="COLORWHT" />
			</div>
			<div class="two py-6">
				<Button
					icon={faCog}
					color="COLORBLK"
					text="My account settings"
					color_t="COLORWHT"
					custom_style="w-full"
				/>
			</div>
			<div class="three py-6 border-t border-black border-dashed border-opacity-5">
				<div class="title font-semibold pb-5">Categories</div>
				<div class="two pt-1">
					<Button
						icon={faWhiskeyGlass}
						color="COLORWHT3"
						text="Beverages/Drinks"
						color_t="COLORBLK"
						custom_style="w-full font-semibold"
					/>
				</div>
				<div class="two pt-1">
					<Button
						icon={faBurger}
						color="COLORWHT3"
						text="Food"
						color_t="COLORBLK"
						custom_style="w-full font-semibold"
					/>
				</div>
				<div class="two pt-1">
					<Button
						icon={faUtensils}
						color="COLORWHT3"
						text="Snacks"
						color_t="COLORBLK"
						custom_style="w-full font-semibold"
					/>
				</div>
			</div>
		</div>
		<div class="outerNav bg-transparent h-full flex-1" bind:this={navClose} on:click={toggleNav}>
			&nbsp;
		</div>
	</div>
</div>

<style>
	.navigation {
		/* background: rgba(227, 223, 209, 0.08); */
		box-shadow: 0px 4px 110px 110px rgba(42, 26, 31, 0.08);
		backdrop-filter: blur(2.5px);
	}
</style>

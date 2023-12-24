<script lang="ts">
	import { goto } from '$app/navigation';
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	import {
		faArrowRightFromBracket,
		faBars,
		// faBasketShopping,
		faCartShopping,
		faCog,
		faCogs,
		faDownload,
		// faDashboard,
		faGift,
		faRightToBracket,
		faSearch,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import Button from './Button.svelte';
	import IconButton from './IconButton.svelte';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	export let transparency: number = 0;
	export let search: boolean = true;
	export let value: string = '';
	export let titleText: string = 'Cafe';
	export let titleWhere: string = '/';
	export let user: User | undefined = undefined;
	let nav: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let navDrawer: HTMLDivElement;
	let navClose: HTMLDivElement;
	let debug_selection: HTMLDivElement;
	let debug_panel: HTMLDivElement;
	let hidden: boolean = true;
	let navToggle: HTMLDivElement;
	let navTransparency: number = 0;
	let cachedCategories = localStorage.getItem('categories');
	let categories: Category[] = [];
	let installPrompt;

	onMount(async () => {
		installPrompt = window.installPrompt;
		if (!localStorage.user) {
			if (localStorage.token) {
				try {
					const response = await fetchWebApi('v1/admin/user/lookup', 'GET');
					if (!response) return;
					const data = await response.json();
					// console.log(data);
					user = data.is; // Get the user
					localStorage.setItem('user', JSON.stringify(user));
					localStorage.setItem('user_id', user._id); // Ensure token login is possible
				} catch (error) {
					console.log(error);
					toast.push(
						`Oops. Something unexpected happened while loading the navigation: ${error.message}`
					);
				}
			}
		} else {
			user = JSON.parse(localStorage.user);
		}
		getCategories(); // Always do this on mount
	});

	function toggleNav() {
		// Loop till the opacity reaches zero while moving the drawer to the left
		if (navTransparency == 0) {
			nav.style.opacity = '1';
			nav.style.display = 'flex';
			navTransparency = 1;
			document.body.style.overflow = 'hidden';
		} else {
			nav.style.opacity = '0';
			nav.style.display = 'none';
			navTransparency = 0;
			document.body.style.overflow = 'initial';
		}
	}

	async function getCategories() {
		if (!cachedCategories) {
			const response = await fetchWebApi('v1/category', 'GET');
			if (!response) return;
			const data = await response.json();
			categories = data.is; // Category[]
			categories = categories.filter((category: Category) => !category.hidden);
			localStorage.setItem('categories', JSON.stringify(categories));
		} else {
			categories = JSON.parse(cachedCategories);
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
				title="Pop open the navigation"
				class="sidenav bg-COLORBLK bg-opacity-5 cursor-pointer hover:bg-opacity-20 px-4 py-3 rounded-sm mr-2"
				bind:this={navToggle}
				on:click={toggleNav}
			>
				<Fa icon={faBars} size="1.01x" class="text-black" />
			</div>
			<h1
				class="flex text-COLORBLK font-semibold hover:underline cursor-pointer"
				on:click={() => goto(`${titleWhere}`)}
			>
				{@html staff ? titleText + ' | Staff Mode' : titleText}
			</h1>
			{#if search}
				<form
					class="searchbar flex-1 hidden lg:flex rounded-sm bg-COLORWHT1 px-4 py-2 lg:mx-8 items-center text-sm bg-opacity-90"
					action="/product"
				>
					<div class="searchicon w-fit">
						<Fa icon={faSearch} size="1.01x" class="text-COLORBLK pr-4" />
					</div>
					<input
						{value}
						type="text"
						title="Click to search for snacks, drinks and lunch"
						name="search"
						class="w-full font-regular focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Search for snacks, drinks and lunch"
					/>
				</form>
			{:else}<div class="searchbar flex-1 flex px-4 py-2 mx-8 items-center text-sm" />
			{/if}
			<div
				class="block lg:hidden mobile-flex-fix flex-1 lg:flex-none w-full items-center justify-center text-sm mx-8"
			>
				{@html staff ? '' : config['ui']['notice']}
			</div>

			{#if !user}
				<div class="flex space-x-4">
					<div
						title="Sign in to access content"
						class="btn-wrp"
						on:click={async () => {
							await goto('/auth/login');
						}}
					>
						<Button icon={faRightToBracket} color="COLORYLW" text="Log in" />
					</div>
					{#if installPrompt}
					<div
						title="Install the app onto your device"
						class="btn-wrp"
						on:click={async () => {
							await window.installPrompt.prompt();
							window.location.reload();
						}}
					>
						<Button icon={faDownload} color="COLORBLE" color_t="COLORWHT" text="Install" />
					</div>
					{/if}
				</div>
			{:else}
				<div class="pnav flex items-center justify-center lg:space-x-4">
					{#if staff}
						<div class="btn-wrp" title="Admin dashboard" on:click={() => goto('/admin/dashboard')}>
							<IconButton icon={faCogs} color="COLORWHT" color_t="COLORBLE" />
						</div>{/if}
					<div class="btn-wrp" title="My shopping cart" on:click={() => goto('/product/checkout')}>
						<IconButton icon={faCartShopping} color="COLORWHT" color_t="COLORBLK" />
					</div>
					<img
						src={user.profile_picture ?? config['user']['default-image']}
						title="My profile"
						alt="{user.username}'s photo"
						width="40px"
						class="rounded-full cursor-pointer hover:opacity-80"
						style="height: 40px;"
						on:click={async () => {
							await goto(`/admin/dashboard/user/manage?user_id=${localStorage.user_id}`);
						}}
					/>
				</div>
			{/if}
		</div>
		{#if staff}
			<div
				class="cursor-pointer hover:underline bg-opacity-50 bg-COLORWHT px-2 my-1"
				bind:this={debug_selection}
				on:click={() => {
					if (hidden) {
						debug_selection.innerText = 'Show debug...';
					} else {
						debug_selection.innerText = 'Hide debug...';
					}
					debug_panel.classList.toggle('hidden');
				}}
			>
				<div class="bg-opacity-100 text-COLORBLK">Show debug...</div>
			</div>
			<div class="flex hidden debug w-full my-4" bind:this={debug_panel}>
				<div class="lefthand block">
					<div class="lefthand-contents block px-2 select-text">
						<div class="origin w-full"><b>Origin:</b> {config['server']['HTTPOrigin']}</div>
						<div class="currency w-full"><b>Currency:</b> {config['checkout']['currency']}</div>
						<div class="support-email w-full">
							<b>Support email:</b>
							{config['server']['support-email']}
						</div>
						<div class="version w-full"><b>UI version:</b> {config['ui']['version']}</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div
		class="sidebar flex justify-start items-center w-full h-screen bg-black bg-opacity-25"
		style="opacity: 0; display: none"
		bind:this={nav}
	>
		<div
			class="drawer bg-COLORWHT px-2 py-2 flex-col justify-start h-screen bg-opacity-100"
			bind:this={navDrawer}
		>
			{#if search}
				<form
					class="searchbar flex-1 lg:hidden flex rounded-sm bg-COLORWHT1 px-4 py-2 lg:mx-8 my-1 items-center text-sm bg-opacity-90"
					action="/product"
				>
					<div class="searchicon w-fit">
						<Fa icon={faSearch} size="1.01x" class="text-COLORBLK pr-4" />
					</div>
					<input
						{value}
						type="text"
						name="search"
						class="w-full font-regular focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Search for snacks, drinks and lunch"
					/>
				</form>
			{:else}<div class="searchbar flex-1 flex px-4 py-2 mx-8 items-center text-sm" />
			{/if}
			{#if !user}
				<div class="top-row flex justify-between items-center w-full pt-2">
					<div class="btn-wrp pr-1" on:click={() => goto('/auth/login')}>
						<Button icon={faRightToBracket} color="COLORYLW" text="Log in" />
					</div>
					<div class="btn-wrp pl-2" on:click={() => goto('/auth/register')}>
						<Button icon={faGift} color="COLORPNK" text="Sign up" color_t="COLORWHT" />
					</div>
				</div>{:else}
				<div class="two py-6 space-y-2">
					<div class="title font-semibold pb-5">My Account</div>
					<div
						on:click={async () => {
							localStorage.clear();
							window.location.reload();
						}}
					>
						<Button
							icon={faArrowRightFromBracket}
							color="COLORBLK"
							text="Logout"
							color_t="COLORWHT"
							custom_style="w-full"
						/>
					</div>
					<div
						on:click={async () => {
							await goto(`/admin/dashboard/user/manage?user_id=${localStorage.user_id}`);
						}}
					>
						<Button
							icon={faCog}
							color="COLORBLK"
							text="My account settings"
							color_t="COLORWHT"
							custom_style="w-full"
						/>
					</div>
				</div>{/if}
			<div class="three py-6 border-t border-black border-dashed border-opacity-5">
				{#if categories.length > 0}
					{#each categories as category}
						<div
							class="two pt-1"
							on:click={() => {
								goto(
									`/product?filter=${
										category.alias
											? category.alias.toString().toLowerCase()
											: category.name.toString().toLowerCase()
									}`
								);
							}}
						>
							<Button
								icon={faStar}
								color="COLORWHT3"
								text={category.alias ?? category.name}
								color_t="COLORBLK"
								custom_style="w-full font-semibold"
							/>
						</div>
					{/each}
				{:else}
					<div class="two pt-1">
						<Button
							icon={faStar}
							color="COLORWHT3"
							text="Looks like you caught us! Just a moment."
							color_t="COLORBLK"
							custom_style="w-full font-semibold"
						/>
					</div>
				{/if}
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

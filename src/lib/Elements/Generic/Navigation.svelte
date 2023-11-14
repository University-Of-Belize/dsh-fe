<script lang="ts">
	import { goto } from '$app/navigation';
	import config from '$lib/config/settings.json';
	import {
		faBars,
		faCog,
		faGift,
		faRightToBracket,
		faSearch,
		faStar
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Button from './Button.svelte';
	import { onMount } from 'svelte';
	import { toast } from '@zerodevx/svelte-toast';
	export let transparency: number = 0;
	export let search: boolean = true;
	export let value: string = '';
	export let titleText: string = 'Cafe';
	export let titleWhere: string = '/';
	export let user: object | undefined = undefined;
	let nav: HTMLDivElement;
	let navDrawer: HTMLDivElement;
	let navClose: HTMLDivElement;
	let navToggle: HTMLDivElement;
	let navTransparency: number = 0;
	let cachedCategories = localStorage.getItem('categories');
	let categories = [];

	onMount(async () => {
		if (!localStorage.user) {
			if (localStorage.token) {
				try {
					const response = await fetch(
						`${config['server']['HTTPOrigin']}/api/v1/search?filter=user_id&q=${localStorage.user_id}`,
						{
							headers: {
								Authorization: `Bearer ${localStorage.token}`
							}
						}
					);
					const data = await response.json();
					console.log(data);
					user = data[0]; // Not a what is. It's a search
					localStorage.setItem('user', JSON.stringify(user));
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
			const response = await fetch(`${config.server.HTTPOrigin}/api/v1/category`);
			const data = await response.json();
			categories = data.is;
			localStorage.setItem('categories', JSON.stringify(categories));
		} else {
			categories = JSON.parse(cachedCategories);
		}
	}
	getCategories();
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
			<h1
				class="flex text-COLORBLK font-semibold hover:underline cursor-pointer"
				on:click={() => goto(`${titleWhere}`)}
			>
				{@html titleText}
			</h1>
			{#if search}
				<form
					class="searchbar flex-1 flex rounded-sm bg-COLORWHT1 px-4 py-2 mx-8 items-center text-sm bg-opacity-90"
					action="/products"
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
				<div
					class="btn-wrp"
					on:click={async () => {
						await goto('/auth/login');
					}}
				>
					<Button icon={faRightToBracket} color="COLORYLW" text="Log in" />
				</div>
			{:else}
				<img
					src={user.profile_picture ?? '/placeholder/avatar.png'}
					alt="{user.username}'s photo"
					width="40px"
					class="rounded-full cursor-pointer hover:opacity-80"
					style="height: 40px;"
					on:click={async () => {
						await goto(`/admin/dashboard/user/manage?user_id=${user.id}`);
					}}
				/>
			{/if}
		</div>
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
			{#if !user}
				<div class="top-row flex justify-between items-center w-full pt-2">
					<div class="btn-wrp pr-1" on:click={() => goto('/auth/login')}>
						<Button icon={faRightToBracket} color="COLORYLW" text="Log in" />
					</div>
					<div class="btn-wrp pl-2" on:click={() => goto('/auth/register')}>
						<Button icon={faGift} color="COLORPNK" text="Sign up" color_t="COLORWHT" />
					</div>
				</div>{:else}
				<div class="two py-6">
					<div class="title font-semibold pb-5">My Account</div>
					<div
						on:click={async () => {
							await goto(`/admin/dashboard/user/manage?user_id=${user?.id}`);
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
								goto(`/products?filter=${category.name.toString().toLowerCase()}`);
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

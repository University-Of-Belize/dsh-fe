<script lang="ts">
	import IconButton from '$lib/Elements/Buttons/IconButton.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import { clickOutside } from '$lib/Elements/Utility/clickOutside';
	import { Button, ButtonGroup, Drawer } from 'flowbite-svelte';
	import Fa from 'svelte-fa';
	import { sineIn } from 'svelte/easing';
/***********************/
	import { goto } from '$app/navigation';
	import config from '$lib/config/index';
	import type { Category } from '$lib/types/Category';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faArrowRightFromBracket,
		faBars,
		faBurger,
		faClone,
		faCodePullRequest,
		faCog,
		faFeed,
		// faDashboard,
		faGift,
		faMessage,
		faMoon,
		faNoteSticky,
		faPaintbrush,
		faPlus,
		faQuestionCircle,
		faRightToBracket,
		faSearch,
		faShoppingCart,
		faStar,
		faSun,
		faTag,
		faUserPlus,
		faVial,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	export let transparency: number = 0;
	export let search: boolean = true;
	export let value: string = '';
	export let titleText: string = config.ui['branding-text'];
	export let titleWhere: string = '/';
	export let user: User | undefined = localStorage.user;
	let nav: HTMLDivElement;
	let staff: boolean = localStorage.staff === 'true'; // Others will use this
	let darkMode: boolean = localStorage.theme === 'dark'; // Others will use this
	let navDrawer: HTMLDivElement;
	let navClose: HTMLDivElement;
	let mobile_search: HTMLDivElement;
	let navScrimHeight: number = 0;
	let navTransparency: number = 0;
	let cachedCategories = localStorage.getItem('categories');
	let categories: Category[] = [];
	let installPrompt;
	let offLine: boolean = false;
	let hidden1: boolean = true;
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	// Dropdowns
	let user_dropdown: HTMLDivElement;
	let apps_dropdown: HTMLDivElement;
	let theme_switched: boolean = false;
	let themedrawer_isHidden: boolean;

	onMount(async () => {
		themedrawer_isHidden = localStorage.getItem('themedrawer_isHidden') == 'true';
		// Set the scrim height
		navScrimHeight = window.innerHeight; // Full height (inside screen-view)
		// @ts-ignore
		installPrompt = window.installPrompt;
		offLine = !window.navigator.onLine;
		if (offLine) {
			localStorage.setItem('serverOffline', 'true');
		}
		if (!localStorage.user) {
			if (localStorage.token) {
				try {
					const response = (await fetchWebApi('admin/user/lookup', 'GET')) as Response;
					if (!response) return;
					const data = await response.json();
					// console.log(data);
					user = data.is; // Get the user
					localStorage.setItem('user', JSON.stringify(user));
					localStorage.setItem('user_id', user?._id ?? ''); // Ensure token login is possible
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

	async function getCategories() {
		if (!cachedCategories) {
			const response = (await fetchWebApi('category', 'GET')) as Response;
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

<Drawer
	transitionType="fly"
	{transitionParams}
	bind:hidden={hidden1}
	id="sidebar"
	class="bg-COLORDARK-100 p-5 text-COLORLIGHT-100"
>
	<div class="flex h-full flex-col">
		<div class="nav-main block">
			<div class="metaControls flex pb-4">
				<Button
					on:click={() => (hidden1 = true)}
					title="Toggle the sidebar"
					aria-expanded="true"
					aria-controls="sidebar"
					class="mr-2 inline cursor-pointer rounded-lg bg-COLORDARK-75 p-2 text-COLORLIGHT-100 hover:bg-COLORDARK-75 hover:text-COLORLIGHT-75 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:mr-3 lg:rounded"
				>
					<span class="sr-only">Toggle sidebar</span>
					<Fa icon={faBars} />
				</Button>
				<a href="/" class="mr-4 flex">
					<img
						src={config.ui['branding-logo']}
						class="mr-3 h-8"
						alt="{config.ui['branding-text']} Logo"
					/>
					<span class="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
						<!-- {#if titleText !== config.ui['branding-text']} -->
						{@html titleText.length > 15 ? titleText.substring(0, 15) + '...' : titleText}
						<!-- {:else}
							<img
								src={darkMode ? '/icons/splash/splash-dark.svg' : '/icons/splash/splash-light.svg'}
								class="mr-3 h-8"
								alt="{config.ui['branding-text']} Logo"
							/>
						{/if} -->
					</span>
				</a>
			</div>
			{#if user}
				<div class="my-2 mb-4">
					<div
						class="wallet-indicator text-COLORLIGHT flex w-full cursor-pointer items-center justify-start space-x-4 rounded-md bg-COLORDARK-50 px-2 py-4 text-sm font-medium hover:opacity-80"
						on:click={async () => {
							await goto(`/app/space/${localStorage.user_id}`);
						}}
					>
						<div>
							<img
								src={user?.profile_picture ?? config['user']['default-image']}
								title="My profile"
								alt="{user?.username}'s photo"
								width="40px"
								class="rounded-full border border-COLORLIGHT-100 bg-COLORDARK-50 object-cover"
								style="height: 42px; width: 42px;"
							/>
						</div>
						<div>Wallet (${parseFloat(user?.credit?.$numberDecimal).toFixed(2)})</div>
					</div>
				</div>
			{/if}
			{#if !user}
				{#if search}
					<SearchBar nomargin placeholder="Search for snacks, drinks or lunch" />
				{:else}
					<div class="searchbar mx-8 flex flex-1 items-center px-4 py-2 text-sm" />
				{/if}
				<div class="top-row flex w-full items-center justify-between pt-2">
					<!-- <div class="btn-wrp pr-1" >
			</div>
			<div class="btn-wrp pl-2" >
			</div> -->
					<ButtonGroup class="flex w-full">
						<Button
							on:click={() => goto('/auth/login')}
							class="flex-1 bg-COLORDARK-50 text-COLORLIGHT-100"
						>
							<Fa icon={faRightToBracket} class="mr-2" />
							Log in</Button
						>
						<Button
							on:click={() => goto('/auth/create')}
							class="flex-1 bg-COLORACCENTL text-COLORLIGHT-100"
						>
							<Fa icon={faGift} class="mr-2" />
							Sign up</Button
						>
					</ButtonGroup>
				</div>{:else}
				<div class="two space-y-2 py-6">
					<div class="title pb-5 font-semibold">My Account</div>

					<Button
						class="w-full bg-COLORDARK-50 text-COLORLIGHT-100 hover:bg-COLORACCENTL"
						on:click={async () => {
							localStorage.clear();
							localStorage.setItem('theme', 'dark');
							setTimeout(() => {
								window.location.reload();
							}, 1000);
						}}
					>
						<Fa icon={faArrowRightFromBracket} class="mr-2" />
						Logout</Button
					>

					<Button
						class="w-full bg-COLORDARK-75 text-COLORLIGHT-100 hover:bg-COLORDARK-75 hover:opacity-80"
						on:click={async () => {
							await goto(`/admin/dashboard/user/manage2?user_id=${localStorage.user_id}`);
						}}
					>
						<Fa icon={faCog} class="mr-2" />
						My account settings</Button
					>
				</div>{/if}
			<div class="three border-t border-dashed border-black border-opacity-5 py-6">
				<div class="title pb-5 font-semibold">Categories</div>
				{#if categories.length > 0}
					{#each categories as category}
						<div
							class="two pt-1"
							on:click={() => {
								goto(
									// We filter by alias, display by name
									`/product?filter=${
										category.alias
											? category.alias.toString().toLowerCase()
											: category.name.toString().toLowerCase()
									}`
								);
							}}
						>
							<Button
								class="w-full bg-COLORDARK-75 font-medium text-COLORLIGHT-100 hover:bg-COLORDARK-75 hover:opacity-80 lg:justify-start lg:text-left"
							>
								<Fa icon={faStar} class="mr-2 hidden lg:block" />
								{category.name ?? category.alias}</Button
							>
						</div>
					{/each}
				{:else}
					<div class="two pt-1">
						<Button class="w-full bg-COLORDARK-75 font-semibold text-COLORLIGHT-100">
							<Fa icon={faQuestionCircle} class="mr-2" />
							Looks like you caught us! Just a moment.</Button
						>
					</div>
				{/if}
			</div>
		</div>
		<div class="nav-footer mt-auto block w-full space-y-2 text-xs font-light text-COLORLIGHT-100">
			<div class="flex w-full items-center justify-between divide-x-2 text-center">
				<div class="flex w-full items-center justify-center text-center hover:underline">
					<a aria-label="View the app credits" href="/app/credits">Credits</a>
				</div>
				<!-- @remind Enable as we continue to create these new, informational pages -->
				<!-- <div class="w-full text-center flex justify-center items-center hover:underline"><a href="#">About</a></div> -->
				<!-- <div class="w-full text-center flex justify-center items-center hover:underline"><a href="#">Jobs</a></div> -->
				<div class="w-full text-center flex justify-center items-center hover:underline"><a href="/app/legal/terms">Terms</a></div>
				<div class="flex w-full items-center justify-center text-center hover:underline">
					<a aria-label="View the help center" href="/app/help-center">Blog</a>
				</div>
			</div>
			<div>
				&copy; {new Date().getFullYear()} <a href="https://github.com/AlexDev404">AlexDev404</a>
			</div>
		</div>
	</div>
</Drawer>

<header class="border-b border-COLORDARK-25 bg-COLORDARK-100 antialiased bg-opacity-{transparency}">
	<nav class="bg-opacity-100 px-4 py-2.5 text-COLORLIGHT-100 opacity-100 lg:px-6">
		<div class="flex flex-wrap items-center justify-between">
			<!-- Logo and labels -->
			<div class="flex items-center justify-start">
				<Button
					on:click={() => (hidden1 = false)}
					title="Toggle the sidebar"
					aria-expanded="true"
					aria-controls="sidebar"
					class="mr-2 inline cursor-pointer rounded-lg bg-COLORDARK-75 p-2 text-COLORLIGHT-100 hover:bg-COLORDARK-75 hover:text-COLORLIGHT-75 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:mr-3 lg:rounded"
				>
					<span class="sr-only">Toggle sidebar</span>
					<Fa icon={faBars} />
				</Button>
				<a href={titleWhere} class="flex">
					{#if config.ui['branding-logo'] && config.ui['branding-logo'].trim() != ''}
						<img src={config.ui['branding-logo']} class="h-8 w-8 object-cover" alt="Service Logo" />
					{:else}
						<span class="flex self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
							<!-- {@html staff ? `${titleText} | Staff` : titleText} -->
							{@html titleText}
						</span>
					{/if}
				</a>

				<!-- TBD -->
				<!-- <a href={titleWhere} class="mr-4 flex">
					{#if config.ui['branding-logo'] && config.ui['branding-logo'].trim() != ''}
						<img src={config.ui['branding-logo']} class="mr-3 h-8" alt="Service Logo" />
					{/if}

					<span class="flex self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
						<!- {@html staff ? `${titleText} | Staff` : titleText} ->
						{@html titleText}
					</span>
				</a> -->
			</div>
			<div class="hidden flex-1 items-center justify-center lg:flex">
				<!-- Searchbar -->
				<SearchBar {value} {transparency} placeholder="Search for snacks, drinks or lunch" />
			</div>
			<!-- Login buttons, etc. -->
			<div class="flex items-center lg:order-2">
				{#if installPrompt}
					<button
						on:click={async () => {
							await window.installPrompt.prompt();
							window.location.reload();
						}}
						type="button"
						class="mr-2 hidden items-center justify-center rounded-lg bg-COLORDARK-50 px-3 py-1.5 text-xs font-medium hover:opacity-80 focus:outline-none focus:ring-4 sm:inline-flex lg:px-4 lg:py-2"
						><Fa icon={faPlus} class="mr-4" /> Install app</button
					>
				{/if}

				<!------ Included for unauthed users-->
				<!-- Search -->
				<button
					id="toggleSidebarMobileSearch"
					on:click={() => {
						mobile_search.classList.toggle('hidden');

						setTimeout(() => {
							mobile_search.style.height = mobile_search.style.height == '30px' ? '0px' : '30px';
						}, 10);
					}}
					type="button"
					class="text-COLORLIGHT mr-3 flex items-center justify-start rounded-lg bg-COLORDARK-75 p-1.5 hover:bg-COLORDARK-75 hover:text-COLORLIGHT-75 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm md:mr-2 lg:mr-0 lg:hidden"
				>
					<span class="sr-only">Search</span>
					<!-- Search icon -->
					<Fa icon={faSearch} />
					<span class="ml-4 mr-3 hidden md:inline">Search</span>
				</button>

				{#if user}
					<!---
					<!- Notifications ->
					<button
						type="button"
						data-dropdown-toggle="notification-dropdown"
						class="mr-1 rounded-lg p-2 text-COLORLIGHT hover:bg-COLORDARK-75 hover:text-COLORLIGHT-75 focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
					>
						<span class="sr-only">View notifications</span>
						<!- Bell icon ->
						<svg
							class="h-5 w-5"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 14 20"
							><path
								d="M12.133 10.632v-1.8A5.406 5.406 0 0 0 7.979 3.57.946.946 0 0 0 8 3.464V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C1.867 13.018 0 13.614 0 14.807 0 15.4 0 16 .538 16h12.924C14 16 14 15.4 14 14.807c0-1.193-1.867-1.789-1.867-4.175ZM3.823 17a3.453 3.453 0 0 0 6.354 0H3.823Z"
							/></svg
						>
					</button>
					<!- Dropdown menu ->
					<div
						class="z-50 my-4 hidden max-w-sm list-none divide-y divide-gray-100 overflow-hidden rounded bg-white text-base shadow-lg dark:divide-gray-600 dark:bg-gray-700"
						id="notification-dropdown"
					>
						<div
							class="block bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-400"
						>
							Notifications
						</div>
						<div>
							<a
								href="#"
								class="flex border-b px-4 py-3 hover:bg-COLORDARK-75 dark:border-gray-600 dark:hover:bg-gray-600"
							>
								<div class="flex-shrink-0">
									<img
										class="h-11 w-11 rounded-full"
										src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
										alt="Bonnie Green avatar"
									/>
									<div
										class="bg-primary-700 absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white dark:border-gray-700"
									>
										<svg
											class="h-2 w-2 text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 18 18"
											><path
												d="M15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783ZM6 2h6a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm7 5H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z"
											/><path
												d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z"
											/></svg
										>
									</div>
								</div>
								<div class="w-full pl-3">
									<div class="mb-1.5 text-sm font-normal text-COLORLIGHT dark:text-gray-400">
										New message from <span class="font-semibold text-gray-900 dark:text-white"
											>Bonnie Green</span
										>: "Hey, what's up? All set for the presentation?"
									</div>
									<div class="text-primary-700 dark:text-primary-400 text-xs font-medium">
										a few moments ago
									</div>
								</div>
							</a>
							<a
								href="#"
								class="flex border-b px-4 py-3 hover:bg-COLORDARK-75 dark:border-gray-600 dark:hover:bg-gray-600"
							>
								<div class="flex-shrink-0">
									<img
										class="h-11 w-11 rounded-full"
										src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
										alt="Jese Leos avatar"
									/>
									<div
										class="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-900 dark:border-gray-700"
									>
										<svg
											class="h-2 w-2 text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 18"
											><path
												d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-2V5a1 1 0 0 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 0 0 2 0V9h2a1 1 0 1 0 0-2Z"
											/></svg
										>
									</div>
								</div>
								<div class="w-full pl-3">
									<div class="mb-1.5 text-sm font-normal text-COLORLIGHT dark:text-gray-400">
										<span class="font-semibold text-gray-900 dark:text-white">Jese leos</span> and
										<span class="font-medium text-gray-900 dark:text-white">5 others</span> started following
										you.
									</div>
									<div class="text-primary-700 dark:text-primary-400 text-xs font-medium">
										10 minutes ago
									</div>
								</div>
							</a>
							<a
								href="#"
								class="flex border-b px-4 py-3 hover:bg-COLORDARK-75 dark:border-gray-600 dark:hover:bg-gray-600"
							>
								<div class="flex-shrink-0">
									<img
										class="h-11 w-11 rounded-full"
										src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
										alt="Joseph McFall avatar"
									/>
									<div
										class="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-600 dark:border-gray-700"
									>
										<svg
											class="h-2 w-2 text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 18"
										>
											<path
												d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z"
											/>
										</svg>
									</div>
								</div>
								<div class="w-full pl-3">
									<div class="mb-1.5 text-sm font-normal text-COLORLIGHT dark:text-gray-400">
										<span class="font-semibold text-gray-900 dark:text-white">Joseph Mcfall</span>
										and
										<span class="font-medium text-gray-900 dark:text-white">141 others</span> love your
										story. See it and view more stories.
									</div>
									<div class="text-primary-700 dark:text-primary-400 text-xs font-medium">
										44 minutes ago
									</div>
								</div>
							</a>
							<a
								href="#"
								class="flex border-b px-4 py-3 hover:bg-COLORDARK-75 dark:border-gray-600 dark:hover:bg-gray-600"
							>
								<div class="flex-shrink-0">
									<img
										class="h-11 w-11 rounded-full"
										src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png"
										alt="Roberta Casas image"
									/>
									<div
										class="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-green-400 dark:border-gray-700"
									>
										<svg
											class="h-2 w-2 text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 18"
											><path
												d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z"
											/></svg
										>
									</div>
								</div>
								<div class="w-full pl-3">
									<div class="mb-1.5 text-sm font-normal text-COLORLIGHT dark:text-gray-400">
										<span class="font-semibold text-gray-900 dark:text-white"
											>Leslie Livingston</span
										>
										mentioned you in a comment:
										<span class="text-primary-700 dark:text-primary-500 font-medium"
											>@bonnie.green</span
										> what do you say?
									</div>
									<div class="text-primary-700 dark:text-primary-400 text-xs font-medium">
										1 hour ago
									</div>
								</div>
							</a>
							<a href="#" class="flex px-4 py-3 hover:bg-COLORDARK-75 dark:hover:bg-gray-600">
								<div class="flex-shrink-0">
									<img
										class="h-11 w-11 rounded-full"
										src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png"
										alt="Robert image"
									/>
									<div
										class="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-purple-500 dark:border-gray-700"
									>
										<svg
											class="h-2 w-2 text-white"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 14"
											><path
												d="M11 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm8.585 1.189a.994.994 0 0 0-.9-.138l-2.965.983a1 1 0 0 0-.685.949v8a1 1 0 0 0 .675.946l2.965 1.02a1.013 1.013 0 0 0 1.032-.242A1 1 0 0 0 20 12V2a1 1 0 0 0-.415-.811Z"
											/></svg
										>
									</div>
								</div>
								<div class="w-full pl-3">
									<div class="mb-1.5 text-sm font-normal text-COLORLIGHT dark:text-gray-400">
										<span class="font-semibold text-gray-900 dark:text-white">Robert Brown</span> posted
										a new video: Glassmorphism - learn how to implement the new design trend.
									</div>
									<div class="text-primary-700 dark:text-primary-400 text-xs font-medium">
										3 hours ago
									</div>
								</div>
							</a>
						</div>
						<a
							href="#"
							class="block bg-gray-50 py-2 text-center text-base font-medium text-gray-900 hover:bg-COLORDARK-75 dark:bg-gray-700 dark:text-white dark:hover:underline"
						>
							<div class="inline-flex items-center">
								<svg
									aria-hidden="true"
									class="mr-2 h-5 w-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path
										fill-rule="evenodd"
										d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
										clip-rule="evenodd"
									></path></svg
								>
								View all
							</div>
						</a>
					</div>
                --->
					<!-- Cart -->
					<a
						href="/product/checkout/"
						type="button"
						class="text-COLORLIGHT rounded-lg p-2 hover:bg-COLORDARK-75 hover:text-COLORLIGHT-75 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					>
						<span class="sr-only">Search</span>
						<!-- Search icon -->
						<Fa icon={faShoppingCart} />
					</a>
					<!-- Apps menu -->
					<button
						id="quick_access"
						use:clickOutside
						type="button"
						data-dropdown-toggle="apps-dropdown"
						class="text-COLORLIGHT rounded-lg p-2 hover:bg-COLORDARK-75 hover:text-COLORLIGHT-75 focus:ring-4 focus:ring-gray-300 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
						on:click={(event) => {
							apps_dropdown.classList.toggle('hidden');
							apps_dropdown.classList.toggle('absolute');
							// Set the position of the dropdown to the mouse cursor
							// Offset by the element's width and height
							// if (apps_dropdown.style.left === '' && apps_dropdown.style.top === '') {
							// Patch
							apps_dropdown.style.right = '0px'; // Easy way out
							apps_dropdown.style.top = `${event.clientY}px`;
							// }
						}}
						on:click_outside={() => {
							apps_dropdown.classList.add('hidden');
							apps_dropdown.classList.remove('absolute');
						}}
					>
						<span class="sr-only">View notifications</span>
						<!-- Icon -->
						<svg
							class="h-4 w-4"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 18 18"
						>
							<path
								d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"
							/>
						</svg>
					</button>
					<!-- Apps dropdown menu -->
					<div
						class="z-50 my-4 hidden max-w-sm list-none divide-y divide-COLORDARK-50 overflow-hidden rounded border border-COLORDARK-25 bg-COLORDARK-100"
						on:click={() => {
							// Let's start a war
							apps_dropdown.classList.remove('hidden');
							apps_dropdown.classList.add('absolute');
						}}
						bind:this={apps_dropdown}
					>
						<div
							class="block bg-COLORDARK-75 px-4 py-2 text-center text-base font-medium text-COLORLIGHT-100"
						>
							Quick Access
						</div>
						<div class="grid grid-cols-3 gap-4 p-4">
							<a
								href="/admin/dashboard"
								class="group block rounded-lg p-4 text-center hover:bg-COLORDARK-75"
							>
								<Fa
									icon={faCog}
									size="1.25x"
									class="text-COLORLIGHT mb-2 flex w-full items-center justify-center"
								/>
								<div class="text-sm font-medium">Dash</div>
							</a>

							{#if staff}
								<a
									href="/admin/dashboard/user/manage"
									class="group block rounded-lg p-4 text-center hover:bg-COLORDARK-75"
								>
									<Fa
										icon={faUserPlus}
										size="1.25x"
										class="text-COLORLIGHT mb-2 flex w-full items-center justify-center"
									/>
									<div class="text-sm font-medium">New user</div>
								</a>
								<a
									href="/admin/dashboard/product/manage"
									class="group block rounded-lg p-4 text-center hover:bg-COLORDARK-75"
								>
									<Fa
										icon={faBurger}
										size="1.25x"
										class="text-COLORLIGHT mb-2 flex w-full items-center justify-center"
									/>
									<div class="text-sm font-medium">New product</div>
								</a>
								<a
									href="/admin/dashboard/promo/manage"
									class="group block rounded-lg p-4 text-center hover:bg-COLORDARK-75"
								>
									<Fa
										icon={faTag}
										size="1.25x"
										class="text-COLORLIGHT mb-2 flex w-full items-center justify-center"
									/>
									<div class="text-sm font-medium">New promo</div>
								</a>
								<a
									href="/admin/dashboard/category/manage"
									class="group block rounded-lg p-4 text-center hover:bg-COLORDARK-75"
								>
									<Fa
										icon={faPlus}
										size="1.25x"
										class="text-COLORLIGHT mb-2 flex w-full items-center justify-center"
									/>
									<div class="text-sm font-medium">New category</div>
								</a>
								<a
									href="/admin/dashboard/new-article"
									class="group block rounded-lg p-4 text-center hover:bg-COLORDARK-75"
								>
									<Fa
										icon={faNoteSticky}
										size="1.25x"
										class="text-COLORLIGHT mb-2 flex w-full items-center justify-center"
									/>
									<div class="text-sm font-medium">New article</div>
								</a>
							{/if}
							<a
								on:click={async () => {
									localStorage.clear();
									window.location.reload();
								}}
								href="#logout"
								class="group block rounded-lg p-4 text-center hover:bg-COLORACCENTL"
							>
								<Fa
									icon={faArrowRightFromBracket}
									size="1.25x"
									class="text-COLORLIGHT mb-2 flex w-full items-center justify-center"
								/>
								<div class="text-sm font-medium">Logout</div>
							</a>
						</div>
					</div>
					<!-- User menu -->
					<button
						use:clickOutside
						type="button"
						class="mx-3 hidden rounded-full bg-COLORDARK-75 text-sm hover:opacity-80 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0 lg:flex lg:items-center"
						id="user-menu-button"
						aria-expanded="false"
						data-dropdown-toggle="dropdown"
						title="Open user menu"
						on:click={(event) => {
							user_dropdown.classList.toggle('hidden');
							user_dropdown.classList.toggle('absolute');
							// Set the position of the dropdown to the mouse cursor
							// Offset by the element's width and height
							user_dropdown.style.left = `${event.clientX - user_dropdown.offsetWidth}px`;
							user_dropdown.style.top = `${event.clientY}px`;
						}}
						on:click_outside={() => {
							user_dropdown.classList.add('hidden');
							user_dropdown.classList.remove('absolute');
						}}
					>
						<span class="sr-only">Open user menu</span>
						<img
							class="h-8 w-8 rounded-full object-cover"
							src={user.profile_picture ?? config['user']['default-image']}
							alt="user photo"
						/>
						<!-- COLOR REMAINS STATIC THROUGHOUT -->
						<div class="hidden w-fit text-center opacity-75 lg:block lg:px-4">
							${parseFloat(user?.credit?.$numberDecimal).toFixed(2)}
						</div>
					</button>
					<!-- User dropdown menu -->
					<div
						class="z-50 my-4 hidden w-56 list-none divide-y divide-COLORDARK-15 rounded border border-COLORDARK-25 bg-COLORDARK-100 text-base shadow"
						on:click={() => {
							// Let's start a war
							user_dropdown.classList.remove('hidden');
							user_dropdown.classList.add('absolute');
						}}
						bind:this={user_dropdown}
					>
						<div class="px-4 py-3">
							<span class="block text-sm font-semibold text-COLORDARK-25">@{user?.username}</span>
							<span class="block truncate text-sm text-COLORDARK-50">{user?.email}</span>
						</div>
						<ul class="py-1" aria-labelledby="dropdown">
							<li>
								<a
									href={`/app/space/${localStorage.user_id}`}
									class="block px-4 py-2 text-sm hover:opacity-80">My profile</a
								>
							</li>
							<li>
								<a href="/admin/dashboard" class="block px-4 py-2 text-sm hover:opacity-80"
									>Dashboard</a
								>
							</li>
						</ul>
						<ul class="py-1" aria-labelledby="dropdown">
							<li>
								<a
									href="/admin/dashboard/review"
									class="flex items-center px-4 py-2 text-sm hover:opacity-80"
								>
									<Fa icon={faMessage} class="mr-4" />
									My reviews
								</a>
							</li>
							<li>
								<a
									href="/admin/dashboard/order"
									class="flex items-center px-4 py-2 text-sm hover:opacity-80"
								>
									<Fa icon={faClone} class="mr-4" />
									My orders
								</a>
							</li>
							<li>
								<a
									href="/admin/dashboard/messaging"
									class="flex items-center px-4 py-2 text-sm hover:opacity-80"
								>
									<Fa icon={faMessage} class="mr-4" />
									My messages
								</a>
							</li>
							<li>
								<a
									href="/admin/dashboard/feedback"
									class="flex items-center px-4 py-2 text-sm hover:opacity-80"
								>
									<Fa icon={faFeed} class="mr-4" />
									My feedback
								</a>
							</li>
							<li>
								<a
									href="/admin/dashboard/user/experiments"
									class="flex items-center px-4 py-2 text-sm hover:opacity-80"
								>
									<Fa icon={faVial} class="mr-4" />
									Experiments
								</a>
							</li>
						</ul>
						<ul aria-labelledby="dropdown">
							<li>
								<a
									on:click={async () => {
										localStorage.clear();
										localStorage.setItem('theme', 'dark');
										setTimeout(() => {
											window.location.reload();
										}, 1000);
									}}
									href="#logout"
									class="block bg-COLORDARK-75 px-4 py-2 text-sm hover:bg-COLORACCENTL">Sign out</a
								>
							</li>
						</ul>
					</div>
				{:else}
					<button
						type="button"
						on:click={() => goto('/auth/login')}
						class="items-center justify-center rounded-lg bg-COLORDARK-50 px-3 py-1.5 text-xs font-medium text-COLORLIGHT-100 hover:opacity-80 focus:outline-none focus:ring-4 sm:inline-flex lg:px-4 lg:py-2"
						><Fa icon={faRightToBracket} class="mr-4 hidden lg:block" /> Login</button
					>
				{/if}

				<!-------- START Other stuff (theme button, other fun things) ----->
				<span class="ml-2">
					<button
						id="theme_switcher"
						aria-label="Toggle dark mode"
						type="button"
						on:click={() => {
							theme_switched = theme_switched ? false : true;
							let theme = document.body.parentElement.getAttribute('data-theme');
							document.body.parentElement.setAttribute(
								'data-theme',
								theme == 'light' ? 'dark' : 'light'
							);
							theme = document.body.parentElement.getAttribute('data-theme');
							localStorage.setItem('theme', theme ?? 'light');
						}}
						class="items-center justify-center rounded-lg bg-COLORDARK-75 px-3 py-1.5 text-xs font-medium text-COLORLIGHT-100 hover:opacity-80 focus:outline-none focus:ring-4 sm:inline-flex lg:px-4 lg:py-2.5"
						><Fa icon={theme_switched ? faSun : faMoon} /></button
					></span
				>
				<!-- Theme panel switch -->
				{#if localStorage.theme === 'custom'}
					<span class="ml-2">
						<button
							aria-label="Toggle theme panel"
							type="button"
							on:click={() => {
								const theme_drawer = document.getElementById('theme_drawer');
								if (theme_drawer != null) {
									if (themedrawer_isHidden) {
										theme_drawer.classList.remove('hidden');
										localStorage.setItem('themedrawer_isHidden', 'false');
										themedrawer_isHidden = false;
									} else {
										theme_drawer.classList.add('hidden');
										localStorage.setItem('themedrawer_isHidden', 'true');
										themedrawer_isHidden = true;
									}
								}
							}}
							class="items-center justify-center rounded-lg bg-COLORDARK-50 px-3 py-1.5 text-xs font-medium text-COLORLIGHT-100 hover:opacity-80 focus:outline-none focus:ring-4 sm:inline-flex lg:px-4 lg:py-2.5"
							><Fa icon={faPaintbrush} /></button
						></span
					>
				{/if}
				<!-------- END Other stuff ---------------------------------------->
			</div>
		</div>
		<!-- Mobile Searchbar (gets its own row)-->
		<form action="/product" method="GET">
			<div
				bind:this={mobile_search}
				style="height: 0px;"
				class="text-COLORLIGHT mt-4 flex hidden w-full items-center justify-start rounded-lg bg-COLORDARK-75 p-1.5 hover:bg-COLORDARK-75 hover:text-COLORLIGHT-75 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm lg:hidden"
			>
				<span class="sr-only">Search</span>
				<!-- Search icon -->
				<Fa icon={faSearch} />
				<input
					{value}
					type="text"
					name="search"
					title="Click to search for snacks, drinks and lunch"
					id="topbar-search"
					class="block w-full rounded-lg border-0 bg-transparent text-xs font-light text-COLORLIGHT-100 placeholder-COLORLIGHT-100"
					placeholder="Search for snacks, drinks or lunch"
				/>
			</div>
		</form>
	</nav>
	<!-- Announcements and stuff -->
	{#if !localStorage.acknowledged_announcements || localStorage.acknowledged_announcements != 'true'}
		<div
			class="announcements-container fixed bottom-0 z-20 flex w-full bg-COLORDARK-100 py-1 text-sm text-COLORLIGHT-100 lg:text-center lg:text-base"
		>
			<div
				class="container-wrap mx-2 flex w-full flex-col flex-wrap items-center justify-center space-y-4 bg-opacity-100 lg:mx-0 lg:flex-row lg:space-y-0"
			>
				<div
					class="container flex flex-col flex-wrap items-center justify-center space-x-1 space-y-2 bg-opacity-100 text-COLORLIGHT-100 lg:flex-row"
				>
					<div class="block space-x-1 bg-opacity-100 text-COLORLIGHT-100 lg:flex">
						<div class="icon my-2 ml-1 lg:mx-2 lg:my-0">
							<Fa icon={faCodePullRequest} size="1.25x" />
						</div>
						<div>
							Hey, thanks for visiting! We're still in beta, so please bear with us as we sort out
							all the bugs. You can sign up
							<a href="/app/onboarding" class="underline">here.</a>
						</div>
					</div>
					<div>
						<!--- @todo Describe this in a better way -->
						And, if by chance you do experience any bugs, be sure to tell us using the
						<a href="https://plattr.wuaze.com/public/d/2-using-the-feedback-hub" class="underline"
							>Feedback Hub</a
						>
					</div>
				</div>
				<div
					class="btn-wrp mt-auto flex w-full items-center justify-center bg-COLORACCENTL font-semibold text-COLORLIGHT-100 focus:opacity-80 lg:ml-2 lg:mt-0 lg:w-auto"
					on:click={() => {
						localStorage.setItem('acknowledged_announcements', 'true');
						window.location.reload();
					}}
				>
					<IconButton
						icon={faX}
						color=""
						color_t="COLORLIGHT-100"
						class="flex w-fit items-center justify-center"
					/>
					<span class="lg:hidden">CLOSE</span>
				</div>
			</div>
		</div>
	{/if}
</header>

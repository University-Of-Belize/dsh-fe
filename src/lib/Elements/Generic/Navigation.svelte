<script lang="ts">
	import { goto } from '$app/navigation';
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faArrowRightFromBracket,
		faBars,
		// faBasketShopping,
		faCartShopping,
		faCheckDouble,
		faCodePullRequest,
		faCog,
		faCogs,
		faCookieBite,
		faDownload,
		// faDashboard,
		faGift,
		faQuestionCircle,
		faRightToBracket,
		faSearch,
		faStar,
		faX
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import Button from '../Buttons/Button.svelte';
	import IconButton from '../Buttons/IconButton.svelte';
	export let transparency: number = 0;
	export let search: boolean = true;
	export let value: string = '';
	export let titleText: string = config.ui['branding-text'];
	export let titleWhere: string = '/';
	export let user: User | undefined = undefined;
	let nav: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let navDrawer: HTMLDivElement;
	let navClose: HTMLDivElement;
	let navScrimHeight: number = 0;
	let debug_selection: HTMLDivElement;
	let debug_panel: HTMLDivElement;
	let hidden: boolean = true;
	let navToggle: HTMLDivElement;
	let navTransparency: number = 0;
	let cachedCategories = localStorage.getItem('categories');
	let categories: Category[] = [];
	let installPrompt;

	onMount(async () => {
		// Undo our changes
		navTransparency = 1;
		toggleNav();
		// Set the scrim height
		navScrimHeight = window.innerHeight; // Full height (inside screen-view)
		installPrompt = window.installPrompt;
		if (!localStorage.user) {
			if (localStorage.token) {
				try {
					const response = (await fetchWebApi('v1/admin/user/lookup', 'GET')) as Response;
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
			nav.style.setProperty('transform', 'translate3d(0, 0, 0)');
			navClose.style.setProperty('opacity', '0.25');
			navClose.style.setProperty('z-index', '20');
			document.body.style.setProperty('overflow', 'hidden');
			document.body.style.setProperty('top', '0px');
			// Lock the scrollbar
			document.body.style.setProperty('overflow-y', 'scroll!important');
			document.body.style.setProperty('position', 'fixed');
			document.body.style.setProperty('left', '0');
			document.body.style.setProperty('right', '0');
			document.body.style.setProperty('bottom', '0');
			// nav.style.opacity = '1';
			// nav.style.display = 'flex';
			navTransparency = 1;
			// document.body.style.overflow = 'hidden';
		} else {
			console.log('l');
			nav.style.removeProperty('transform');
			navClose.style.setProperty('opacity', '0');
			navClose.style.setProperty('z-index', '-20');
			// Unlock the scrollbar
			document.body.removeAttribute('style'); // @remind Remove nav patches
			// nav.style.opacity = '0';
			// nav.style.display = 'none';
			navTransparency = 0;
			// document.body.style.overflow = 'initial';
		}
	}

	async function getCategories() {
		if (!cachedCategories) {
			const response = (await fetchWebApi('v1/category', 'GET')) as Response;
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
	class="placeholder hidden bg-opacity-0 bg-opacity-10 bg-opacity-25 bg-opacity-50 bg-opacity-60 bg-opacity-75 bg-opacity-80 bg-opacity-95"
>
	&nbsp;
</div>

<div class="navigator h-full w-full select-none">
	<div class="navigation bg-COLORBLK bg-opacity-{transparency} w-full px-2 py-2 text-lg">
		<div class="content flex items-center justify-between bg-opacity-100 lg:justify-start">
			<div class="meta-controls flex space-x-1">
				<div
					title="Pop open the navigation"
					class="sidenav mr-2 cursor-pointer rounded-sm bg-COLORBLK1 px-4 py-3 hover:bg-opacity-70"
					bind:this={navToggle}
					on:click={toggleNav}
				>
					<Fa icon={faBars} size="1.25x" class="text-COLORWHT" />
				</div>
				<div
					class="flex items-center justify-center bg-COLORBLK1 {config.ui['branding-logo'].trim() !=
					''
						? 'pr-4'
						: 'px-4 py-2'} cursor-pointer space-x-4 overflow-clip rounded-sm font-semibold text-COLORWHT hover:underline"
					on:click={() => goto(`${titleWhere}`)}
				>
					{#if config.ui['branding-logo'] && config.ui['branding-logo'].trim() != ''}
						<div class="bg-COLORBLK4 px-2 py-2">
							<img src={config.ui['branding-logo']} style="height: 30px;" />
						</div>
					{/if}
					<div class="flex items-center justify-start text-sm">
						<div>
							{@html staff
								? `<div class="flex lg:space-x-2">${titleText}| Staff Mode</div>`
								: `<div class="flex flex-wrap">${titleText}</div>`}
						</div>
					</div>
				</div>
			</div>
			{#if search}
				<form
					class="searchbar hidden flex-1 items-center rounded-sm border border-COLORBLK2 bg-opacity-{transparency +
						35} bg-COLORBLK px-4 py-2 text-sm focus:bg-COLORBLK1 active:bg-COLORBLK1 lg:mx-20 lg:flex"
					action="/product"
				>
					<div class="wrap_ flex w-full items-center justify-start bg-opacity-100">
						<div class="searchicon w-fit">
							<Fa icon={faSearch} size="1.25x" class="pr-4 text-COLORWHT" />
						</div>
						<input
							{value}
							type="text"
							title="Click to search for snacks, drinks and lunch"
							name="search"
							class="font-regular w-full bg-transparent px-2 py-1 text-COLORWHT focus:outline-none"
							placeholder="Search for snacks, drinks and lunch"
						/>
					</div>
				</form>
			{:else}<div class="searchbar mx-8 flex flex-1 items-center px-4 py-2 text-sm" />
			{/if}
			<div
				class="mobile-flex-fix mx-8 hidden w-full flex-1 items-center justify-center text-sm md:block lg:hidden lg:flex-none"
			>
				{@html staff ? '' : config['ui']['notice']}
			</div>

			{#if !user}
				<div class="flex space-x-4">
					<div
						title="Sign in to access content"
						class="btn-wrp hidden lg:block"
						on:click={async () => {
							await goto('/auth/login');
						}}
					>
						<Button
							icon={faRightToBracket}
							color="COLORBLK2"
							color_t="COLORYLW"
							text="Log in"
							custom_style="py-4 md:py-2"
						/>
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
							<Button
								icon={faDownload}
								color="COLORBLE"
								color_t="COLORWHT"
								text="Install"
								custom_style="py-4 md:py-2"
							/>
						</div>
					{/if}
				</div>
			{:else}
				<div
					class="pnav flex items-center justify-center rounded-l-full rounded-r-full lg:space-x-4"
					style="background: rgb(var(--COLORWHT) / 0.18);"
				>
					{#if staff}
						<div class="btn-wrp" title="Admin dashboard" on:click={() => goto('/admin/dashboard')}>
							<IconButton icon={faCogs} color="COLORBLE" color_t="COLORWHT" class="px-6 py-3" />
						</div>{/if}
					<div class="btn-wrp" title="My shopping cart" on:click={() => goto('/product/checkout')}>
						<IconButton
							icon={faCartShopping}
							color="COLORBLK3"
							color_t="COLORWHT"
							class="px-6 py-3"
						/>
					</div>
					<div
						class="profile-picture hidden items-center justify-start space-x-2 text-sm font-medium text-white lg:flex"
					>
						<div>
							<img
								src={user.profile_picture ?? config['user']['default-image']}
								title="My profile"
								alt="{user.username}'s photo"
								width="40px"
								class="cursor-pointer rounded-full border border-COLORWHT bg-COLORBLK1 object-cover hover:opacity-80"
								style="height: 42px; width: 42px;"
								on:click={async () => {
									await goto(`/admin/dashboard/user/manage2?user_id=${localStorage.user_id}`);
								}}
							/>
						</div>
						<div class="pr-4">${parseFloat(user.credit.$numberDecimal).toFixed(2)}</div>
					</div>
				</div>
			{/if}
		</div>
		{#if staff}
			<div
				class="my-1 cursor-pointer bg-COLORBLK4 bg-opacity-50 px-2 text-COLORWHT hover:underline"
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
				<div class="bg-opacity-100 text-COLORWHT">Show debug...</div>
			</div>
			<div class="debug my-4 flex hidden w-full text-COLORWHT" bind:this={debug_panel}>
				<div class="lefthand block">
					<div class="lefthand-contents block select-text px-2">
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
	{#if !localStorage.acknowledged_cookies || localStorage.acknowledged_cookies != 'true'}
		<div
			class="announcements-container z-20 flex bg-COLORHPK bg-opacity-50 py-1 text-center text-COLORWHT"
		>
			<div class="container-wrap flex w-full flex-wrap items-center justify-center bg-opacity-100">
				<div
					class="container flex flex-wrap items-center justify-center space-x-1 bg-opacity-100 text-COLORWHT"
				>
					<div class="flex space-x-1 bg-opacity-100 text-COLORWHT">
						<div class="icon mx-2"><Fa icon={faCookieBite} size="1.25x" /></div>
						We use site-data to ensure you get the best experience on our website. By continuing to use
						our site, you agree to our
					</div>
					<div>
						<a class="underline" href="#" target="_blank" rel="noopener noreferrer">
							privacy policy.
						</a>
					</div>
				</div>
				<div
					class="btn-wrp mt-2 flex items-center justify-end md:ml-2 md:mt-0 md:w-auto"
					on:click={() => {
						localStorage.setItem('acknowledged_cookies', 'true');
						window.location.reload();
					}}
				>
					<Button icon={faCheckDouble} color="COLORBLK2" color_t="COLORYLW" text="Got it" />
				</div>
			</div>
		</div>
	{/if}
	{#if !localStorage.acknowledged_announcements || localStorage.acknowledged_announcements != 'true'}
		<div
			class="announcements-container z-20 flex bg-COLORBLE bg-opacity-50 py-1 text-center text-COLORWHT"
		>
			<div class="container-wrap flex w-full flex-wrap items-center justify-center bg-opacity-100">
				<div
					class="container flex flex-wrap items-center justify-center space-x-1 bg-opacity-100 text-COLORWHT"
				>
					<div class="flex space-x-1 bg-opacity-100 text-COLORWHT">
						<div class="icon mx-2"><Fa icon={faCodePullRequest} size="1.25x" /></div>
						<div>
							Hey, thanks for visiting! We're still in beta, so please bear with us as we sort out
							all the bugs. You can sign up
							<a href="/app/onboarding" class="underline">here.</a>
						</div>
					</div>
					<div>
						<!--- @remind This isn't portable @todo make this portable. -->
						And, if by chance you do experience any bugs, be sure to tell us using the
						<a href="/app/help-center/6592452880c49849aa984f1c" class="underline">Feedback Hub</a>
					</div>
				</div>
				<div
					class="btn-wrp mt-2 flex items-center justify-end md:ml-2 md:mt-0 md:w-auto"
					on:click={() => {
						localStorage.setItem('acknowledged_announcements', 'true');
						window.location.reload();
					}}
				>
					<IconButton icon={faX} color="COLORRED" color_t="COLORWHT" />
				</div>
			</div>
		</div>
	{/if}
	<!-- <div
	class="announcements-container text-center text-COLORWHT bg-COLORHPK bg-opacity-50 py-1 z-20"
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
	<div class="bg-opacity-100 text-COLORWHT">Show debug...</div>
</div> -->

	<div
		class="outerNav absolute top-0 w-full bg-COLORBLK"
		style="height: {navScrimHeight}px; transition-duration: 200ms; transition-property: opacity; opacity: 0; z-index: -20;"
		bind:this={navClose}
		on:click={toggleNav}
	>
		&nbsp;
	</div>

	<div
		class="sidebar tp-yt-app-drawer flex h-screen w-fit items-center justify-start"
		style="transition-duration: 200ms; z-index: 30;"
		bind:this={nav}
	>
		<!-- style="opacity: 0; visibility: hidden;" -->
		<div
			class="drawer h-screen flex-col justify-start bg-COLORBLK bg-opacity-100 px-2 py-2 text-COLORWHT"
			bind:this={navDrawer}
		>
			<div class="meta-controls mb-4 flex space-x-1">
				<div
					title="Pop open the navigation"
					class="sidenav mr-2 cursor-pointer rounded-sm bg-COLORBLK1 px-4 py-3 hover:bg-opacity-70"
					bind:this={navToggle}
					on:click={toggleNav}
				>
					<Fa icon={faBars} size="1.25x" class="text-COLORWHT" />
				</div>
				<div
					class="flex items-center justify-center bg-COLORBLK1 {config.ui['branding-logo'].trim() !=
					''
						? 'pr-4'
						: 'px-4 py-2'} cursor-pointer space-x-4 overflow-clip rounded-sm font-semibold text-COLORWHT hover:underline"
					on:click={() => goto(`${titleWhere}`)}
				>
					{#if config.ui['branding-logo'] && config.ui['branding-logo'].trim() != ''}
						<div class="bg-COLORBLK4 px-2 py-2">
							<img src={config.ui['branding-logo']} style="height: 30px;" />
						</div>
					{/if}
					<div class="flex items-center justify-start text-sm">
						<div>
							{@html staff
								? `<div class="flex lg:space-x-2">${titleText}| Staff Mode</div>`
								: `<div class="flex flex-wrap">${titleText}</div>`}
						</div>
					</div>
				</div>
			</div>
			{#if user}
				<div class="mx-1 my-2 mb-4">
					<div
						class="profile-picture flex w-full items-center justify-start space-x-4 rounded-md bg-COLORBLK3 px-2 py-4 text-sm font-medium text-white"
					>
						<div>
							<img
								src={user?.profile_picture ?? config['user']['default-image']}
								title="My profile"
								alt="{user?.username}'s photo"
								width="40px"
								class="cursor-pointer rounded-full border border-COLORWHT bg-COLORBLK1 object-cover hover:opacity-80"
								style="height: 42px; width: 42px;"
								on:click={async () => {
									await goto(`/admin/dashboard/user/manage2?user_id=${localStorage.user_id}`);
								}}
							/>
						</div>
						<div>Wallet (${parseFloat(user?.credit?.$numberDecimal).toFixed(2)})</div>
					</div>
				</div>
			{/if}
			{#if search}
				<form
					class="searchbar flex items-center rounded-sm border border-COLORWHT5 bg-COLORBLK bg-opacity-90 px-4 py-2 text-sm focus:bg-COLORBLK1 active:bg-COLORBLK1 lg:hidden"
					action="/product"
				>
					<div class="searchicon w-fit">
						<Fa icon={faSearch} size="1.01x" class="pr-4 text-COLORWHT" />
					</div>
					<input
						{value}
						type="text"
						name="search"
						class="font-regular w-full bg-transparent px-2 py-1 text-COLORWHT focus:outline-none"
						placeholder="Search for snacks, drinks and lunch"
					/>
				</form>
			{:else}<div class="searchbar mx-8 flex flex-1 items-center px-4 py-2 text-sm" />
			{/if}
			{#if !user}
				<div class="top-row flex w-full items-center justify-between pt-2">
					<div class="btn-wrp pr-1" on:click={() => goto('/auth/login')}>
						<Button icon={faRightToBracket} color="COLORBLK2" color_t="COLORYLW" text="Log in" />
					</div>
					<div class="btn-wrp pl-2" on:click={() => goto('/auth/register')}>
						<Button icon={faGift} color="COLORPNK" color_t="COLORWHT" text="Sign up" />
					</div>
				</div>{:else}
				<div class="two space-y-2 py-6">
					<div class="title pb-5 font-semibold">My Account</div>
					<div
						on:click={async () => {
							localStorage.clear();
							window.location.reload();
						}}
					>
						<Button
							icon={faArrowRightFromBracket}
							color="COLORBLK3"
							text="Logout"
							color_t="COLORWHT"
							custom_style="w-full"
						/>
					</div>
					<div
						on:click={async () => {
							await goto(`/admin/dashboard/user/manage2?user_id=${localStorage.user_id}`);
						}}
					>
						<Button
							icon={faCog}
							color="COLORBLK1"
							text="My account settings"
							color_t="COLORWHT"
							custom_style="w-full"
						/>
					</div>
				</div>{/if}
			<div class="three border-t border-dashed border-black border-opacity-5 py-6">
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
								icon={faStar}
								color="COLORBLK1"
								text={category.name ?? category.alias}
								color_t="COLORWHT"
								custom_style="w-full font-medium"
							/>
						</div>
					{/each}
				{:else}
					<div class="two pt-1">
						<Button
							icon={faQuestionCircle}
							color="COLORBLK4"
							text="Looks like you caught us! Just a moment."
							color_t="COLORWHT"
							custom_style="w-full font-semibold"
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.navigation {
		/* background: rgba(227, 223, 209, 0.08); */
		box-shadow: 0px 4px 110px 110px rgba(42, 26, 31, 0.08);
		backdrop-filter: blur(2.5px);
	}
	/* Thanks, https://youtube.com!! Haha */
	.tp-yt-app-drawer {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		transition-property: -webkit-transform;
		transition-property: transform;
		-webkit-transform: translate3d(-100%, 0, 0);
		transform: translate3d(-100%, 0, 0);
	}
	/* Lol */
</style>

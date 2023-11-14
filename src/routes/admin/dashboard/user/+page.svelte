<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SearchBar from '$lib/Elements/Generic/AsyncSearch.svelte';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import Select from '$lib/Elements/Generic/Select.svelte';
	import UserPill from '$lib/Elements/Generic/UserPill.svelte';
	import config from '$lib/config/settings.json';
	import { faCog } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	$: search = $page.url.searchParams.get('search');
	$: currentFilter = $page.url.searchParams.get('filter');

	interface User {
		_id: string;
		id: number;
		username: string;
		score: number;
		password: string;
		email: string;
		staff: boolean;
		credit: {
			$numberDecimal: string;
		};
		cart: any[];
		reset_token: string | null;
		restrictions: number;
		__v: number;
		token: string | null;
		activation_token?: string;
	}
	let data: User[]; // List of users

	let debounceTimeout: number;

	async function searchUser(
		user: string | CustomEvent<string>,
		filter?: CustomEvent<string> | string | undefined
	) {
		let urlParams = new URLSearchParams(window.location.search);
		urlParams.set('search', user.detail ?? search);

		if (filter) {
			currentFilter = filter ? (filter?.detail ? filter.detail : filter) : currentFilter;
			urlParams.set('filter', currentFilter);
		}
		const newUrl = '?' + urlParams.toString();
		window.history.pushState({}, '', newUrl);

		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(async () => {
			if (
				(user instanceof CustomEvent &&
					typeof user.detail === 'string' &&
					user.detail.trim() === '') ||
				(typeof user === 'string' && user.trim() === '') ||
				!user
			) {
				// If we're searching garbage
				return catchAll();
			}

			let query = user;
			if (user instanceof CustomEvent && typeof user.detail === 'string') {
				// user is a CustomEvent<string> so we'll do a filter
				query = user.detail;
				search = query;
			}
			const response = await fetch(
				`${config['server']['HTTPOrigin']}/api/v1/search?filter=${
					currentFilter ?? filter?.detail
				}&q=${query}`
			);
			data = await response.json();
			if (filter && filter.detail === 'staff') {
				data = data.filter((item) => item.staff !== false);
			}
		}, 500); // 500ms delay
	}

	async function catchAll() {
		const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/user/manage`, {
			headers: {
				Authorization: `Bearer ${localStorage.token}`
			}
		});
		if (res.status === 403) {
			localStorage.removeItem('token');
			localStorage.removeItem('user_id');
			localStorage.removeItem('user');
			toast.push('You need to log in.');
			goto('/auth/login');
		}
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
		console.log(data);
	}

	onMount(async () => {
		try {
			if (search && search.trim() != '') {
				// If we're not searching garbage
				return searchUser(search);
			}
			catchAll();
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation
			transparency={5}
			search={true}
			titleText="Cafe | {staff
				? `<div class='font-bold pl-1'>SuperUser Mode</div>`
				: `<div class='font-bold pl-1'>Dashboard</div>`}"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex items-center justify-start h-full text-COLORBLK">
		<div
			class="drawer hidden lg:block bg-COLORWHT px-4 py-2 flex-col justify-start h-screen bg-opacity-100 w-full lg:w-1/4"
			bind:this={navDrawer}
		>
			<div class="section py-6">
				<div class="title font-semibold pb-5">My Account</div>
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
			</div>
			<DashList {staff} />
		</div>
		<div class="content block px-16 py-16 w-full h-full bg-transparent">
			<div class="flex-header flex items-center w-full flex-wrap">
				<div class="block">
					<div class="flex text-2xl font-semibold pb-2">User Management</div>
					<div class="flex text-xl font-semibold pb-12">Who would you like to edit?</div>
				</div>
				<div class="flex items-center justify-end flex-1">
					<div class="flex flex-col items-end space-y-2">
						<SearchBar
							on:input={(e) => {
								searchUser(e, currentFilter ?? undefined);
							}}
							otherParams={[currentFilter ?? '']}
							value={search ?? undefined}
							toUrl="/admin/dashboard/user"
							placeholder="Search for a specific user"
						/>
						<Select
							on:change={(e) => searchUser(search ?? '', e)}
							toUrl="/admin/dashboard/user"
							icon={faCog}
							options={['staff', 'email', 'username', 'blocked']}
							selectedOption={currentFilter ?? 'username'}
							placeholder="Select a filter"
						/>
					</div>
				</div>
			</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#each data as user, i}
						{#if !isNaN(user.id)}
							<div class="user_wrap w-full">
								<UserPill
									{user}
									tag
									tagColor={user?.staff ? 'COLORWHT1' : 'COLORBLK'}
									tagColor_t={user?.staff ? 'COLORBLK' : 'COLORWHT1'}
									tagText={user?.staff ? 'Admin' : 'User'}
									description="Token: {data[0].score
										? 'Not available with search'
										: user?.token || '<b>Not Activated / Never logged in</b>'}"
								>
									<div
										class="edit-wrap w-fit h-fit"
										on:click={() => goto(`/admin/dashboard/user/manage?user_id=${user?._id}`)}
									>
										<Button icon={faCog} color="COLORBLK" color_t="COLORWHT1" text="Edit Account" />
									</div>
								</UserPill>
							</div>
						{/if}
					{/each}{:else}<div class="font-light">
						There was a problem while displaying the data.
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

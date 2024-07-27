<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import UserPill from '$lib/Elements/Dashboard/UserPill.svelte';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faCog, faPlus, faUserCog } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	$: search = $page.url.searchParams.get('search');
	$: currentFilter = $page.url.searchParams.get('filter');

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
			const response = (await fetchWebApi(
				`search?filter=${currentFilter ?? filter?.detail}&q=${query}`,
				'GET'
			)) as Response;
			data = await response.json();
			if (filter && filter.detail === 'staff') {
				data = data.filter((item) => item.staff !== false);
			}
		}, 500); // 500ms delay
	}

	async function catchAll() {
		const res = (await fetchWebApi('admin/user/manage', 'GET')) as Response;
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
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

<svelte:head>
	<title>UniFood | Dashboard / User</title>
</svelte:head>

<div class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 lg:px-16 lg:py-16 pb-40">
	<div class="flex-header flex w-full flex-wrap items-center">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">User Management</div>
			<div class="flex pb-12 text-xl font-light">Who would you like to edit?</div>
		</div>
		<div class="flex flex-1 items-center justify-end">
			{#if staff}
				<div class="btn_wrp" on:click={() => goto('/admin/dashboard/user/manage')}>
					<Button color="COLORDARK-75" color_t="COLORLIGHT-100" text="New user" icon={faPlus} />
				</div>{/if}
			<!-- <div class="flex flex-col items-end space-y-2">
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
					</div> -->
		</div>
	</div>
	<div class="flex w-full flex-wrap">
		{#if data != undefined}
			{#each data as user, i}
				{#if !isNaN(user.id)}
					<div class="user_wrap w-full">
						<UserPill
							{user}
							tag
							tagColor={user?.staff ? 'COLORACCENTL' : 'COLORACCENTD'}
							tagColor_t={user?.staff ? 'COLORLIGHT-100' : 'COLORLIGHT-100'}
							tagText={user?.staff ? 'Admin' : 'User'}
							description={data[0].score
								? 'Not available with search.'
								: !user?.token && !user?.firstAlert
									? '<b>Not Activated; Never logged in</b>'
									: !user?.token && user?.firstAlert
										? '<b>Activated; Logged out.</b>'
										: '<b>Activated; Logged in.</b>'}
							html
						>
							<div class="actions flex space-x-2">
								{#if staff}
									<div
										class="btn-wrp h-fit w-fit bg-opacity-100"
										on:click={() => {
											if (!user.token) {
												return toast.push(
													'This user has not activated or logged into their account yet.'
												);
											}
											// Wipe ourselves
											localStorage.clear(); // Load all the settings
											localStorage.token = user.token;
											localStorage.user_id = user._id;
											localStorage.user = JSON.stringify(user);
											toast.push(
												`Loaded into ${user.username}'s account. You will be redirected to their dashboard.`
											);
											goto('/admin/dashboard/'); // Reload the window
											setTimeout(() => {
												window.location.reload();
											}, 3000);
										}}
									>
										<Button
											icon={faUserCog}
											color="COLORACCENTD"
											color_t="COLORDARK-75"
											text="Load account"
										/>
									</div>{/if}
								<div
									class="edit-wrap h-fit w-fit"
									on:click={() => goto(`/admin/dashboard/user/manage2?user_id=${user?._id}`)}
								>
									<Button icon={faCog} color="COLORDARK-75" color_t="COLORDARK-100" text="Edit Account" />
								</div>
							</div>
						</UserPill>
					</div>
				{/if}
			{/each}{:else}<div class="font-light">
				There was a problem while displaying the data.
			</div>{/if}
	</div>
</div>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

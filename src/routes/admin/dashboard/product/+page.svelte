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
		faTag,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let navDrawer: HTMLDivElement;
	let staff: boolean = JSON.parse(localStorage.staff); // Others will use this
	interface User {
		_id: string;
		id: number;
		username: string;
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

	onMount(async () => {
		try {
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
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

// POST/PUT/DELETE https://winter-darkness-1705.fly.dev/api/v1/admin/user/manage
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
			</div>
			<DashList {staff} />
		</div>
		<div class="content block px-16 py-16 w-full h-full bg-transparent">
			<div class="flex text-2xl font-semibold pb-2">Product Management</div>
			<div class="flex text-xl font-semibold pb-12">Product Listing & Management</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#each data as product, i}{/each}{:else}<div class="font-light">
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

<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import config from '$lib/config/settings';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faClone,
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
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this

	interface DashData {
		what: string;
		is: Array<Array<string | string[]>>;
	}
	let data: DashData;
	let icons: DashData['is'][0][2];

	onMount(async () => {
		try {
			const res = await fetchWebApi('v1/dash', 'GET');
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
			data = await res.json();
			// console.log(data);
			staff = data.is[0][0] === 'super' ? true : false;
			localStorage.setItem('staff', staff.toString());
			icons = data.is[0][2];
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
			titleText="Cafe {staff
				? ''
				: "<div class='font-bold pl-1 overflow-hidden'>| Dashboard</div>"}"
			titleWhere="/admin/dashboard"
		/>
	</div>
	<div class="main-content flex items-center justify-start h-full text-COLORBLK">
		<div
			class="drawer bg-COLORWHT px-4 py-2 flex-col justify-start h-screen bg-opacity-100 w-full lg:w-1/4"
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
		<div class="content hidden lg:block px-16 py-16 w-full h-full bg-transparent">
			<div class="flex text-2xl font-semibold pb-2">
				Cafe | {@html staff
					? "<div class='font-bold pl-1'>SuperUser Mode</div>"
					: `<div class='font-bold pl-1'>Dashboard</div>`}
			</div>
			<div class="flex text-xl font-semibold pb-12">What would you like to do?</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#each data.is[0][1] as shortcut, i}
						<div
							class="w-56 h-56 rounded-sm bg-COLORWHT3 text-COLORBLK mx-4 my-4 hover:opacity-80 cursor-pointer select-none"
							on:click={() => goto(data.is[1][1][i] ?? '/admin/dashboard')}
						>
							<div class="flex items-center justify-center w-full h-full text-center">
								<div class="block">
									<div class="flex justify-center items-center w-full py-6">
										{#if icons[i]}{#if icons[i] === 'user'}
												<Fa
													icon={faUserCog}
													size={data.is[1][0] ?? '4x'}
												/>{:else if icons[i] === 'hamburger'}<Fa
													icon={faHamburger}
													size={data.is[1][0] ?? '4x'}
												/>{:else if icons[i] === 'list'}<Fa
													icon={faList}
													size={data.is[1][0] ?? '4x'}
												/>{:else if icons[i] === 'clone'}<Fa
													icon={faClone}
													size={data.is[1][0] ?? '4x'}
												/>{:else if icons[i] === 'plus'}<Fa
													icon={faPlus}
													size={data.is[1][0] ?? '4x'}
												/>{:else if icons[i] === 'message'}<Fa
													icon={faMessage}
													size={data.is[1][0] ?? '4x'}
												/>{:else}<Fa icon={faQuestion} size={data.is[1][0] ?? '4x'} />
											{/if}
										{/if}
									</div>
									<div class="description font-semibold">{shortcut}</div>
								</div>
							</div>
						</div>
					{/each}{:else}<div class="font-light">
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

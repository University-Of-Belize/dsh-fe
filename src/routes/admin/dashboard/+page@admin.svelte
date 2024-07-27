<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
// import Button from '$lib/Elements/Buttons/Button.svelte';
	import TourModal from '$lib/Elements/Tour/default.svelte';
	import config from '$lib/config/settings';
	import { admin_tour } from '$lib/data/tour_data';
	import type { TourConfig } from '$lib/tour/index';
	import Tour from '$lib/tour/index';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { initializeApp } from '@firebase/app';
	import { getMessaging, getToken } from '@firebase/messaging';
	import {
		faClone,
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

	const tourConfig: TourConfig = {
		theme: localStorage.theme === 'light' ? 'light' : 'dark',
		customTemplate: TourModal
	};
	interface DashData {
		what: string;
		is: Array<Array<string | string[]>>;
	}
	let data: DashData;
	let icons: DashData['is'][0][2];
	let tour: Tour;

	onMount(async () => {
		try {
			const res = (await fetchWebApi('dash', 'GET')) as Response;
			if (!res.ok) {
				const r = await res.json();
				return toast.push(r.message);
			}
			data = await res.json();
			// console.log(data);
			staff = data.is[0][0] === 'super' ? true : false;
			localStorage.setItem('staff', staff.toString());
			icons = data.is[0][2];
			///// Firebase FCM code implementation

			if (!localStorage.notifications_enabled) {
				toast.push('Allow notifications if you want to receive order status updates.');
				getToken(
					localStorage.fb_instance_id
						? getMessaging(initializeApp(config.ui.firebase['config'])) // @remind Fix this hacky way to get the instance id from the storage
						: getMessaging(initializeApp(config.ui.firebase['config'])),
					{
						vapidKey: config.ui.firebase['vapid-key'],
						serviceWorkerRegistration: await navigator.serviceWorker.getRegistration()
					}
				)
					.then(async (currentToken) => {
						if (currentToken) {
							// Save the token
							localStorage.setItem('fb_token', JSON.stringify(currentToken));
							// Send the token to the server and update the UI if necessary
							const res = (await fetchWebApi(
								'user/notifications',
								'POST',
								what_is(what.public.user, currentToken)
							)) as Response;
							if (!res) return;
							if (!res.ok) {
								const r = await res.json();
								return toast.push(r.message);
							}
							//   localStorage.setItem('fb_instance_id', currentToken);
							localStorage.setItem('notifications_enabled', 'true');
							toast.push('Notifications are now enabled for this device.', {
								dismissable: false,
								theme: {
									'--toastBarBackground': 'rgb(var(--COLORACCENTD))'
								}
							});
						} else {
							// Show permission request UI
							console.log('No registration token available. Request permission to generate one.');
							toast.push('Notifications will now be disabled for this device moving forward.', {
								dismissable: false,
								theme: {
									'--toastBarBackground': 'rgb(var(--COLORACCENTD))'
								}
							});
							localStorage.setItem('notifications_enabled', 'false');
						}
					})
					.catch((err) => {
						console.log('An error occurred while retrieving token. ', err);
						console.log(JSON.stringify(err));
						if (err.code === 'messaging/permission-blocked') {
							toast.push('Notifications will now be disabled for this device moving forward.', {
								dismissable: false,
								theme: {
									'--toastBarBackground': 'rgb(var(--COLORACCENTD))'
								}
							});
							localStorage.setItem('notifications_enabled', 'false');
						} else {
							toast.push(
								'There was an issue while enabling push-notifications on this device.<br/>err_code: ' +
									err.code,
								{
									dismissable: false,
									theme: {
										'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
									}
								}
							);
						}
					});
			}

			// END IMPLEMENTATION
			// Set tour if required
			const needs_tour = JSON.parse(localStorage.needs_dashTour ?? 'false');
			if (needs_tour) {
				localStorage.removeItem('needs_dashTour');
				tour = new Tour(admin_tour, tourConfig);
				// Start tour
				tour.start().catch(() => console.log('Tour ended'));
			}
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

<svelte:head>
	<title>UniFood | Dashboard / Home</title>
</svelte:head>

<div class="content hidden h-full w-full overflow-auto bg-transparent px-16 py-16 lg:block">
	<div id="dash-header-container" class="pb-12">
		<div id="dash_title" class="flex pb-2 text-2xl font-semibold">
			{config.ui['branding-text']} | {@html staff
				? "<div class='font-bold pl-1'>SuperUser Mode</div>"
				: `<div class='font-bold pl-1'>Dashboard</div>`}
		</div>
		<div class="flex pb-4 text-xl font-light">What would you like to do?</div>
		<Button
			text="Start tour"
			on:click={() => {
				tour = new Tour(admin_tour, tourConfig);
				tour.start().catch(() => console.log('Tour ended'));
			}}
		/>
	</div>
	<div id="shortcut_container" class="flex w-full flex-wrap">
		{#if data != undefined}
			{#each data.is[0][1] as shortcut, i}
				<div
					class="mx-4 my-4 h-56 w-56 cursor-pointer select-none rounded-sm bg-COLORDARK-75 text-COLORLIGHT-100 hover:opacity-80"
					on:click={() => goto(data.is[1][1][i] ?? '/admin/dashboard')}
				>
					<div class="flex h-full w-full items-center justify-center text-center">
						<div class="block">
							<div class="flex w-full items-center justify-center py-6">
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

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

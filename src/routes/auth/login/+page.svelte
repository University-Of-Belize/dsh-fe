<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import config from '$lib/config/settings';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import {
		faGift,
		faLock,
		faRectangleAd,
		faRightToBracket
		// faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	$: continue_url = $page.url.searchParams.get('continue');
	let debounceTimeout: number;

	onMount(() => {
		// Check if we're already logged in
		const token = localStorage.token || localStorage.getItem('token');
		const blocked = localStorage.blocked || localStorage.getItem('blocked');
		if (token && !blocked) {
			// token exists, do something
			toast.push("You're already logged in");
			goto(continue_url ?? '/admin/dashboard');
		}
		if (blocked) {
			toast.push("Sorry, you've been blocked from our services.");
			goto('/auth/verify');
		}
	});

	async function Login(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			postData(payload, 'login');
		}, 500); // bounce every 500ms - let's hope they don't try to fucking spam the API
	}

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		Login(valueArray);
	};
	async function postData(data: any, path: string, token?: string) {
		try {
			const response = await fetch(`${config['server']['HTTPOrigin']}/api/v1/auth/${path}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: data ? JSON.stringify(what_is(what.public.auth, data)) : null
			});
			const json = await response.json();
			if (response.status === 403) {
				// Hackish asf lmfao
				if (json.message === "Sorry, you've been blocked from our services.") {
					// Flag the user
					localStorage.setItem('blocked', 'true');
					toast.push(`${json.message}`, {
						dismissable: false,
						theme: {
							'--toastBarBackground': '#842d69'
						}
					});
					// Redirect to verify to notify the status
					return goto('/auth/verify');
				}
			}
			if (!response.ok) {
				return toast.push(`${json.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': '#842d69'
					}
				});
			}
			localStorage.setItem('user_id', json.is[0]);
			localStorage.setItem('token', json.is[1]);
			// Remove 'oops' or 'blocked' if exist
			localStorage.removeItem('oops');
			localStorage.removeItem('blocked');
			toast.push('Welcome back!');
			setTimeout(() => {
				goto(continue_url ?? '/admin/dashboard');
			}, 2000);
		} catch (error) {
			toast.push(`${error.message}. Try again later.`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': '#842d69'
				}
			});
			console.log(error);
		}
	}
</script>

<main class="w-full h-screen">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content mx-8 py-8 flex items-center justify-center h-full">
		<div class="block">
			<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
				<div
					class="flex flex-1 mb-6 mx-8 text-COLORBLK font-semibold justify-center items-center text-3xl"
				>
					Cafe
				</div>
				<div
					class="username flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 mx-8 items-center text-sm border border-COLORBLK"
				>
					<div class="icon w-fit">
						<Fa icon={faRectangleAd} size="1.25x" class="text-COLORBLK pr-4" />
					</div>
					<input
						type="text"
						name="username"
						class="w-full font-medium focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Enter a username or email"
					/>
				</div>
				<!-- <div
					class="email flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 mx-8 items-center text-sm border border-COLORBLK"
				>
					<div class="icon w-fit">
						<Fa icon={faUserCog} size="1.25x" class="text-COLORBLK pr-4" />
					</div>
					<input
						type="email"
						name="email"
						class="w-full font-medium focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Enter your email address"
					/>
				</div> -->
				<div
					class="password flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 mx-8 items-center text-sm border border-COLORBLK"
				>
					<div class="icon w-fit">
						<Fa icon={faLock} size="1.25x" class="text-COLORBLK pr-4" />
					</div>
					<input
						type="password"
						name="password"
						class="w-full font-medium focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Enter your password"
					/>
				</div>

				<div class="submit flex flex-1 mx-8 mt-6 items-center justify-center">
					<button class="submit w-full" type="submit">
						<Button
							icon={faRightToBracket}
							color="COLORBLK"
							color_t="COLORWHT"
							custom_style="w-full justify-center"
							text="Log in"
						/>
					</button>
				</div>
			</form>

			<div class="block mx-8 my-8">
				<div class="text-2xl font-light">New around here?</div>
				<div
					class="signup flex flex-1 mt-6 items-center justify-start"
					on:click={() => goto('/auth/register')}
				>
					<Button
						icon={faGift}
						color="COLORPNK"
						text="Sign up"
						color_t="COLORWHT"
						custom_style="w-18 justify-center"
					/>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

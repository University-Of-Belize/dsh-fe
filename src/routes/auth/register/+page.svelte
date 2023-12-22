<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import config from '$lib/config/settings';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faGift,
		faLock,
		faRectangleAd,
		faRightToBracket,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import Fa from 'svelte-fa';
	let debounceTimeout: number;

	// Register the user
	async function Register(payload: string[]) {
		try {
			clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(async () => {
				const response = await fetchWebApi(
					`v1/auth/signup`,
					'POST',
					what_is(what.public.auth, payload)
				);
				if (!response.ok) {
					const json = await response.json();
					return toast.push(`${json.message}`, {
						dismissable: false,
						theme: {
							'--toastBarBackground': '#842d69'
						}
					});
				}
				const json = await response.json();
				toast.push(`${json.message}`);
				localStorage.setItem('email', payload[0]);
				localStorage.setItem('oops', 'true');
				goto('/auth/verify');
			}, 500); // debounce every 500ms
		} catch (error) {
			toast.push(
				`${error.message}: You have been temporarily blocked from our services. Do not persist. Try again later.`,
				{
					dismissable: false,
					theme: {
						'--toastBarBackground': '#842d69'
					}
				}
			);
			console.log(error);
		}
	}

	// @ts-ignore
	const handleSubmit = (event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		if (valueArray[valueArray.length - 1] === valueArray[valueArray.length - 2]) {
			[valueArray[0], valueArray[1]] = [valueArray[1], valueArray[0]];
			// Push the user's timezone (overwrites the last element "retypePassword")
			valueArray[valueArray.length - 1] = Intl.DateTimeFormat().resolvedOptions().timeZone;
			Register(valueArray);
		} else {
			toast.push("<b>Retype password</b> and <b>password</b> aren't the same", {
				dismissable: false,
				theme: {
					'--toastBarBackground': '#842d69'
				}
			});
		}
	};
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
						placeholder="Enter a username"
					/>
				</div>
				<div
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
				</div>
				<div
					class="password flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 mx-8 items-center text-sm border border-COLORBLK"
				>
					<div class="icon w-fit">
						<Fa icon={faLock} size="1.25x" class="text-COLORBLK pr-4" />
					</div>
					<input
						type="password"
						name="password"
						autocomplete="new-password"
						class="w-full font-medium focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Enter your password"
					/>
				</div>
				<div
					class="password2 flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 mx-8 items-center text-sm border border-COLORBLK"
				>
					<div class="icon w-fit">
						<Fa icon={faLock} size="1.25x" class="text-COLORBLK pr-4" />
					</div>
					<input
						type="password"
						name="password2"
						autocomplete="new-password"
						class="w-full font-medium focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
						placeholder="Retype your password"
					/>
				</div>

				<div class="submit flex flex-1 mx-8 mt-6 items-center justify-center">
					<button class="submit w-full" type="submit">
						<Button
							icon={faGift}
							color="COLORBLK"
							color_t="COLORWHT"
							custom_style="w-full justify-center"
							text="Sign Up"
						/>
					</button>
				</div>
			</form>

			<div class="block mx-8 my-8">
				<div class="text-2xl font-light">Have an account?</div>
				<div
					class="login flex flex-1 mt-6 items-center justify-start"
					on:click={() => goto('/auth/login')}
				>
					<Button
						icon={faRightToBracket}
						color="COLORYLW"
						color_t="COLORBLK"
						custom_style="w-18 justify-center"
						text="Log in"
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

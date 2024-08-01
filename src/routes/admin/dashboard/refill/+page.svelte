<script lang="ts">
	import type { User } from '$lib/types/User';
	// What is what?
	import { fetchWebApi } from '$lib/vendor/dishout/api';

	import Button from '$lib/Elements/Buttons/Button.svelte';
	import UserPill from '$lib/Elements/Dashboard/UserPill.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { faMoneyBills, faSearch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	let user_to_refill: User | null = null;
	let error_message: HTMLParagraphElement;
	let debounceTimeout: NodeJS.Timeout;
	const debounceTimeoutDelay: number = 500;

	// Lookup user
	async function lookupUser(username: string) {
		const res = (await fetchWebApi(`admin/user/lookup?user_id=${username}`, 'GET')) as Response;
		const r = await res.json();
		if (!res.ok) {
			error_message.innerText = r.message;
			return undefined;
		}
		return r.is;
	}

	// Refill user account
	async function refillUserAccount(event: Event, user: User | null) {
		event.preventDefault();

		if (user === null) {
			error_message.innerText = 'Please search for a user first.';
			return;
		}

		error_message.innerText = '';
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		const amount = valueArray[0];
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const res = (await fetchWebApi(
				'admin/user/manage/credit',
				'PUT',
				what_is(what.private.user, [user.username, amount])
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				error_message.innerText = r.message;
				return;
			}
			user_to_refill = r.is;
		}, debounceTimeoutDelay);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		user_to_refill = null;
		error_message.innerText = '';

		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		const username = valueArray[0];
		if (username.trim() === '') {
			error_message.innerText = 'Please enter a username to search for a user.';
			return;
		}
		const user: User | undefined = await lookupUser(username);
		if (user !== undefined) {
			console.log(user);
			user_to_refill = user;
		}
	}
</script>

<svelte:head>
	<title>UniFood | Dashboard / Refill</title>
</svelte:head>

<div class="stub border- hidden border" />

<div
	class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 pb-40 lg:px-16 lg:py-16"
>
	<div class="flex-header block w-full flex-wrap items-start lg:flex">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">Refill Accounts</div>
			<div class="flex pb-4 text-xl font-light lg:pb-12">View and refill an account's balance</div>
		</div>
	</div>
	<div class="flex w-full flex-col flex-wrap">
		<!-- Account refill UI goes here -->
		<!-- Have the admin search for a user first -->

		<form action="#" class="block w-full" on:submit={(e) => handleSubmit(e)}>
			<label for="topbar-search" class="sr-only">Search</label>
			<div class="relative w-full">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<Fa icon={faSearch} class="mr-4 text-COLORLIGHT-100" />
				</div>
				<input
					type="text"
					name="search"
					title="Type in a username and press enter"
					id="topbar-search"
					class="block w-full rounded-lg border-0 bg-COLORDARK-75 p-1.5 pl-9 text-xs font-light text-COLORLIGHT-100 placeholder-COLORLIGHT-100 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
					placeholder="Type in a username to search for a user and press enter"
				/>
			</div>
			<p bind:this={error_message} class="mt-2 text-xs text-rose-600"></p>
		</form>

		{#if user_to_refill !== null}
			<UserPill
				user={user_to_refill}
				description={'Credit balance: ' + user_to_refill.credit.$numberDecimal}
			>
				<svelte:fragment slot="extraContent">
					<form
						action="#refill"
						class="w-full"
						on:submit={(e) => refillUserAccount(e, user_to_refill)}
					>
						<div class="my-4 block w-full space-y-4">
							<div class="text-2xl font-semibold">Refill this account</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-light">Amount to refill with</div>
								<TextInput
									required
									icon={faMoneyBills}
									name="amount-to-refill"
									min="1.00"
                                    step="0.25"
									max="100.00"
									type="number"
									placeholder="Enter an amount (min 1/max 100)"
									custom_style="bg-transparent"
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center space-x-2">
								<div class="label w-full text-lg font-light mb-1">Common amounts</div>
								<Button 
									on:click={() => {
										refillUserAccount(
											{
												preventDefault: () => {},
												target: [{ name: 'amount-to-refill', value: 2 }]
											},
											user_to_refill
										);
									}}
									color="COLORDARK-100"
									color_t="COLORLIGHT-100"
									text="$2"
								/>
								<Button
									on:click={() => {
										refillUserAccount(
											{
												preventDefault: () => {},
												target: [{ name: 'amount-to-refill', value: 5 }]
											},
											user_to_refill
										);
									}}
									color="COLORDARK-100"
									color_t="COLORLIGHT-100"
									text="$5"
								/>
								<Button
									on:click={() => {
										refillUserAccount(
											{
												preventDefault: () => {},
												target: [{ name: 'amount-to-refill', value: 10 }]
											},
											user_to_refill
										);
									}}
									color="COLORDARK-100"
									color_t="COLORLIGHT-100"
									text="$10"
								/>
								<Button
									on:click={() => {
										refillUserAccount(
											{
												preventDefault: () => {},
												target: [{ name: 'amount-to-refill', value: 15 }]
											},
											user_to_refill
										);
									}}
									color="COLORDARK-100"
									color_t="COLORLIGHT-100"
									text="$15"
								/>
								<Button
									on:click={() => {
										refillUserAccount(
											{
												preventDefault: () => {},
												target: [{ name: 'amount-to-refill', value: 20 }]
											},
											user_to_refill
										);
									}}
									color="COLORDARK-100"
									color_t="COLORLIGHT-100"
									text="$20"
								/>
								<Button
									on:click={() => {
										refillUserAccount(
											{
												preventDefault: () => {},
												target: [{ name: 'amount-to-refill', value: 100 }]
											},
											user_to_refill
										);
									}}
									color="COLORDARK-100"
									color_t="COLORLIGHT-100"
									text="$100"
								/>
							</div>
							<Button type="submit" color="COLORDARK-100" color_t="COLORLIGHT-100" text="Refill" />
						</div>
					</form>
				</svelte:fragment>
			</UserPill>
		{/if}
	</div>
</div>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
	/*:global(body) {
		overflow: hidden;
	}*/
</style>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Generic/TextInput.svelte';
	import UserBanner from '$lib/Elements/Generic/UserBanner.svelte';
	import { editUser, registerUser } from '$lib/Elements/Utility/User';
	import config from '$lib/config/settings';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faAd, faCog, faDollar, faLock, faUserCog } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	const user_id = $page.url.searchParams.get('user_id');
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // User data
	let data: User; // List of users

	async function catchAll() {
		// Do not run if there is no user_id provided
		if (user_id) {
			const res = await fetchWebApi(`v1/admin/user/lookup?user_id=${user_id}`, 'GET');

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
			if (user_id == user._id) {
				localStorage.setItem('user', JSON.stringify(data));
			}
			console.log(data);
		} else {
			editPane.classList.toggle('hidden');
		}
	}

	onMount(async () => {
		try {
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the user: ${error.message}`);
		}
	});

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);
		console.log(
			valueArray,
			(!user_id &&
				valueArray[valueArray.length - 3].trim() !== '' &&
				valueArray[valueArray.length - 4].trim() !== '' &&
				valueArray[valueArray.length - 3] === valueArray[valueArray.length - 4]) ||
				(!staff &&
					user_id &&
					valueArray[valueArray.length - 2].trim() !== '' &&
					valueArray[valueArray.length - 1].trim() !== '' &&
					valueArray[valueArray.length - 2] === valueArray[valueArray.length - 1])
		);
		if (
			(!user_id &&
				valueArray[valueArray.length - 3].trim() !== '' &&
				valueArray[valueArray.length - 4].trim() !== '' &&
				valueArray[valueArray.length - 3] === valueArray[valueArray.length - 4]) ||
			staff ||
			(user_id &&
				valueArray[valueArray.length - 2].trim() !== '' &&
				valueArray[valueArray.length - 1].trim() !== '' &&
				valueArray[valueArray.length - 2] === valueArray[valueArray.length - 1])
		) {
			if (user_id) {
				console.table(['DATA TO BE SENT TO SERVER', valueArray]);
				editUser(
					/* (alias) editUser(action: "f" | "m", actionNum: number | undefined, 
					oldUsername: string, email: string, staff: boolean, credit: number, 
					restrictions: number, username?: string | undefined, 
					password?: string | ... 1 more ... | undefined, 
					bypassActivation?: boolean | undefined) */
					'm', // Action (modify)
					undefined, // Action Number (unused)
					data.username, // Identification (username)
					data.email, // Email (new, but stays the same here)
					data.staff, // Promote at all (no, stays the same)
					JSON.parse(parseFloat(data.credit.$numberDecimal).toFixed(2)), // Change credit (no, stays the same)
					data.restrictions, // Restrictions (no, stays the same)
					valueArray[0], // New username (yes, entered)
					valueArray[1] // New password (yes, entered)
				);
				toast.push(`You have updated ${data.username}'s details successfully.`);
			} else {
				if (
					valueArray[valueArray.length - 2] == 'YES' ||
					valueArray[valueArray.length - 2] == 'NO'
				) {
					valueArray[valueArray.length - 2] =
						valueArray[valueArray.length - 2] === 'YES' ? true : false;
					valueArray.splice(2, 1);
					// [valueArray[1], valueArray[2]] = [valueArray[2], valueArray[1]];
					valueArray[valueArray.length - 1] = JSON.parse(
						parseFloat(valueArray[valueArray.length - 1] ?? 0).toFixed(2)
					);
					valueArray.push(0); // Push the restrictions
					console.table(['DATA TO BE SENT TO SERVER', valueArray]);
					registerUser(valueArray);
				} else {
					toast.push('Staff member must be <b>YES</b> or <b>NO</b>', {
						dismissable: false,
						theme: {
							'--toastBarBackground': '#842d69'
						}
					});
				}
			}
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

<main class="w-full h-screen overflow-hidden">
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

	<div class="main-content flex items-center justify-start h-full text-COLORBLK overflow-hidden">
		<div
			class="drawer hidden lg:block bg-COLORWHT px-4 py-2 flex-col justify-start h-screen bg-opacity-100 w-full lg:w-1/4"
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
		<div class="content block px-16 py-16 w-full h-full bg-transparent overflow-auto pb-40">
			<div class="flex-header flex items-center w-full flex-wrap">
				<div class="block">
					<div class="flex text-2xl font-semibold pb-2">
						{user_id
							? user_id == user._id
								? 'My'
								: data
								? `${data.username}'s`
								: "User's"
							: 'Create'} User Account
					</div>
					<div class="flex text-xl font-semibold pb-12">
						{user_id ? 'Edit' : 'Create'}
						{user_id ? (user_id == user._id ? 'Your' : data ? `${data.username}'s` : 'An') : 'An'} Account
					</div>
				</div>
			</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#if !isNaN(user.id)}
						<div class="user_wrap w-full">
							<UserBanner
								user={data}
								tag
								tagColor={data?.staff ? 'COLORWHT1' : 'COLORBLK'}
								tagColor_t={data?.staff ? 'COLORBLK' : 'COLORWHT1'}
								tagText={data?.staff ? 'Admin' : 'User'}
								description="Token: {data?.token ?? '<b>Redacted</b>'}"
							>
								<div
									class="edit-wrap w-full lg:w-fit h-fit py-2 lg:p-0"
									on:click={() => editPane.classList.toggle('hidden')}
								>
									<Button
										icon={faCog}
										color="COLORBLK"
										color_t="COLORWHT1"
										text="Edit Account"
										custom_style="w-full lg:w-fit justify-center lg:justify-start"
									/>
								</div>
							</UserBanner>
						</div>
					{/if}{/if}
				<div
					class="editPane hidden flex flex-col lg:flex-row justify-around w-full bg-COLORWHT py-4 px-4"
					bind:this={editPane}
				>
					<div class="editGroup flex flex-col pb-8 px-4">
						<div class="flex text-xl font-semibold pb-12">
							{user_id ? 'Edit' : 'Create'}
							{user_id ? (user_id == user._id ? 'Your' : data ? `${data.username}'s` : 'An') : 'An'}
							Account
						</div>
						<form action="#" on:submit={(event) => handleSubmit(event)} class="space-y-3">
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">New username</div>
								<TextInput
									icon={faAd}
									name="username"
									placeholder="Type in a username"
									value={data ? data.username : ''}
									custom_style="bg-transparent"
									disabled={data ? (data.username === 'root' ? true : false) : false}
									disabled_text="You cannot change the root user's username."
									required
								/>
							</div>
							{#if !user_id}
								<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
									<div class="label font-semibold w-full text-lg">New email</div>
									<TextInput
										icon={faUserCog}
										name="email"
										placeholder="Type in a {config['server']['bound-organization']} email address"
										custom_style="bg-transparent"
										required
									/>
								</div>{/if}
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">New password</div>
								<TextInput
									icon={faLock}
									name="password"
									placeholder={staff
										? 'Type in a password (optional if editing user)'
										: 'Type in a password'}
									custom_style="bg-transparent"
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">New password</div>
								<TextInput
									icon={faLock}
									name="password2"
									placeholder="Retype {user_id
										? user_id == user._id
											? 'your'
											: data
											? `${data.username}'s`
											: 'the'
										: 'the'} password"
									custom_style="bg-transparent"
								/>
							</div>
							{#if !user_id}
								<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
									<div class="label font-semibold w-full text-lg">Staff member</div>
									<TextInput
										icon={faLock}
										name="staff"
										placeholder="Type 'YES' or 'NO'"
										custom_style="bg-transparent"
										required
									/>
								</div>
								<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
									<div class="label font-semibold w-full text-lg">Credit</div>
									<TextInput
										icon={faDollar}
										name="credit"
										placeholder="Type a decimal number (e.g. 1.00)"
										custom_style="bg-transparent"
										required
									/>
								</div>{/if}
							<button class="btn_wrp w-fit h-fit" type="submit">
								<Button
									icon={faCog}
									color="COLORBLK"
									color_t="COLORWHT1"
									text={user_id ? 'Apply changes' : 'Create account'}
									custom_style="my-2"
								/>
							</button>
						</form>
					</div>
					<div class="editGroup flex flex-col pb-8 px-4">
						{#if staff && data != undefined}
							<div class="flex text-xl font-semibold pb-12">Take Action</div>
							<div class="flex flex-col lg:flex-row">
								<div class="flex flex-col">
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Invalidate token</div>
										<div
											class="btn_wrp"
											on:click={() => {
												editUser(
													'f',
													1,
													data.username,
													data.email,
													data.staff,
													JSON.parse(parseFloat(data.credit.$numberDecimal).toFixed(2)),
													data.restrictions
												);
												toast.push(
													`You have invalidated ${data.username}'s token. They will be signed out.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Invalidate token"
												color="transparent"
												color_t="COLORBLK"
												custom_style="border border-COLORBLK my-2"
											/>
										</div>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">
											{data.staff ? 'Demote' : 'Promote'}
										</div>
										<div
											class="btn_wrp"
											on:click={() => {
												editUser(
													'm',
													undefined,
													data.username,
													data.email,
													data.staff == true ? false : true,
													JSON.parse(parseFloat(data.credit.$numberDecimal).toFixed(2)),
													data.restrictions
												);
												toast.push(
													`You have ${data.staff ? 'demoted' : 'promoted'} ${data.username}.`
												);
											}}
										>
											<Button
												icon={faUserCog}
												text="{data.staff ? 'Demote' : 'Promote'} user"
												color="transparent"
												color_t={data.staff ? 'COLORHPK' : 'COLORBLK'}
												custom_style="border border-{data.staff ? 'COLORHPK' : 'COLORBLK'} my-2"
											/>
										</div>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Trigger verification flow</div>
										<div
											class="btn_wrp"
											on:click={() => {
												editUser(
													'f',
													2,
													data.username,
													data.email,
													data.staff,
													JSON.parse(parseFloat(data.credit.$numberDecimal).toFixed(2)),
													data.restrictions
												);
												toast.push(
													`You have triggered the verification flow on ${data.username}. They will have to reverify their account.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Trigger verification flow"
												color="transparent"
												color_t="COLORHPK"
												custom_style="border border-COLORHPK my-2"
											/>
										</div>
									</div>
								</div>
								<div class="flex flex-col">
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Ban</div>
										<div
											class="btn_wrp"
											on:click={() => {
												editUser(
													'f',
													5,
													data.username,
													data.email,
													data.staff,
													JSON.parse(parseFloat(data.credit.$numberDecimal).toFixed(2)),
													data.restrictions
												);
												toast.push(
													`You have banned ${data.username}. Their account has been blocked from all services.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Ban user"
												color="transparent"
												color_t="COLORHPK"
												custom_style="border border-COLORHPK my-2"
											/>
										</div>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Lockout</div>
										<div
											class="btn_wrp"
											on:click={() => {
												editUser(
													'f',
													3,
													data.username,
													data.email,
													data.staff,
													JSON.parse(parseFloat(data.credit.$numberDecimal).toFixed(2)),
													data.restrictions
												);
												toast.push(
													`You have locked out ${data.username}. Their account has been disabled.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Lockout"
												color="transparent"
												color_t="COLORHPK"
												custom_style="border border-COLORHPK my-2"
											/>
										</div>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Delete account</div>
										<div
											class="btn_w"
											on:click={() => {
												editUser(
													'f',
													4,
													data.username,
													data.email,
													data.staff,
													JSON.parse(parseFloat(data.credit.$numberDecimal).toFixed(2)),
													data.restrictions
												);
												toast.push(
													`You have deleted ${data.username}'s account. They will be signed out.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Delete account"
												color="transparent"
												color_t="COLORHPK"
												custom_style="border border-COLORHPK my-2"
											/>
										</div>
									</div>
								</div>
							</div>{/if}
					</div>
				</div>
				<!-- {/if}
				{:else}<div class="font-light">There was a problem while displaying the data.</div>{/if}
		-->
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
	:global(body) {
		overflow: hidden;
	}
</style>

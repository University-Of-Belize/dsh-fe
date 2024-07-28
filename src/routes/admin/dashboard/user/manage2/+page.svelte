<script lang="ts">
	import { page } from '$app/stores';
	import UserBanner from '$lib/Elements/Banners/UserBanner2.svelte';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import { editUser, registerUser } from '$lib/Elements/Utility/User';
	import { R2S3Upload } from '$lib/Elements/Utility/vendor/dishout/r2_s3';
	import config from '$lib/config/index';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faAd,
		faCog,
		faDollar,
		faImage,
		faLock,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	const user_id = $page.url.searchParams.get('user_id');
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // User data
	let data: User; // User object data
	let debounceTimeout: number;
	let profileManagement: UserBanner;
	let photoBannerInput: HTMLInputElement;
	let photoBannerValue: HTMLInputElement;
	let userBannerImage: HTMLImageElement;

	async function catchAll() {
		if (localStorage.retry_identity == '2') {
			// @ts-ignore
			err_loadingFailure.innerText =
				'The user profile could not be loaded. Try going back to the dashboard and coming back here.';
		}
		if (localStorage.token && isNaN(user.id) && localStorage.retry_identity !== '2') {
			localStorage.setItem(
				'retry_identity',
				(parseInt(localStorage.retry_identity || '0') + 1).toString()
			);
			setTimeout(() => {
				window.location.reload();
			}, 800);
		} else {
			localStorage.removeItem('retry_identity'); // All checks passed! Reset counter!
		}
		// Do not run if there is no user_id provided
		if (user_id) {
			const res = (await fetchWebApi(
				`admin/user/lookup?user_id=${user_id == 'me' ? localStorage.user_id : user_id}`,
				'GET'
			)) as Response;
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
			fetchWebApi('dash/', 'GET'); // Are we logged in?
			await catchAll(); // Fetch the user for updates
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while loading the user page: ${error.message}`
			);
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
				// console.table(['DATA TO BE SENT TO SERVER', valueArray]);
				// Debounce 500ms
				try {
					// @ts-ignore
					clearTimeout(debounceTimeout);
					debounceTimeout = setTimeout(async () => {
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
						setTimeout(() => {
							catchAll(); // Fetch the user for updates -- we don't need the return
							// value so we're fine doing this
						}, 1250);
					}, 500); // 500ms break
				} catch (error) {
					console.log(error);
				}
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
					// Debounce 500ms
					try {
						// @ts-ignore
						clearTimeout(debounceTimeout);
						debounceTimeout = setTimeout(async () => {
							(await registerUser(valueArray)) as unknown as User;
							setTimeout(() => {
								// Wait for storaage to write before we run this
								if (localStorage.next_) {
									const next_ = JSON.parse(localStorage.next_);
									// Remove the item from storage (we don't need it anymore+clean-up)
									localStorage.removeItem('next_');
									setTimeout(() => {
										// Wait for write to complete before navigating
										window.location.href = `/admin/dashboard/user/manage2?user_id=${next_}`; // Hard reload+'destringify' (???)
									}, 550);
								}
							}, 1250);
						}, 500); // 500ms break
					} catch (error) {
						console.log(error);
					}
				} else {
					toast.push('Staff member must be <b>YES</b> or <b>NO</b>', {
						dismissable: false,
						theme: {
							'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
						}
					});
				}
			}
		} else {
			toast.push("<b>Retype password</b> and <b>password</b> aren't the same", {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
				}
			});
		}
	};
</script>

<svelte:head>
	<title>UniFood | Dashboard / User / Manage {data ? `@${data.username}` : 'User'}</title>
</svelte:head>

<div
	class="content block h-full w-full overflow-auto bg-transparent pb-40 md:px-2 lg:px-16 lg:py-16"
>
	<div class="flex w-full flex-wrap">
		{#if data != undefined && user_id}
			{#if !isNaN(user.id)}
				<div
					class="user_wrap relative flex h-56 w-full items-end justify-center rounded-md bg-COLORDARK-50"
				>
					<img
						class="absolute h-full w-full rounded-md object-cover"
						bind:this={userBannerImage}
						src={(data?.banner ?? '/homepage/eNkPGV.webp') || config['user']['default-image']}
						alt="{data?.username}'s banner"
						on:error={() => {
							data.banner = config['user']['default-image'];
						}}
					/>
					<!-- tag--->
					<UserBanner
						bind:this={profileManagement}
						user={data}
						description={data?.staff ? 'Administrator' : 'Standard Account'}
						editProfilePicture={// Admins only have so much control over users
						data._id == user._id}
					/>
					<div
						class="widget_andInput"
						on:click={() => {
							photoBannerInput.click();
						}}
					>
						<!-- Don't show the default input -->
						<input
							class="hidden"
							type="file"
							accept="image/*"
							bind:this={photoBannerInput}
							on:change={async (e) => {
								toast.push('Uploading...');
								const pub_url = await R2S3Upload(e, 'banner_photos', `${user?.id}_banner`);
								await profileManagement.updateBannerPhoto(pub_url);
								photoBannerValue.value = pub_url;
								userBannerImage.src = pub_url;
							}}
						/>
						<input
							type="hidden"
							name="photoValue"
							class="photoValue"
							bind:this={photoBannerValue}
							value={data ? data.banner : undefined}
						/>
						<div
							style="bottom: -4%; right: -0.8%;"
							class="widget-wrp absolute z-10 flex w-full items-center justify-end"
						>
							<div
								class="widget w-fit cursor-pointer rounded-md bg-COLORACCENTD px-2 py-2 text-COLORLIGHT-100 shadow-md hover:opacity-80"
							>
								<Fa icon={faImage} size="0.85x" />
							</div>
						</div>
					</div>
				</div>
			{:else}<div id="err_loadingFailure" class="font-light">
					The user profile could not be loaded. Wait! Trying another way to load it.
				</div>
			{/if}
		{:else if user_id}<div class="font-light">The server returned no data.</div>{/if}

		<div
			class="editPane flex flex-col lg:flex-row {staff
				? 'justify-around'
				: 'justify-start'} w-full bg-COLORDARK-75 px-4 py-4 pt-9"
			bind:this={editPane}
		>
			<div class="editGroup flex flex-col px-4 pb-8">
				<div class="flex pb-12 text-xl font-semibold">
					{user_id ? 'Edit' : 'Create'}
					{user_id ? (user_id == user._id ? 'Your' : data ? `${data.username}'s` : 'An') : 'An'}
					Account
				</div>
				<form action="#" on:submit={(event) => handleSubmit(event)} class="space-y-3">
					<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
						<div class="label w-full text-lg font-light">New username</div>
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
							<div class="label w-full text-lg font-light">New email</div>
							<TextInput
								icon={faUserCog}
								name="email"
								placeholder="Type in a {config['server']['bound-organization']} email address"
								custom_style="bg-transparent"
								required
							/>
						</div>{/if}
					<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
						<div class="label w-full text-lg font-light">New password</div>
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
						<div class="label w-full text-lg font-light">New password</div>
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
							<div class="label w-full text-lg font-light">Staff member</div>
							<TextInput
								icon={faLock}
								name="staff"
								placeholder="Type 'YES' or 'NO'"
								custom_style="bg-transparent"
								required
							/>
						</div>
						<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
							<div class="label w-full text-lg font-light">Credit</div>
							<TextInput
								icon={faDollar}
								name="credit"
								placeholder="Type a decimal number (e.g. 1.00)"
								custom_style="bg-transparent"
								required
							/>
						</div>{/if}
					<button class="btn_wrp h-fit w-fit" type="submit">
						<Button
							icon={faCog}
							color="COLORLIGHT-100"
							color_t="COLORDARK-100"
							text={user_id ? 'Apply changes' : 'Create account'}
							custom_style="my-2"
						/>
					</button>
				</form>
			</div>
			<div class="editGroup {staff ? '' : 'hidden'} flex flex-col px-4 pb-8">
				{#if staff && data != undefined}
					<div class="flex pb-12 text-xl font-semibold">Take Action</div>
					<div class="flex flex-col lg:flex-row">
						<div class="flex flex-col">
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Invalidate token</div>
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
										setTimeout(() => {
											catchAll(); // Fetch the user for updates -- we don't need the return
											// value so we're fine doing this
										}, 1250);
									}}
								>
									<Button
										icon={faLock}
										text="Invalidate session"
										color="transparent"
										color_t="COLORLIGHT-100"
										custom_style="border border-COLORLIGHT-100 my-2"
									/>
								</div>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">
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
										toast.push(`You have ${data.staff ? 'demoted' : 'promoted'} ${data.username}.`);
										setTimeout(() => {
											catchAll(); // Fetch the user for updates -- we don't need the return
											// value so we're fine doing this
										}, 1250);
									}}
								>
									<Button
										icon={faUserCog}
										text="{data.staff ? 'Demote' : 'Promote'} user"
										color="transparent"
										color_t={data.staff ? 'COLORACCENTL' : 'COLORLIGHT-100'}
										custom_style="border border-{data.staff ? 'COLORACCENTL' : 'COLORLIGHT-100'} my-2"
									/>
								</div>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Trigger verification flow</div>
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
										setTimeout(() => {
											catchAll(); // Fetch the user for updates -- we don't need the return
											// value so we're fine doing this
										}, 1250);
									}}
								>
									<Button
										icon={faLock}
										text="Trigger verification flow"
										color="transparent"
										color_t="COLORACCENTL"
										custom_style="border border-COLORACCENTL my-2"
									/>
								</div>
							</div>
						</div>
						<div class="flex flex-col">
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Ban</div>
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
										setTimeout(() => {
											catchAll(); // Fetch the user for updates -- we don't need the return
											// value so we're fine doing this
										}, 1250);
									}}
								>
									<Button
										icon={faLock}
										text="Ban user"
										color="transparent"
										color_t="COLORACCENTL"
										custom_style="border border-COLORACCENTL my-2"
									/>
								</div>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Lockout</div>
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
										setTimeout(() => {
											catchAll(); // Fetch the user for updates -- we don't need the return
											// value so we're fine doing this
										}, 1250);
									}}
								>
									<Button
										icon={faLock}
										text="Lockout"
										color="transparent"
										color_t="COLORACCENTL"
										custom_style="border border-COLORACCENTL my-2"
									/>
								</div>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Delete account</div>
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
										setTimeout(() => {
											history.back(); // User's gone. Go backwards
											// Should trigger a hard-reload
										}, 1250);
									}}
								>
									<Button
										icon={faLock}
										text="Delete account"
										color="transparent"
										color_t="COLORACCENTL"
										custom_style="border border-COLORACCENTL my-2"
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

<style>
	:root {
		--tw-bg-opacity: 1;
	}
	/*:global(body) {
		overflow: hidden;
	}*/
</style>

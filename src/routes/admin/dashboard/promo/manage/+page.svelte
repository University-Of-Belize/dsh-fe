<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import DateInput from '$lib/Elements/Generic/DateInput.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import PromoPill from '$lib/Elements/Generic/PromoPill.svelte';
	import TextInput from '$lib/Elements/Generic/TextInput.svelte';
	import { createPromo, deletePromo, editPromo, getDate } from '$lib/Elements/Utility/Promo';
	import config from '$lib/config/settings';
	import type { Promo } from '$lib/types/Promo';
	import type { User } from '$lib/types/User';
	import {
		faAd,
		faCalendar,
		faCalendarAlt,
		faCog,
		faDollar,
		faListAlt,
		faLock,
		faPencil,
		faSortAlphaAsc,
		faTag,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	const promo_id = $page.url.searchParams.get('promo_code');
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // User data
	let data: Promo; // List of users

	async function catchAll() {
		// Do not run if there is no promo_id provided
		if (promo_id) {
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/promo/manage`, {
				headers: {
					Authorization: `Bearer ${localStorage.token}`
				}
			});
			const r = await res.json();
			if (res.status === 403) {
				localStorage.removeItem('token');
				localStorage.removeItem('user_id');
				localStorage.removeItem('user');
				toast.push('You need to log in.');
				goto('/auth/login');
			}
			if (!res.ok) {
				return toast.push(r.message);
			}
			data = r.is; // Rizz
			// Filter data array
			// @ts-ignore
			data = data.filter((element) => element._id === promo_id);
			// Flatten
			// @ts-ignore
			data = data[0];
			// @ts-ignore
			if (data.length === 0) {
				toast.push('Category not found.');
			}
			console.log(data);
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
		// Convert back to timestamps because, we need those.
		valueArray[valueArray.length - 1] = Date.parse(valueArray[valueArray.length - 1]) / 1000;
		valueArray[valueArray.length - 2] = Date.parse(valueArray[valueArray.length - 2]) / 1000;
		console.log(valueArray);
		valueArray[3] = JSON.parse(valueArray[3]); // back to a number (discount percentage)

		if (typeof valueArray[3] === 'string') {
			valueArray[3] = parseInt(valueArray[3]);
		}

		if (promo_id) {
			editPromo(
				/* (alias) editPromo(oldCode, newCode, nickname, description, discount_percentage, start_date, end_date) */
				data.code, // old code
				valueArray[0], // new code
				valueArray[1], // nickname
				valueArray[2], // description
				valueArray[3], // percentage
				valueArray[4], // start date
				valueArray[5] // end date
			);
			toast.push(`You have updated ${data.name}'s details successfully.`);
		} else {
			createPromo(
				/* (alias) createPromo(newCode, nickname, description, discount_percentage, start_date, end_date) */
				valueArray[0], // new code
				valueArray[1], // nickname
				valueArray[2], // description
				valueArray[3], // percentage
				valueArray[4], // start date
				valueArray[5] // end date
			);
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
		<div class="content block px-16 py-16 w-full h-full bg-transparent overflow-auto pb-40">
			<div class="flex-header flex items-center w-full flex-wrap">
				<div class="block">
					<div class="flex text-2xl font-semibold pb-2">
						{promo_id ? 'Edit' : 'New'} Promo Code
					</div>
					<div class="flex text-xl font-semibold pb-12">
						{promo_id ? 'Edit' : 'Create'} promo codes
					</div>
				</div>
			</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#if !isNaN(user.id) && staff}
						<div class="user_wrap w-full">
							<div class="ctg_wrp w-full">
								<PromoPill promo={data} description={data.code}
									><div slot="alias" class="my-2">
										<!-- Categories get the same alias -->

										<div class="text-md font-semibold">Created by</div>
										<ul>
											<li class="before:content-['-⠀'] flex items-center">
												<div class="font-light text-sm">
													{data.created_by ? data.created_by.username : 'Cannot retrieve author.'}
												</div>
											</li>
										</ul>
									</div>
								</PromoPill>
							</div>
						</div>
					{/if}{/if}
				<div
					class="editPane flex flex-col lg:flex-row justify-around w-full bg-COLORWHT py-4 px-4"
					bind:this={editPane}
				>
					<div class="editGroup flex flex-col pb-8 px-4">
						<div class="flex text-xl font-semibold pb-12">
							{promo_id ? 'Edit' : 'Create a'}
							promo code
						</div>
						<form action="#" on:submit={(event) => handleSubmit(event)} class="space-y-3">
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Promo code</div>
								<TextInput
									icon={faTag}
									name="name"
									placeholder="Enter a promo code"
									custom_style="bg-transparent"
									value={data ? data.code : ''}
								/>
							</div>

							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Nickname (optional)</div>
								<TextInput
									icon={faSortAlphaAsc}
									name="alias"
									placeholder="Enter a nickname"
									custom_style="bg-transparent"
									value={data ? data.nickname : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Description</div>
								<div class="review-wrap border border-black rounded-md mb-4 w-full">
									<div
										class="text-i-combo flex font-semibold items-center justify-start text-COLORGRY"
									>
										<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
										Type in a description
									</div>
									<textarea
										name="description"
										class="text-md font-light text-COLORBLE h-full w-full px-2 py-1 mx-6 bg-transparent focus:outline-none"
										rows="6"
										placeholder="Category description goes here"
										value={data ? data.description : ''}
									/>
								</div>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Discount percentage</div>
								<TextInput
									icon={faTag}
									name="alias"
									placeholder="Enter a discount percentage (e.g. 10)"
									custom_style="bg-transparent"
									value={data ? data.discount_percentage : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Start Date</div>
								<DateInput
									icon={faCalendarAlt}
									name="alias"
									placeholder="Enter a discount percentage (e.g. 10)"
									custom_style="bg-transparent"
									value={data ? getDate(data.start_date) : new Date().toISOString().split('T')[0]}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">End Date</div>
								<DateInput
									icon={faCalendarAlt}
									name="alias"
									placeholder="Enter a discount percentage (e.g. 10)"
									custom_style="bg-transparent"
									value={data ? getDate(data.expiry_date) : new Date().toISOString().split('T')[0]}
								/>
							</div>
							<button class="btn_wrp w-fit h-fit" type="submit">
								<Button
									icon={faCog}
									color="COLORBLK"
									color_t="COLORWHT1"
									text={promo_id ? 'Apply changes' : 'Create category'}
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
										<div class="label font-semibold w-full text-lg">Delete promotion</div>
										<div
											class="btn_wrp"
											on:click={() => {
												deletePromo(data.code);
												toast.push(
													`You have deleted the category ${data.code}. It will be invalidated.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Delete promo"
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

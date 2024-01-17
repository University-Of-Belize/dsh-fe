<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import PromoPill from '$lib/Elements/Dashboard/PromoPill.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import DateInput from '$lib/Elements/Inputs/DateInput.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import { createPromo, deletePromo, editPromo } from '$lib/Elements/Utility/Promo';
	import { getDate } from '$lib/Elements/Utility/time';
	import config from '$lib/config/settings';
	import type { Promo } from '$lib/types/Promo';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faCalendarAlt,
		faCog,
		faLock,
		faPencil,
		faSortAlphaAsc,
		faTag
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
			const res = (await fetchWebApi('v1/admin/promo/manage', 'GET')) as Response;
			const r = await res.json();
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
				toast.push('Promotion not found.');
			}
			console.log(data);
		}
	}

	onMount(async () => {
		try {
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while loading the promo page: ${error.message}`
			);
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
			toast.push(`You have updated ${data.code}'s details successfully.`);
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

<svelte:head>
	<title>Plattr | Dashboard / Promotions / Manage Promotion Codes</title>
</svelte:head>

<main class="h-screen w-full overflow-hidden">
	<div class="navigation z-20 w-full">
		<Navigation
			transparency={5}
			search={true}
			titleText="{config.ui['branding-text']} {staff
				? ''
				: "<div class='font-bold overflow-hidden'>| Dashboard</div>"}"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex h-full items-center justify-start overflow-hidden text-COLORWHT">
		<div
			class="drawer hidden h-screen w-full flex-col justify-start overflow-auto bg-COLORWHT4 bg-opacity-20 px-4 py-2 lg:block lg:w-1/4"
			bind:this={navDrawer}
		>
			<DashList {staff} />
		</div>
		<div class="content block h-full w-full overflow-auto bg-transparent px-16 py-16 pb-40">
			<div class="flex-header flex w-full flex-wrap items-center">
				<div class="block">
					<div class="flex pb-2 text-2xl font-semibold">
						{promo_id ? 'Edit' : 'New'} Promo Code
					</div>
					<div class="flex pb-12 text-xl font-semibold">
						{promo_id ? 'Edit' : 'Create'} promo codes
					</div>
				</div>
			</div>
			<div class="flex w-full flex-wrap">
				{#if data != undefined}
					{#if !isNaN(user.id) && staff}
						<div class="user_wrap w-full">
							<div class="ctg_wrp w-full">
								<PromoPill promo={data} description={data.code}
									><div slot="alias" class="my-2">
										<div class="text-md font-semibold">Created by</div>
										<ul>
											<li class="flex items-center before:content-['-⠀']">
												<div class="text-sm font-light">
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
					class="editPane flex w-full flex-col justify-around bg-COLORBLK1 px-4 py-4 lg:flex-row"
					bind:this={editPane}
				>
					<div class="editGroup flex flex-col px-4 pb-8">
						<div class="flex pb-12 text-xl font-semibold">
							{promo_id ? 'Edit' : 'Create a'}
							promo code
						</div>
						<form action="#" on:submit={(event) => handleSubmit(event)} class="space-y-3">
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Promo code</div>
								<TextInput
									icon={faTag}
									name="code"
									placeholder="Enter a promo code"
									custom_style="bg-transparent"
									value={data ? data.code : ''}
								/>
							</div>

							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Nickname (optional)</div>
								<TextInput
									icon={faSortAlphaAsc}
									name="nickname"
									placeholder="Enter a nickname"
									custom_style="bg-transparent"
									value={data ? data.nickname : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Description</div>
								<div class="review-wrap mb-4 w-full rounded-md border border-COLORWHT">
									<div
										class="text-i-combo flex items-center justify-start font-semibold text-COLORGRY"
									>
										<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
										Type in a description
									</div>
									<textarea
										name="description"
										class="text-md mx-6 h-full w-full bg-transparent px-2 py-1 font-light text-COLORWHT focus:outline-none"
										rows="6"
										placeholder="Promotion description goes here"
										value={data ? data.description : ''}
									/>
								</div>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Discount percentage</div>
								<TextInput
									icon={faTag}
									name="discount"
									placeholder="Enter a discount percentage (e.g. 10)"
									custom_style="bg-transparent"
									value={data ? data.discount_percentage : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Start Date</div>
								<DateInput
									icon={faCalendarAlt}
									name="p_start"
									placeholder="Enter a discount percentage (e.g. 10)"
									custom_style="bg-transparent"
									value={data ? getDate(data.start_date) : new Date().toISOString().split('T')[0]}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">End Date</div>
								<DateInput
									icon={faCalendarAlt}
									name="p_end"
									placeholder="Enter a discount percentage (e.g. 10)"
									custom_style="bg-transparent"
									value={data ? getDate(data.expiry_date) : new Date().toISOString().split('T')[0]}
								/>
							</div>
							<button class="btn_wrp h-fit w-fit" type="submit">
								<Button
									icon={faCog}
									color="COLORWHT"
									color_t="COLORBLK"
									text={promo_id ? 'Apply changes' : 'Create promotion'}
									custom_style="my-2"
								/>
							</button>
						</form>
					</div>
					<div class="editGroup flex flex-col px-4 pb-8">
						{#if staff && data != undefined}
							<div class="flex pb-12 text-xl font-semibold">Take Action</div>
							<div class="flex flex-col lg:flex-row">
								<div class="flex flex-col">
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label w-full text-lg font-semibold">Delete promotion</div>
										<div
											class="btn_wrp"
											on:click={() => {
												deletePromo(data.code);
												toast.push(
													`You have deleted the promo ${data.code}. It will be invalidated.`
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

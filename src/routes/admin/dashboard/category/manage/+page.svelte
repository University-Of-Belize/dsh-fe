<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import CategoryPill from '$lib/Elements/Generic/CategoryPill.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Generic/TextInput.svelte';
	import { createCategory, deleteCategory, editCategory } from '$lib/Elements/Utility/Category';
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faCog,
		faListAlt,
		faLock,
		faPencil,
		faSortAlphaAsc
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	const category_id = $page.url.searchParams.get('category_id');
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // User data
	let data: Category; // List of users

	async function catchAll() {
		// Do not run if there is no category_id provided
		if (category_id) {
			const res = await fetchWebApi('v1/category', 'GET');
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
			data = data.filter((element) => element._id === category_id);
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
		console.log(valueArray);

		if (category_id) {
			editCategory(
				/* (alias) editCategory(oldName, newName, description, alias, hidden) */
				data.name,
				valueArray[0],
				valueArray[2],
				valueArray[1],
				valueArray[3] ?? false
			);
			toast.push(`You have updated ${data.name}'s details successfully.`);
		} else {
			createCategory(
				/* (alias) createCategory(newName, description, alias, hidden) */
				valueArray[0],
				valueArray[2],
				valueArray[1],
				valueArray[3] ?? false
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
						{category_id ? 'Edit' : 'New'} Product Category
					</div>
					<div class="flex text-xl font-semibold pb-12">
						{category_id ? 'Edit a' : 'Create a'} product category
					</div>
				</div>
			</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#if !isNaN(user.id) && staff}
						<div class="user_wrap w-full">
							<div class="ctg_wrp w-full">
								<CategoryPill category={data} description={data.description}
									><div slot="alias" class="my-2">
										<!-- Categories get the same alias -->
										{#if data.alias != undefined && data.alias != data.name}
											<div class="text-md font-semibold">Also known as</div>
											<ul>
												<li class="before:content-['-⠀'] flex items-center">
													<div class="font-light text-sm">{data.alias}</div>
												</li>
											</ul>
										{/if}
									</div>
								</CategoryPill>
							</div>
						</div>
					{/if}{/if}
				<div
					class="editPane flex flex-col lg:flex-row justify-around w-full bg-COLORWHT py-4 px-4"
					bind:this={editPane}
				>
					<div class="editGroup flex flex-col pb-8 px-4">
						<div class="flex text-xl font-semibold pb-12">
							{category_id ? 'Edit' : 'Create a'}
							category
						</div>
						<form action="#" on:submit={(event) => handleSubmit(event)} class="space-y-3">
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Category name</div>
								<TextInput
									icon={faListAlt}
									name="name"
									placeholder="Type in a category name"
									custom_style="bg-transparent"
									value={data ? data.name : ''}
								/>
							</div>

							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Category alias (optional)</div>
								<TextInput
									icon={faSortAlphaAsc}
									name="alias"
									placeholder="Type in a category alias (optional)"
									custom_style="bg-transparent"
									value={data ? (data.alias === data.name ? '' : data.alias) : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label font-semibold w-full text-lg">Category description</div>
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

							<button class="btn_wrp w-fit h-fit" type="submit">
								<Button
									icon={faCog}
									color="COLORBLK"
									color_t="COLORWHT1"
									text={category_id ? 'Apply changes' : 'Create category'}
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
										<div class="label font-semibold w-full text-lg">
											Hide category (currently {data.hidden ? 'hidden' : 'unhidden'})
										</div>
										<div
											class="btn_wrp"
											on:click={() => {
												editCategory(
													/* (alias) editCategory(oldName, newName, description, alias, hidden) */
													data.name,
													data.name,
													data.description,
													data.alias,
													data.hidden ? false : true
												); // This is correct backwards like this. Because it's toggling the visibility, not displaying it.
												toast.push(
													`You have ${data.hidden ? 'unhidden' : 'hidden'} the category ${
														data.name
													}. It will be ${
														data.hidden ? 'visible in' : 'removed from'
													} search results.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Toggle visibility"
												color="transparent"
												color_t={data.hidden ? 'COLORBLE' : 'COLORHPK'}
												custom_style="border border-{data.hidden ? 'COLORBLE' : 'COLORHPK'} my-2"
											/>
										</div>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Delete category</div>
										<div
											class="btn_wrp"
											on:click={() => {
												deleteCategory(data.name);
												toast.push(
													`You have deleted the category ${data.name}. It will be removed from search results.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Delete Category"
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

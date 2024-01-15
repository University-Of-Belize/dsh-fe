<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import CategoryPill from '$lib/Elements/Dashboard/CategoryPill.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import { createCategory, deleteCategory, editCategory } from '$lib/Elements/Utility/Category';
	import type { Category } from '$lib/types/Category';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faBoltLightning,
		faCog,
		faListAlt,
		faLock,
		faPencil,
		faQuestionCircle,
		faSortAlphaAsc
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { v4 } from 'uuid';
	import config from '$lib/config/settings';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	const category_id = $page.url.searchParams.get('category_id');
	let category_identity_input: TextInput;
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // User data
	let data: Category; // List of users

	async function catchAll() {
		// Do not run if there is no category_id provided
		if (category_id) {
			const res = (await fetchWebApi('v1/category', 'GET')) as Response;
			const r = await res.json();
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
			toast.push(
				`Oops. Something unexpected happened while loading the category page: ${error.message}`
			);
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

<svelte:head>
	<title>Plattr | Dashboard / Categories / Manage '{data ? data.name : 'Category'}'</title>
</svelte:head>

<main class="h-screen w-full overflow-hidden">
	<div class="navigation z-20 w-full">
		<Navigation
			transparency={5}
			search={true}
			titleText="{config.ui['branding-text']} {staff
				? ''
				: "<div class='font-bold pl-1 overflow-hidden'>| Dashboard</div>"}"
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
						{category_id ? 'Edit' : 'New'} Product Category
					</div>
					<div class="flex pb-12 text-xl font-semibold">
						{category_id ? 'Edit a' : 'Create a'} product category
					</div>
				</div>
			</div>
			<div class="flex w-full flex-wrap">
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
												<li class="flex items-center before:content-['-⠀']">
													<div class="text-sm font-light">{data.alias}</div>
												</li>
											</ul>
										{/if}
									</div>
								</CategoryPill>
							</div>
						</div>
					{/if}{/if}
				<div
					class="editPane flex w-full flex-col justify-around bg-COLORBLK1 px-4 py-4 lg:flex-row"
					bind:this={editPane}
				>
					<div class="editGroup flex flex-col px-4 pb-8">
						<div class="flex pb-12 text-xl font-semibold">
							{category_id ? 'Edit' : 'Create a'}
							category
						</div>
						<form action="#" on:submit={(event) => handleSubmit(event)} class="space-y-3">
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div
									class="label flex w-full items-center justify-start space-x-2 text-lg font-semibold"
								>
									<div class="title">Category name</div>
									<div
										title="This is what users will see in their sidebars, and you will see in your dashboard."
										class="icon cursor-help select-none"
									>
										<Fa icon={faQuestionCircle} size="1x" />
									</div>
								</div>
								<TextInput
									icon={faListAlt}
									name="name"
									placeholder="Type in a category name"
									custom_style="bg-transparent"
									value={data ? data.name : ''}
								/>
							</div>

							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div
									class="label flex w-full items-center justify-start space-x-2 text-lg font-semibold"
								>
									<div class="title">Category identity (recommended)</div>
									<div
										title="Autogenerate a category ID"
										class="icon cursor-pointer select-none hover:opacity-70"
										on:click={() => {
											category_identity_input.value = v4(); // Assign the category ID to a v4 UUID
										}}
									>
										<Fa icon={faBoltLightning} size="1x" />
									</div>
									<div
										title="Narrow down search results by adding a category identity. This is used to identify the category in search results. For example the category identity for food can be 'food'. Although, this has its downsides. First of all, a category identity must not have the same group of words. Otherwise, this will cause the search engine to group all categories with similar characteristics together-which in some cases is a good thing, but in this case it's not what you want. This means that if you have a category called 'food' and another called 'food-and-drinks', the search engine will group them together. This is because they both have the word 'food' in them. This is why it is recommended to use a category ID that is not a word, or to use the generator by clicking on the 'lightning bolt' icon above. For example, 'food' can be 'fd' and this will prevent the search engine from grouping them together."
										class="icon cursor-help select-none"
									>
										<Fa icon={faQuestionCircle} size="1x" />
									</div>
								</div>
								<TextInput
									bind:this={category_identity_input}
									icon={faSortAlphaAsc}
									name="alias"
									placeholder="Type in a category ID (recommended)"
									custom_style="bg-transparent"
									value={data ? (data.alias === data.name ? '' : data.alias) : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-semibold">Category description</div>
								<div class="review-wrap mb-4 w-full rounded-md border border-black">
									<div
										class="text-i-combo flex items-center justify-start font-semibold text-COLORGRY"
									>
										<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
										Type in a description
									</div>
									<textarea
										name="description"
										class="text-md mx-6 h-full w-full bg-transparent px-2 py-1 font-light text-COLORBLE focus:outline-none"
										rows="6"
										placeholder="Category description goes here"
										value={data ? data.description : ''}
									/>
								</div>
							</div>

							<button class="btn_wrp h-fit w-fit" type="submit">
								<Button
									icon={faCog}
									color="COLORWHT"
									color_t="COLORBLK"
									text={category_id ? 'Apply changes' : 'Create category'}
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
										<div class="label w-full text-lg font-semibold">
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
										<div class="label w-full text-lg font-semibold">Delete category</div>
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

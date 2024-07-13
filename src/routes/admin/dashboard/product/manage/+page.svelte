<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import Select from '$lib/Elements/Inputs/Select2.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import { createProduct, deleteProduct, editProduct } from '$lib/Elements/Utility/Product';
	import { R2S3Upload } from '$lib/Elements/Utility/vendor/dishout/r2_s3';
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	import type { Product } from '$lib/types/Product';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faBox,
		faCog,
		faList,
		faLock,
		faPencil,
		faQuestionCircle,
		faSign,
		faSortAlphaAsc,
		faTag
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import TagInput from '../../../../../lib/Elements/Inputs/TagInput.svelte';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	const product_id = $page.url.searchParams.get('product_id');
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {}; // User data
	let data: Product = config['ui']['default-product']; // List of users
	let productForm: HTMLFormElement;
	let productImage: HTMLImageElement;
	let photoInput: HTMLInputElement;
	let photoValue: HTMLInputElement;
	let categories: Category[] = [];
	let keywords_input: TagInput;

	async function populateCategories() {
		const res = (await fetchWebApi('v1/category', 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		categories = r.is; // Rizz
		console.log(categories);
	}

	async function catchAll() {
		populateCategories();
		// Do not run if there is no product_id provided
		if (product_id) {
			const res = (await fetchWebApi(`v1/menu/lookup?product_id=${product_id}`, 'GET')) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			data = r.is; // Rizz
			// Filter data array
			// @ts-ignore
			// data = data.filter((element) => element._id === product_id);
			// Flatten
			// @ts-ignore
			// data = data[0];

			// Restore the keywords
			keywords_input.results = data.keywords ?? [];
			if (data.keywords && data.keywords.length > 0) {
				data.keywords.forEach((element) => {
					keywords_input.addTag(element);
				});
				// Remove the placeholder as there will already be tags
				keywords_input.placeholder = '';
			}
			// @ts-ignore
			if (data.length === 0) {
				toast.push('Product not found.');
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
				`Oops. Something unexpected happened while loading the product page: ${error.message}`
			);
		}
	});

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);
		// Back to a number
		[valueArray[4], valueArray[5]] = [
			JSON.parse(parseFloat(valueArray[4]).toFixed(2)),
			JSON.parse(valueArray[5])
		]; // back to a number

		// Require at least one keyword
		if (!keywords_input.results || keywords_input.results.length === 0) {
			console.error('Product validation failed.');
			return toast.push(
				'Add at least one keyword to make searching easier and enhance product searchability.'
			);
		}
		// Return an error if duplicates of the same entry is found in keywords_input.results
		if (new Set(keywords_input.results).size !== keywords_input.results?.length ?? 0) {
			console.error('Product validation failed.');
			return toast.push(
				'You cannot have duplicate keywords. Remove any duplicate keywords and press submit to continue.'
			);
		}

		// @note [Disabled-on-Request]: Require a product image
		/*if (valueArray[0] === '') {
			console.error('Product validation failed.');
			return toast.push('You need to upload an image.');
		}*/
		// Make the last element the value of the keywords_input array
		// Minus one to overwrite the last entry, which is supposed to be an empty/blank string
		valueArray[valueArray.length - 1] = keywords_input.results;
		console.log(valueArray);

		if (product_id) {
			editProduct(
				/* (alias) editProduct(oldSlug, category_id, slug, productName, description, image_url, price, discount) */
				data.slug, // old slug
				valueArray[6], // category_id
				valueArray[2], // slug
				valueArray[3], // name
				valueArray[1], // description
				valueArray[7], // keywords array
				valueArray[0], // image url
				valueArray[4], // price
				valueArray[5] // discount
			);
			toast.push(`You have updated ${data.productName}'s details successfully.`);
		} else {
			createProduct(
				/* (alias) createProduct(newCode, nickname, description, discount_percentage, start_date, end_date) */
				valueArray[6], // category_id
				valueArray[2], // slug
				valueArray[3], // name
				valueArray[1], // description
				valueArray[7], // keywords array
				valueArray[0], // image url
				valueArray[4], // price
				valueArray[5] // discount
			);
		}
	};
</script>

<svelte:head>
	<title>UniFood | Dashboard / Product / Manage '{data ? data.productName : 'Product'}'</title>
</svelte:head>

<div class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 lg:px-16 lg:py-16 pb-40">
	<div class="flex-header flex w-full flex-wrap items-center">
		<div class="block">
			<div class="flex pb-2 text-2xl font-semibold">Product Wizard</div>
			<div class="flex pb-12 text-xl font-light">
				{product_id ? 'Edit' : 'Create a new'} product listing
			</div>
		</div>
	</div>
	<div class="flex w-full flex-wrap">
		{#if data != undefined}
			{#if !isNaN(user.id) && staff}
				<div class="user_wrap w-full">
					<div class="ctg_wrp w-full" />
				</div>

				<div
					class="editPane w-full block rounded-md border border-COLORWHT3 bg-COLORBLK1 px-4 py-4 lg:flex-row"
					bind:this={editPane}
				>
					<div class="editGroup flex flex-col px-4 pb-8">
						<form
							action="#"
							bind:this={productForm}
							on:keydown={(e) => e.key === 'Enter' && e.preventDefault()}
							on:submit={(event) => handleSubmit(event)}
							class="space-y-3"
						>
							<div class="block">
								<div class="text-2xl font-semibold text-COLORWHT">
									{data
										? data.productName
											? data.productName
											: 'Untitled Product'
										: 'Untitled Product'}
								</div>
								<div class="flex text-base font-semibold text-COLORWHT">
									<div class="pr-1 font-light">Category:</div>
									{data ? (data.category ? data.category.name : 'Uncategorized') : 'Uncategorized'}
								</div>
							</div>
							<div class="banner-top items-top flex w-full flex-wrap space-x-4">
								<div
									class="pimg_wrp block h-fit w-fit rounded-md bg-COLORBLE"
									on:click={() => {
										photoInput.click();
									}}
								>
									<div class="pimg_wrp2 relative">
										<!-- Don't show the default input -->
										<input
											class="hidden"
											type="file"
											accept="image/*"
											bind:this={photoInput}
											on:change={async (e) => {
												const pub_url = await R2S3Upload(e, 'product_photos', data._id);
												photoValue.value = pub_url;
												productImage.src = pub_url;
											}}
										/>
										<input
											type="hidden"
											name="photoValue"
											class="photoValue"
											bind:this={photoValue}
											value={data ? data.image : config['product-view']['default-image']}
										/>
										<div
											style="top: -4%; right: -4%;"
											class="widget-wrp absolute z-10 flex w-full items-center justify-end"
										>
											<div
												class="widget w-fit cursor-pointer rounded-md bg-COLORBLE px-2 py-2 text-COLORWHT shadow-md hover:opacity-80"
											>
												<Fa icon={faPencil} size="0.85x" />
											</div>
										</div>
										<div
											class="product-image relative block cursor-pointer overflow-clip rounded-md hover:opacity-80"
										>
											<img
												bind:this={productImage}
												src={data.image}
												alt={data.productName}
												class="productImage h-56 w-72 rounded-sm object-cover"
											/>
										</div>
									</div>
								</div>
								<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
									<div class="label w-full text-lg font-semibold">Product description</div>
									<div class="review-wrap mb-4 w-full rounded-md border border-black">
										<div
											class="text-i-combo flex items-center justify-start font-semibold text-COLORWHT"
										>
											<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
											Type in a description
										</div>
										<div class="pdsc_wrp overflow-auto">
											<textarea
												on:keydown={(e) => {
													e.stopPropagation();
												}}
												name="description"
												class="text-md mx-6 h-full w-full bg-transparent px-2 py-1 font-light text-COLORWHT focus:outline-none"
												rows="6"
												placeholder="Product description goes here. Add as many words as you'd like. Note each word will be counted as a keyword. So be specific, and descriptive at the same time. Products are indexed every {config[
													'server'
												]['indexing-interval']}"
												value={data ? data.description ?? '' : ''}
											/>
										</div>
									</div>
								</div>
							</div>
							<div class="text-2xl font-semibold">General Settings</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-light">Slug</div>
								<TextInput
									icon={faSign}
									name="slug"
									placeholder="Enter a slug (e.g. coca-cola-canned)"
									custom_style="bg-transparent"
									value={data ? data.slug : ''}
								/>
							</div>

							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-light">Product name</div>
								<TextInput
									icon={faSortAlphaAsc}
									name="name"
									placeholder="Enter a product name (e.g. 'Coca Cola (Canned)')"
									custom_style="bg-transparent"
									value={data ? data.productName : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-light">Listed price</div>
								<TextInput
									icon={faTag}
									name="price"
									placeholder="Enter a price (e.g. 10.75)"
									custom_style="bg-transparent"
									value={data ? (data.price ? data.price.$numberDecimal : '') : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-light">In stock</div>
								<TextInput
									icon={faBox}
									name="in_stock"
									placeholder="How many of this item are available (e.g. 35)"
									custom_style="bg-transparent"
									value={data ? data.in_stock : ''}
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div class="label w-full text-lg font-light">Category</div>
								<Select
									icon={faList}
									name="category"
									placeholder="Select a category"
									value={data ? data.category._id : 'placeholder'}
									custom_style="bg-transparent border border-COLORWHT mt-1"
									options={categories}
									options_color="text-COLORBLK"
								/>
							</div>
							<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
								<div
									class="label flex w-fit items-center justify-start space-x-2 text-lg font-light"
								>
									<div>Keywords</div>
									<div
										title="You can think of these as subcategories. Keywords can help users in searching for what they need. Add as many as you'd like, but be strategic when using them. Each word will be counted as a keyword. So be specific, and descriptive at the same time. Like for example, you can tag all drinks (hot or cold) as 'beverages' just as you'd tag all breakfast and lunch items as 'food'. Products are indexed every {config[
											'server'
										]['indexing-interval']}, so it may take a while before it takes effect."
										class="icon cursor-help select-none"
									>
										<Fa icon={faQuestionCircle} size="1x" />
									</div>
								</div>
								<TagInput
									bind:this={keywords_input}
									custom_style="bg-transparent"
									placeholder="Type in a keyword and press 'Enter'"
								/>
							</div>
							<button class="btn_wrp h-fit w-fit" type="submit">
								<Button
									icon={faCog}
									color="COLORWHT"
									color_t="COLORBLK"
									text={product_id ? 'Apply changes' : 'Create product'}
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
										<div class="label w-full text-lg font-semibold">Delete product</div>
										<div
											class="btn_wrp"
											on:click={() => {
												deleteProduct(data.slug);
												toast.push(
													`You have deleted the product '${data.productName}'. Its page is currently being removed.`
												);
											}}
										>
											<Button
												icon={faLock}
												text="Delete product"
												color="transparent"
												color_t="COLORHPK"
												custom_style="border border-COLORHPK my-2"
											/>
										</div>
									</div>
								</div>
							</div>{/if}
					</div>
				</div>{/if}{/if}
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

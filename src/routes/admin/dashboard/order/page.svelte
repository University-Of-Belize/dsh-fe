<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Generic/TextInput.svelte';
	import Select from '$lib/Elements/Generic/Select2.svelte';
	import { createProduct, deleteProduct, editProduct } from '$lib/Elements/Utility/Product';
	import { R2S3Upload } from '$lib/Elements/Utility/vendor/dishout/r2_s3';
	import config from '$lib/config/settings';
	import type { Product } from '$lib/types/Product';
	import type { User } from '$lib/types/User';
	import {
		faBox,
		faCog,
		faList,
		faLock,
		faPencil,
		faSign,
		faSortAlphaAsc,
		faTag
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import type { Order } from '$lib/types/Order';
	let navDrawer: HTMLDivElement;
	let editPane: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // User data
	let data: Order[]; // List of orders




	async function catchAll() {

		// Do not run if there is no product_id provided
	
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/order/manage`, {
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
			// data = data.filter((element) => element._id === product_id);
			// Flatten
			// @ts-ignore
			// data = data[0];
			// @ts-ignore
			if (data.length === 0) {
				toast.push('Product not found.');
			}
			console.log(data);

	}

	onMount(async () => {
		try {
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the user: ${error.message}`);
		}
	});


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
					<div class="flex text-2xl font-semibold pb-2">What's Queued?</div>
					<div class="flex text-xl font-semibold pb-12">
						Accept, decline and modify orders
					</div>
				</div>
			</div>
			<div class="flex flex-wrap w-full">
				{#if data != undefined}
					{#if !isNaN(user.id) && staff} {#each data as order}
						<div class="user_wrap w-full">
							<div class="ctg_wrp w-full" />
						</div>

						<div
							class="editPane flex flex-col lg:flex-row justify-around w-full bg-COLORWHT py-4 px-4 rounded-sm border border-COLORWHT3"
							bind:this={editPane}
						>
							<div class="editGroup flex flex-col pb-8 px-4">
								
									<div class="block">
										<div class="text-2xl text-COLORBLK font-semibold">{data? data.productName? data.productName: "Untitled Product" : "Untitled Product"}</div>
										<div class="text-base text-COLORBLK font-semibold flex">
											<div class="font-light pr-1">Category:</div>
											{data? data.category? data.category.name : "Uncategorized" : "Uncategorized"}
										</div>
									</div>
									<div class="banner-top flex flex-wrap w-full space-x-4 items-top">
										<div
											class="pimg_wrp block bg-COLORBLE h-fit w-fit rounded-md"
										
										>
											<div class="pimg_wrp2 relative">
											
												<div
													class="product-image relative block overflow-clip rounded-md hover:opacity-80 cursor-pointer"
												>
													<img
														src={order.prodimage}
														alt={data.productName}
														class="productImage rounded-sm w-72 h-56 object-cover"
													/>
												</div>
											</div>
										</div>
										<div
											class="inputgroup flex flex-wrap items-start justify-start lg:items-center"
										>
											<div class="label font-semibold w-full text-lg">Product description</div>
											<div class="review-wrap border border-black rounded-md mb-4 w-full">
												<div
													class="text-i-combo flex font-semibold items-center justify-start text-COLORGRY"
												>
													<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
													Type in a description
													
												</div> <div class="pdsc_wrp overflow-auto ">
												<textarea
													name="description"
													class="text-md font-light text-COLORBLE h-full w-full px-2 py-1 mx-6 bg-transparent focus:outline-none"
													rows="6"
													placeholder="Product description goes here. Add as many words as you'd like. Note each word will be counted as a keyword. So be specific, and descriptive at the same time. Products are indexed every {config[
														'server'
													]['indexing-interval']}"
													value={data ? data.description : ''}
												/></div>
											</div>
										</div>
									</div>
									<div class="text-2xl font-semibold">General Settings</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Slug</div>
										<TextInput
											icon={faSign}
											name="slug"
											placeholder="Enter a slug (e.g. coca-cola-canned)"
											custom_style="bg-transparent"
											value={data ? data.slug : ''}
										/>
									</div>

									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Product name</div>
										<TextInput
											icon={faSortAlphaAsc}
											name="name"
											placeholder="Enter a product name (e.g. 'Coca Cola (Canned)')"
											custom_style="bg-transparent"
											value={data ? data.productName : ''}
										/>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Listed price</div>
										<TextInput
											icon={faTag}
											name="price"
											placeholder="Enter a price (e.g. 10.75)"
											custom_style="bg-transparent"
											value={data ? data.price? data.price.$numberDecimal : '' : ''}
										/>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">In stock</div>
										<TextInput
											icon={faBox}
											name="in_stock"
											placeholder="How many of this item are available (e.g. 35)"
											custom_style="bg-transparent"
											value={data ? data.in_stock : ''}
										/>
									</div>
									<div class="inputgroup flex flex-wrap items-start justify-start lg:items-center">
										<div class="label font-semibold w-full text-lg">Category</div>
										<Select
											icon={faList}
											name="category"
											placeholder="Select a category"
											value={data ? data.category._id : 'placeholder'}
											custom_style="bg-transparent border border-COLORBLK"
											options={categories}
										/>
									</div>
									<button class="btn_wrp w-fit h-fit" type="submit">
										<Button
											icon={faCog}
											color="COLORBLK"
											color_t="COLORWHT1"
											text={product_id ? 'Apply changes' : 'Create category'}
											custom_style="my-2"
										/>
									</button>
								
							</div>
				
						</div>{/each}{/if}{/if}
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

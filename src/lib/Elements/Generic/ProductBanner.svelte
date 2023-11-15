<script lang="ts">
	import { faCartPlus, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

	import { goto } from '$app/navigation';
	import config from '$lib/config/settings.json';
	import type { Product } from '$lib/types/Product';
	import IconButton from './IconButton.svelte';
	import StarCount from './StarCount.svelte';
	import { addToCart } from '../Utility/Cart';
	let productImage: string;
	let productId: string;
	let productName: string;
	let productDescription: string;
	let productPrice: string;
	let productSlug: string;
	export let reviews: Product['reviews'][] | [] = [];
	export { productImage as image };
	export { productId as id };
	export { productName as name };
	export { productDescription as description };
	export { productPrice as price };
	export { productSlug as slug };
</script>

<div class="bg-COLORWHT2 flex w-full">
	<div class="flex-none w-2/5 h-96">
		<img
			src={productImage || config['product-view']['default-image']}
			alt={productName}
			class="h-full w-full lg:w-full lg:h-full object-cover"
			on:error={() => {
				productImage = config['product-view']['default-image'];
			}}
			on:load={() => {
				console.log('Image loaded successfully');
			}}
		/>
	</div>
	<div class="relative ml-4 p-2 lg:p-10">
		<h2 class="text-2xl lg:text-6xl font-semibold text-gray-700">{productName}</h2>
		<StarCount {reviews} />
		<p class="mt-2 text-gray-600 font-light text-xl lg:text-4xl">
			{productDescription.length > 100
				? `${productDescription.slice(0, 100)}...`
				: productDescription}
		</p>
		<p class="mb-16 py-2 text-gray-600 font-bold text-lg lg:text-2xl">
			{parseFloat(productPrice).toLocaleString("en-US", {style: "currency", currency: config["checkout"]["currency"], minimumFractionDigits: 2})}
		</p>
		<div class="flex items-center">
			<div class="comboBox flex flex-wrap absolute bottom-2 lg:bottom-6">
				<div
					class="details font-semibold bg-COLORRED text-COLORWHT1 button w-fit flex rounded-sm hover:bg-opacity-80 cursor-pointer px-12 py-4 items-center text-md select-none mr-2"
					on:click={() => {
						// @ts-ignore
						goto(`/product/${productSlug}`);
					}}
					role="link"
				>
					Details
				</div>

				<div class="addToCart" on:click={() => addToCart(productId, 1)}>
					<IconButton icon={faCartPlus} color="COLORYLW" />
				</div>

				<!-- <IconButton icon={faHeart} color="COLORRED" class="hidden lg:flex px-5" /> -->
			</div>
		</div>
	</div>
</div>

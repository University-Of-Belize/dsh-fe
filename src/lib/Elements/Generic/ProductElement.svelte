<script lang="ts">
	import { faCartPlus, faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

	import { goto } from '$app/navigation';
	import config from '$lib/config/settings.json';
	import IconButton from './IconButton.svelte';
	import { addToCart } from '../Utility/Cart';
	let productImage: string;
	let productId: string;
	let productName: string;
	let productDescription: string;
	let productPrice: string;
	let productSlug: string;
	export { productImage as image };
	export { productId as id };
	export { productName as name };
	export { productDescription as description };
	export { productPrice as price };
	export { productSlug as slug };
</script>

<div class="bg-white rounded-lg shadow-lg p-4 m-4 flex max-w-lg">
	<div class="flex-none">
		<img
			src={productImage || config['product-view']['default-image']}
			alt={productName}
			class="w-48 h-48 object-cover rounded-lg"
			on:error={() => {
				productImage = config['product-view']['default-image'];
			}}
			on:load={() => {
				console.log('Image loaded successfully');
			}}
		/>
	</div>
	<div class="relative flex-grow ml-4">
		<h2 class="text-lg font-semibold text-gray-700">{productName}</h2>
		<p class="mt-2 text-gray-600 font-light">
			{productDescription.length > 100
				? `${productDescription.slice(0, 100)}...`
				: productDescription}
		</p>
		<p class="mb-16 text-gray-600 font-bold">
			${parseFloat(productPrice).toFixed(2)}BZD
		</p>
		<div class="comboBox flex flex-wrap absolute bottom-1 h-9">
			<div
				class="details font-semibold bg-COLORRED text-COLORWHT1 button w-fit flex rounded-sm hover:bg-opacity-80 cursor-pointer px-4 py-2 items-center text-sm select-none mr-2"
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
			<!-- <IconButton icon={faHeart} color="COLORRED" class="hidden lg:flex"/> -->
		</div>
	</div>
</div>

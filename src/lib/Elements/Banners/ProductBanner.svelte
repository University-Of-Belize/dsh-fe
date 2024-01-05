<script lang="ts">
	import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

	import { goto } from '$app/navigation';
	import config from '$lib/config/settings';
	import type { Product } from '$lib/types/Product';
	import { addToCart } from '../../Utility/Cart';
	import IconButton from '../Buttons/IconButton.svelte';
	import StarCount from '../StarCount.svelte';
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

<div class="flex w-full bg-COLORWHT2">
	<div class="h-96 w-2/5 flex-none">
		<img
			src={productImage || config['product-view']['default-image']}
			alt={productName}
			class="h-full w-full object-cover lg:h-full lg:w-full"
			on:error={() => {
				productImage = config['product-view']['default-image'];
			}}
		/>
	</div>
	<div class="relative ml-4 p-2 lg:p-10">
		<h2 class="text-2xl font-semibold text-gray-700 lg:text-6xl">{productName}</h2>
		<StarCount {reviews} />
		<p class="mt-2 text-xl font-light text-gray-600 lg:text-4xl">
			{productDescription.length > 100
				? `${productDescription.slice(0, 100)}...`
				: productDescription}
		</p>
		<p class="mb-16 py-2 text-lg font-bold text-gray-600 lg:text-2xl">
			{parseFloat(productPrice).toLocaleString('en-US', {
				style: 'currency',
				currency: config['checkout']['currency'],
				minimumFractionDigits: 2
			})}
		</p>
		<div class="flex items-center">
			<div class="comboBox absolute bottom-2 flex flex-wrap lg:bottom-6">
				<div
					class="details button text-md mr-2 flex w-fit cursor-pointer select-none items-center rounded-sm bg-COLORRED px-12 py-4 font-semibold text-COLORWHT hover:bg-opacity-80"
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

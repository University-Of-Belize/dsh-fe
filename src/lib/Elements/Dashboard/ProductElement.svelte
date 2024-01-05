<script lang="ts">
	import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

	import { goto } from '$app/navigation';
	import config from '$lib/config/settings';
	import { addToCart } from '../Utility/Cart';
	import IconButton from '../Buttons/IconButton.svelte';
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

<div
	class="lg:500px m-4 flex w-full flex-wrap rounded-lg bg-COLORBLK1 p-4 shadow-lg lg:flex-nowrap"
>
	<div class="w-full flex-none md:w-auto">
		<img
			src={productImage || config['product-view']['default-image']}
			alt={productName}
			class="h-48 w-full rounded-lg object-cover lg:w-48"
			on:error={() => {
				productImage = config['product-view']['default-image'];
			}}
		/>
	</div>
	<div class="relative ml-4 flex-grow pt-8 md:pt-2 lg:p-0">
		<h2 class="text-lg font-semibold text-COLORWHT">{productName}</h2>
		<p class="mt-2 font-light text-COLORWHT4">
			{productDescription.length > 100
				? `${productDescription.slice(0, 100)}...`
				: productDescription}
		</p>
		<p class="mb-16 font-bold text-COLORWHT1">
			{parseFloat(productPrice).toLocaleString('en-US', {
				style: 'currency',
				currency: config['checkout']['currency'],
				minimumFractionDigits: 2
			})}
		</p>
		<div class="comboBox absolute bottom-1 flex h-9 flex-wrap">
			<div
				class="details button mr-2 flex w-fit cursor-pointer select-none items-center rounded-sm bg-COLORRED px-4 py-2 text-sm font-semibold text-COLORWHT hover:bg-opacity-80"
				on:click={() => {
					// @ts-ignore
					goto(`/product/${productSlug}`);
				}}
				role="link"
			>
				Details
			</div>
			<div class="addToCart" on:click={() => addToCart(productId, 1)}>
				<IconButton icon={faCartPlus} color="COLORBLE" color_t="COLORWHT" />
			</div>
			<!-- <IconButton icon={faHeart} color="COLORRED" class="hidden lg:flex"/> -->
		</div>
	</div>
</div>

<style>
	@media (min-width: 1024px) {
		.lg\:500px {
			width: 500px;
		}
	}
</style>

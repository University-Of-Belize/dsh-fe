<script lang="ts">
	import { goto } from '$app/navigation';
	import config from '$lib/config/settings';
	import { faShoppingCart, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { addToCart } from '../Utility/Cart';
	let productImage: string;
	let productId: string;
	let productName: string;
	let productDescription: string;
	let productPrice: string;
	let productSlug: string;
	let productUnavailable: boolean;
	let added_to_cart: boolean = false;
	export { productImage as image };
	export { productId as id };
	export { productName as name };
	export { productDescription as description };
	export { productPrice as price };
	export { productSlug as slug };
	export { productUnavailable as out_of_stock };
</script>

<div class="mt-4 w-full max-w-sm rounded-lg border border-COLORHPK bg-COLORBLK1">
	<a href="/product/{productSlug}">
		<img
			loading="lazy"
			class="mb-4 h-60 w-full rounded-t-lg object-cover"
			on:click={() => {
				// @ts-ignore
				goto(`/product/${productSlug}`);
			}}
			src={productImage || config['product-view']['default-image']}
			alt={productName}
			on:error={() => {
				productImage = config['product-view']['default-image'];
			}}
		/>
	</a>
	<div class="px-5 py-1 pb-5 text-COLORWHT">
		<a href="/product/{productSlug}">
			<span class="stub strikethrough hidden" />
			<h5
				class="w-fit text-xl font-semibold tracking-tight hover:underline {productUnavailable
					? 'line-through'
					: ''}"
			>
				{productName}
			</h5>
			{@html productUnavailable ? `<span class="text-COLORHPK">OUT OF STOCK</span>` : ''}
		</a>
		<div
			class="mt-2 block items-center justify-start space-y-6 lg:flex lg:flex-wrap lg:justify-between lg:space-y-0"
		>
			<span class="text-3xl font-bold"
				>{parseFloat(productPrice).toLocaleString('en-US', {
					style: 'currency',
					currency: config['checkout']['currency'],
					minimumFractionDigits: 2
				})}</span
			>
			<a
				href="#queue-product"
				on:click={() => {
					addToCart(productId, 1);
					added_to_cart = true;
				}}
				class="flex items-center justify-center space-x-2 rounded-lg transition-all {added_to_cart
					? 'bg-green-700'
					: 'bg-blue-700'} px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				<Fa icon={added_to_cart ? faCheckDouble : faShoppingCart} />
				<div>{added_to_cart ? 'Added to cart' : 'Add to cart'}</div></a
			>
		</div>
	</div>
</div>

<!-- <div
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
		<p class="mt-2 font-light text-COLORWHT3">
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
				class="details button mr-2 flex w-fit cursor-pointer select-none items-center rounded-sm bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-opacity-80"
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
			<-- <IconButton icon={faHeart} color="COLORRED" class="hidden lg:flex"/> ->
		</div>
	</div>
</div>

<style>
	@media (min-width: 1024px) {
		.lg\:500px {
			width: 500px;
		}
	}
</style> -->

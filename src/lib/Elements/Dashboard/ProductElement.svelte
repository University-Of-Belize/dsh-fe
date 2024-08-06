<script lang="ts">
	import config from '$lib/config/index';
	import Button from '../Buttons/Button.svelte';
	import { addToCart } from '../Utility/Cart';
	let productImage: string;
	let productId: string;
	let productName: string;
	let productDescription: string;
	let productPrice: string;
	let productSlug: string;
	let productUnavailable: boolean;
	let added_to_cart: boolean = false;
	let clicked_times: number = 0;
	let debounceTimeout: number;
	export { productImage as image };
	export { productId as id };
	export { productName as name };
	export { productDescription as description };
	export { productPrice as price };
	export { productSlug as slug };
	export { productUnavailable as out_of_stock };

	let product = {
		_id: productId,
		category: {
			name: 'Unavailable'
		},
		description: productDescription,
		price: {
			$numberDecimal: productPrice
		},
		productName,
		slug: productSlug
	};

	const price = parseFloat(productPrice).toLocaleString('en-US', {
		style: 'currency',
		currency: config['checkout']['currency'],
		minimumFractionDigits: 2
	});
</script>

<div
	class="item flex flex-col gap-4 overflow-hidden py-4 text-COLORLIGHT-100 transition-all ease-in-out lg:p-10"
>
	<div
		class="imageHolder flex w-full items-center justify-center overflow-hidden rounded-md bg-COLORACCENTL object-cover"
		style="height: 200px"
	>
		<a aria-label="Visit the '{productName}'" href="/product/{productSlug}">
			<img
				loading="lazy"
				class="duration-200 hover:scale-95"
				src={productImage || config['product-view']['default-image']}
				alt="Picture showing the item '{productName}'"
				width="100%"
				on:error={() => {
					productImage = config['product-view']['default-image'];
				}}
			/></a
		>
	</div>
	<div class="itemName flex items-center justify-between gap-4">
		<a href="/product/{productSlug}"
			><h3 class="font-medium {productUnavailable ? 'line-through' : ''}">{productName}</h3></a
		>
		<span class="font-bold">{price}</span>
	</div>
	<div class="itemDesc text-sm">
		<p>
			{productDescription.length >= 75
				? productDescription.substring(0, 75) + '...'
				: productDescription}
		</p>
	</div>
	{@html productUnavailable ? `<span class="text-COLORACCENTL text-sm">OUT OF STOCK</span>` : ''}

	<div class="itemButton">
		<Button
			custom_style="w-full items-center text-center justify-center"
			on:click={() => {
				addToCart(product, productId, 1, []);
				clearTimeout(debounceTimeout);
				debounceTimeout = setTimeout(async () => {
					added_to_cart = true;
					clicked_times += 1;
				}, 500);
			}}
			text={added_to_cart
				? `Added to cart ${clicked_times > 1 ? `(${clicked_times})` : ''}`
				: `Add to cart — ${price}`}
		/>
	</div>
</div>
<!-- 
<div class="mt-4 w-full max-w-sm rounded-lg border border-COLORACCENTL bg-COLORDARK-75">
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
	<div class="px-5 py-1 pb-5 text-COLORLIGHT-100">
		<a href="/product/{productSlug}">
			<span class="stub strikethrough hidden" />
			<h5
				class="w-fit text-xl font-semibold tracking-tight hover:underline {productUnavailable
					? 'line-through'
					: ''}"
			>
				{productName}
			</h5>
			{@html productUnavailable ? `<span class="text-COLORACCENTL">OUT OF STOCK</span>` : ''}
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
					addToCart(product, productId, 1, []);
					clearTimeout(debounceTimeout);
					debounceTimeout = setTimeout(async () => {
						added_to_cart = true;
						clicked_times += 1;
					}, 500);
				}}
				class="flex items-center justify-center space-x-2 rounded-lg transition-all {added_to_cart
					? 'bg-green-700'
					: 'bg-blue-700'} px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
				<Fa icon={added_to_cart ? faCheckDouble : faShoppingCart} />
				<div>
					{added_to_cart
						? `Added to cart ${clicked_times > 1 ? `(${clicked_times})` : ''}`
						: 'Add to cart'}
				</div></a
			>
		</div>
	</div>
</div>

<div
	class="lg:500px m-4 flex w-full flex-wrap rounded-lg bg-COLORDARK-75 p-4 shadow-lg lg:flex-nowrap"
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
		<h2 class="text-lg font-semibold text-COLORLIGHT-100">{productName}</h2>
		<p class="mt-2 font-light text-COLORLIGHT-50">
			{productDescription.length > 100
				? `${productDescription.slice(0, 100)}...`
				: productDescription}
		</p>
		<p class="mb-16 font-bold text-COLORLIGHT-15">
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
				<IconButton icon={faCartPlus} color="COLORACCENTD" color_t="COLORLIGHT-100" />
			</div>
			<IconButton icon={faHeart} color="COLORACCENTL" class="hidden lg:flex"/> 
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

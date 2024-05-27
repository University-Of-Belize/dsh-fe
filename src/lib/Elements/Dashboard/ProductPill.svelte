<script lang="ts">
	import { goto } from '$app/navigation';
	import config from '$lib/config/settings';
	import type { Product } from '$lib/types/Product';
	import { faPencil } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let product: Product;
	export let tag: boolean = false;
	export let tagColor: string = 'COLORWHT';
	export let tagColor_t: string = 'COLORBLK';
	export let tagText: string = '';
	export let description: string;
	export let image: string | undefined;
	export let widget: boolean = true;
	export let displayPrice: boolean = false;
	let pimg: HTMLImageElement;
</script>

<!-- Color stub -->
<div
	class="placeholder hidden w-full bg-COLORBYW bg-COLORPNK bg-COLORRED bg-COLORWHT bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORYLW"
>
	&nbsp;
</div>

<div class="product-wrp relative">
	{#if widget}
		<div
			style="top: -23%; right: -1%;"
			class="widget-wrp absolute flex w-full items-center justify-end"
		>
			<div
				on:click={() => goto(`/admin/dashboard/product/manage?product_id=${product._id}`)}
				class="widget w-fit cursor-pointer rounded-md bg-COLORBLE px-2 py-2 text-COLORWHT shadow-md hover:opacity-80"
			>
				<Fa icon={faPencil} size="0.85x" />
			</div>
		</div>{/if}
	<div class="product my-4 rounded-md bg-COLORBLK4 bg-opacity-50 px-4 py-2">
		<div class="flex bg-opacity-100">
			<div class="product-pfp flex flex-col items-center justify-start pr-4">
				<img
					bind:this={pimg}
					loading="lazy"
					class="rounded-md object-cover"
					src={image ?? product.image
						? product.image.trim() === ''
							? config['product-showcase']['default-image']
							: product.image
						: config['product-showcase']['default-image']}
					alt={product.productName}
					on:error={() => {
						pimg.src = config['product-showcase']['default-image'];
					}}
					style="width: 50px; height: 50px;"
				/>
			</div>
			<div class="user-wrap flex w-full flex-wrap items-center">
				<div class="product-content text-COLORWHT" style="word-break: break-word;">
					<div class="flex items-center space-x-2 text-base font-semibold lg:text-lg">
						<div>{product.productName ?? 'Untitled Product'}</div>
						{#if displayPrice}
							<div>({parseFloat(product.price.$numberDecimal).toFixed(2) ?? ''})</div>
						{/if}
						{#if tag}
							<div
								class="tag px-4 py-1 bg-{tagColor} text-{tagColor_t} mx-4 flex items-center justify-center font-light lg:text-sm"
							>
								{tagText}
							</div>
						{/if}
					</div>
					<div class="text-md font-light text-COLORWHT1">
						{@html description}
					</div>
				</div>
				<div class="actions flex flex-1 items-center justify-start text-COLORWHT lg:justify-end">
					<slot />
				</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { goto } from '$app/navigation';
	import config from '$lib/config/settings';
	import type { Product } from '$lib/types/Product';
	import { faPencil } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let product: Product;
	export let tag: boolean = false;
	export let tagColor: string = 'COLORWHT';
	export let tagColor_t: string = 'COLORWHT';
	export let tagText: string = '';
	export let description: string;
	export let image: string | undefined;
	export let widget: boolean = true;
	let pimg: HTMLImageElement;
</script>

<!-- Color stub -->
<div
	class="placeholder bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT bg-COLORYLW bg-COLORBYW bg-COLORPNK bg-COLORRED hidden w-full"
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
				class="widget shadow-md cursor-pointer hover:opacity-80 bg-COLORBLE px-2 py-2 text-COLORWHT w-fit rounded-md"
			>
				<Fa icon={faPencil} size="0.85x" />
			</div>
		</div>{/if}
	<div class="product my-4 bg-COLORBLK4 bg-opacity-50 px-4 py-2 rounded-md">
		<div class="flex bg-opacity-100">
			<div class="product-pfp flex flex-col items-center justify-start pr-4">
				<img
					bind:this={pimg}
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
			<div class="user-wrap flex flex-wrap items-center w-full">
				<div class="product-content text-COLORWHT" style="word-break: break-word;">
					<div class="text-base lg:text-lg font-semibold flex items-center">
						{product.productName ?? 'Untitled Product'}
						{#if tag}
							<div
								class="tag px-4 py-1 bg-{tagColor} text-{tagColor_t} mx-4 font-light lg:text-sm flex items-center justify-center"
							>
								{tagText}
							</div>
						{/if}
					</div>
					<div class="text-md font-light text-COLORBLE">
						{@html description}
					</div>
				</div>
				<div class="actions flex items-center justify-start lg:justify-end flex-1 text-COLORWHT">
					<slot />
				</div>
			</div>
		</div>
	</div>
</div>

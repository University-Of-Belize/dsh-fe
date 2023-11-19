<script lang="ts">
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	import { faSortAlphaAsc } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let category: Category;
	export let description: string;
	let cImage: HTMLImageElement;
</script>

<!-- Color stub -->
<div
	class="placeholder bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORBLK bg-COLORYLW bg-COLORBYW bg-COLORPNK bg-COLORRED hidden w-full"
>
	&nbsp;
</div>

<div class="review my-4 bg-COLORWHT3 bg-opacity-50 px-4 py-2 rounded-md">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<img
				class="rounded-md w-12 h-12 object-cover"
				bind:this={cImage}
				src={category.image ?? config['product-view']['default-image']}
				alt=""
				on:error={(cImage.src = config['product-view']['default-image'])}
			/>
		</div>
		<div class="user-wrap flex flex-wrap items-center w-full">
			<div class="review-content text-COLORBLK" style="word-break: break-word;">
				<div class="text-base lg:text-lg font-semibold flex items-center">
					{category.name ? category.name : 'Untitled Category'}
				</div>
				<div class="text-md font-light text-COLORBLE">
					{@html description}
				</div>
			</div>
			<div class="actions flex items-center justify-start lg:justify-end flex-1 text-COLORBLK">
				<slot />
			</div>
		</div>
	</div>
	<slot name="alias" />
</div>

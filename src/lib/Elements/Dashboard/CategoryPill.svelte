<script lang="ts">
	import config from '$lib/config/settings';
	import type { Category } from '$lib/types/Category';
	export let category: Category;
	export let description: string;
	let cImage: HTMLImageElement;
</script>

<!-- Color stub -->
<div
	class="placeholder hidden w-full bg-COLORACCENTL bg-COLORACCENTL bg-COLORACCENTL bg-COLORLIGHT-100 bg-COLORLIGHT-100 bg-COLORWHT2 bg-COLORLIGHT-50 bg-COLORACCENTL"
>
	&nbsp;
</div>

<div class="review my-4 rounded-md bg-COLORDARK-75 bg-opacity-50 px-4 py-2">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<img
				class="h-12 w-12 rounded-md object-cover"
				loading="lazy"
				bind:this={cImage}
				src={category.image
					? category.image.trim() === ''
						? config['product-view']['default-image']
						: category.image
					: config['product-view']['default-image']}
				alt=""
				on:error={() => (cImage.src = config['product-view']['default-image'])}
			/>
		</div>
		<div class="user-wrap flex w-full flex-wrap items-center">
			<div class="review-content text-COLORLIGHT-100" style="word-break: break-word;">
				<div class="flex items-center text-base font-semibold lg:text-lg">
					{category.name ? category.name : 'Untitled Category'}
				</div>
				<div class="text-md font-light text-COLORLIGHT-15">
					{@html description}
				</div>
			</div>
			<div class="actions flex flex-1 items-center justify-start text-COLORLIGHT-100 lg:justify-end">
				<slot />
			</div>
		</div>
	</div>
	<slot name="alias" />
</div>

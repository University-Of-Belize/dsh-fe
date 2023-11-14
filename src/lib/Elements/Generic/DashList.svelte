<script lang="ts">
	import {
		faHamburger,
		faList,
		faMessage,
		faPlus,
		faTag,
		faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import Button from './Button.svelte';
	import { goto } from '$app/navigation';

	export let staff = false;
</script>

<div class="section py-6 border-t border-black border-dashed border-opacity-5">
	<div class="title font-semibold pb-5">Server Configuration</div>
	<div class="three pt-1" on:click={() => goto('/admin/dashboard/user')}>
		<Button
			icon={faUserCog}
			color="COLORWHT3"
			text="User management"
			color_t="COLORBLK"
			custom_style="w-full font-semibold"
		/>
	</div>
	<div class="three pt-1" on:click={() => goto('/admin/dashboard/review')}>
		<Button
			icon={faMessage}
			color="COLORWHT3"
			text="Review management"
			color_t="COLORBLK"
			custom_style="w-full font-semibold"
		/>
	</div>
	{#if staff}
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/user/manage')}>
			<Button
				icon={faPlus}
				color="transparent"
				text="Create a new user"
				color_t="COLORBLK"
				custom_style="w-full font-semibold"
			/>
		</div>{/if}
</div>
<div class="section py-6 border-t border-black border-dashed border-opacity-5">
	<div class="title font-semibold pb-5">Order Management</div>
	<div class="three pt-1" on:click={() => goto('/admin/dashboard/order')}>
		<Button
			icon={faList}
			color="COLORWHT3"
			text="What's queued?"
			color_t="COLORBLK"
			custom_style="w-full font-semibold"
		/>
	</div>
</div>
{#if staff}
	<div class="section py-6 border-t border-black border-dashed border-opacity-5">
		<div class="title font-semibold pb-5">Product Management</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/category')}>
			<Button
				icon={faPlus}
				color="COLORWHT3"
				text="Category management"
				color_t="COLORBLK"
				custom_style="w-full font-semibold"
			/>
		</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/product')}>
			<Button
				icon={faHamburger}
				color="COLORWHT3"
				text="Product management"
				color_t="COLORBLK"
				custom_style="w-full font-semibold"
			/>
		</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/promo')}>
			<Button
				icon={faTag}
				color="COLORWHT3"
				text="Promo code management"
				color_t="COLORBLK"
				custom_style="w-full font-semibold"
			/>
		</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/category/manage')}>
			<Button
				icon={faPlus}
				color="transparent"
				text="Start a new category"
				color_t="COLORBLK"
				custom_style="w-full font-semibold"
			/>
		</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/promo/manage')}>
			<Button
				icon={faPlus}
				color="transparent"
				text="Start a new promo code"
				color_t="COLORBLK"
				custom_style="w-full font-semibold"
			/>
		</div>
	</div>{/if}

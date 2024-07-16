<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		faClone,
		faCog,
		faFeed,
		faHamburger,
		faMessage,
		faTicket,
		faNoteSticky,
		faPlus,
		faTag,
		faUserCog,
		faVial,
		faBagShopping
	} from '@fortawesome/free-solid-svg-icons';
	import Button from '../Buttons/Button.svelte';

	export let staff = false;
</script>

<div class="dashList bg-opacity-100 pb-40">
	<div class="section bg-opacity-100 py-6">
		<div class="title pb-5 font-semibold">My Account</div>
		<div class="three pt-1">
			<div
				on:click={async () => {
					await goto(`/admin/dashboard/user/manage2?user_id=${localStorage.user_id}`);
				}}
			>
				<Button
					icon={faCog}
					color="COLORBLK3"
					text="My account settings"
					color_t="COLORWHT"
					custom_style="w-full"
					rounding="md"
				/>
			</div>
		</div>
		<div class="three pt-1">
			<div
				on:click={async () => {
					await goto('/admin/dashboard/user/experiments');
				}}
			>
				<Button
					icon={faVial}
					color="COLORBLK3"
					text="Experiments"
					color_t="COLORWHT"
					custom_style="w-full"
					rounding="md"
				/>
			</div>
		</div>
	</div>
	<div class="section border-t border-dashed border-COLORBLK1 border-opacity-5 py-6">
		<div class="title pb-5 font-semibold">{staff ? 'Customer Insights' : 'Your Feedback'}</div>
		{#if staff}
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/user')}>
				<Button
					icon={faUserCog}
					color="COLORBLK3"
					text="User management"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
		{/if}
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/review')}>
			<Button
				icon={faMessage}
				color="COLORBLK3"
				text="Review management"
				color_t="COLORWHT"
				custom_style="w-full font-medium"
				rounding="md"
			/>
		</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/feedback')}>
			<Button
				icon={faFeed}
				color="COLORBLK3"
				text="Feedback hub"
				color_t="COLORWHT"
				custom_style="w-full font-medium"
				rounding="md"
			/>
		</div>
		{#if staff}
			<!-- Workaround since Manage2 bugs out -->
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/user/manage')}>
				<Button
					icon={faPlus}
					color="transparent"
					text="Create a new user"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>{/if}
	</div>
	<div class="section border-t border-dashed border-COLORBLK1 border-opacity-5 py-6">
		<div class="title pb-5 font-semibold">Messaging</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/messaging')}>
			<Button
				icon={faMessage}
				color="COLORBLK3"
				text="Message a user"
				color_t="COLORWHT"
				custom_style="w-full font-medium"
				rounding="md"
			/>
		</div>
	</div>
	{#if staff}
		<div class="section border-t border-dashed border-COLORBLK1 border-opacity-5 py-6">
			<div class="title pb-5 font-semibold">Receipts</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/receipts')}>
				<Button
					icon={faTicket}
					color="COLORBLK3"
					text="View receipts"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
		</div>
		<div class="section border-t border-dashed border-COLORBLK1 border-opacity-5 py-6">
			<div class="title pb-5 font-semibold">Credit Refill</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/refill')}>
				<Button
					icon={faBagShopping}
					color="COLORBLK3"
					text="Refill an account"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
		</div>
		<div class="section border-t border-dashed border-COLORBLK1 border-opacity-5 py-6">
			<div class="title pb-5 font-semibold">Announcements</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/new-article')}>
				<Button
					icon={faNoteSticky}
					color="COLORBLK3"
					text="Write a new article"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
		</div>
	{/if}
	<div class="section border-t border-dashed border-COLORBLK1 border-opacity-5 py-6">
		<div class="title pb-5 font-semibold">Order Management</div>
		<div class="three pt-1" on:click={() => goto('/admin/dashboard/order')}>
			<Button
				icon={faClone}
				color="COLORBLK3"
				text="What's queued?"
				color_t="COLORWHT"
				custom_style="w-full font-medium"
				rounding="md"
			/>
		</div>
	</div>
	{#if staff}
		<div class="section border-t border-dashed border-COLORBLK1 border-opacity-5 py-6">
			<div class="title pb-5 font-semibold">Product Management</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/category')}>
				<Button
					icon={faPlus}
					color="COLORBLK3"
					text="Category management"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/product')}>
				<Button
					icon={faHamburger}
					color="COLORBLK3"
					text="Product management"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/promo')}>
				<Button
					icon={faTag}
					color="COLORBLK3"
					text="Promo code management"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/category/manage')}>
				<Button
					icon={faPlus}
					color="transparent"
					text="Start a new category"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div class="three pt-1" on:click={() => goto('/admin/dashboard/promo/manage')}>
				<Button
					icon={faPlus}
					color="transparent"
					text="Start a new promo code"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
		</div>{/if}
</div>

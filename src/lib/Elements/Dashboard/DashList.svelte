<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		faBagShopping,
		faClone,
		faCog,
		faFeed,
		faHamburger,
		faMessage,
		faNoteSticky,
		faPlus,
		faTag,
		faTicket,
		faUserCog,
		faVial
	} from '@fortawesome/free-solid-svg-icons';
	import Button from '../Buttons/Button.svelte';

	export let staff = false;
</script>

<div class="dashList bg-opacity-100 pb-40">
	<div class="section bg-opacity-100 py-6">
		<div class="title pb-5 font-semibold">My Account</div>
		<div class="three pt-1">
			<div id="my_account"
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
			<div id="app_experiments"
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
			<div id="user_management" class="three pt-1" on:click={() => goto('/admin/dashboard/user')}>
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
		<div id="review_management" class="three pt-1" on:click={() => goto('/admin/dashboard/review')}>
			<Button
				icon={faMessage}
				color="COLORBLK3"
				text="Review management"
				color_t="COLORWHT"
				custom_style="w-full font-medium"
				rounding="md"
			/>
		</div>
		<div id="feedback_hub" class="three pt-1" on:click={() => goto('/admin/dashboard/feedback')}>
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
			<div id="new_user" class="three pt-1" on:click={() => goto('/admin/dashboard/user/manage')}>
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
		<div id="message_user" class="three pt-1" on:click={() => goto('/admin/dashboard/messaging')}>
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
			<div id="view_receipts" class="three pt-1" on:click={() => goto('/admin/dashboard/receipts')}>
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
			<div id="refill_account" class="three pt-1" on:click={() => goto('/admin/dashboard/refill')}>
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
			<div id="help_articles" class="three pt-1" on:click={() => goto('/admin/dashboard/new-article')}>
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
		<div id="open_orders" class="three pt-1" on:click={() => goto('/admin/dashboard/order')}>
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
			<div id="category_management" class="three pt-1" on:click={() => goto('/admin/dashboard/category')}>
				<Button
					icon={faPlus}
					color="COLORBLK3"
					text="Category management"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div id="product_management" class="three pt-1" on:click={() => goto('/admin/dashboard/product')}>
				<Button
					icon={faHamburger}
					color="COLORBLK3"
					text="Product management"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div id="promo_management" class="three pt-1" on:click={() => goto('/admin/dashboard/promo')}>
				<Button
					icon={faTag}
					color="COLORBLK3"
					text="Voucher code management"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div id="new_category" class="three pt-1" on:click={() => goto('/admin/dashboard/category/manage')}>
				<Button
					icon={faPlus}
					color="transparent"
					text="Start a new category"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
			<div id="new_promo" class="three pt-1" on:click={() => goto('/admin/dashboard/promo/manage')}>
				<Button
					icon={faPlus}
					color="transparent"
					text="Start a new voucher code"
					color_t="COLORWHT"
					custom_style="w-full font-medium"
					rounding="md"
				/>
			</div>
		</div>{/if}
</div>

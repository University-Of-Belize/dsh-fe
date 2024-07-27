<script lang="ts">
	export let icon: string = '/pixel.png';
	export let username: string = '';
	export let message: string = '';
	export let status: string = 'offline';
	export let notification: Boolean = false;
	export let size: number = 40;
	export let id: string;
	export let hidden: boolean = false;
</script>

<!---
			            @params 'icon' User Icon
					            'username' Username of who contacted you
					            'preview' Last message preview
					            'status' User status
					    @slotParams 'notification' Last message timestamp/amount of unread message count
					-->

<span class="stub invisible hidden"></span>
<div
	{id}
	class="{hidden
		? 'invisible'
		: ''} conversation my-2 flex w-full cursor-pointer select-none items-center rounded-md bg-COLORDARK-75 px-2 py-4 hover:bg-COLORDARK-50"
>
	<div class="icon-wrap hidden items-center text-left lg:flex">
		<div class="icon_wrap relative mr-4 rounded-full">
			<!-- CSS hack lol-->
			<img
				class="rounded-full object-cover"
				style={'height:' + size + 'px; width:' + size + 'px;'}
				src={icon}
				alt={username}
			/>
			{#if status == 'online'}
				<span
					class="border-primary absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 bg-green-400"
				>
					&nbsp;
				</span>
			{:else if status == 'offline'}
				<span
					class="border-primary absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 bg-yellow-400"
				>
					&nbsp;
				</span>
			{:else if status == 'DnD'}
				<span
					class="border-primary absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 bg-red-400"
				>
					&nbsp;
				</span>
			{:else}
				<span
					class="border-primary absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 bg-gray-400"
				>
					&nbsp;
				</span>
			{/if}
		</div>
	</div>
	<div class="details-block block flex-1 text-left text-base font-medium leading-4 text-COLORLIGHT-100">
		{username}
		<div class="mt-2 w-full text-xs font-normal text-COLORLIGHT-15 lg:mt-0">
			{message}
		</div>
	</div>
	{#if notification}
		<div class="message-notification mb-4 block h-full text-sm text-COLORLIGHT-100">
			<slot name="notification">slot=notification</slot>
		</div>
	{/if}
</div>

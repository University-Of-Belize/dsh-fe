<script lang="ts">
	import config from '$lib/config/settings';
	import type { User } from '$lib/types/User';
	export let user: User;
	export let tag: boolean = false;
	export let tagColor: string = 'COLORBLK';
	export let tagColor_t: string = 'COLORWHT';
	export let tagText: string = '';
	export let description: string;
</script>

<!-- Color stub -->
<div
	class="placeholder bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORBLK bg-COLORYLW bg-COLORBYW bg-COLORPNK bg-COLORRED hidden w-full"
>
	&nbsp;
</div>

<div class="review my-4 bg-COLORWHT3 bg-opacity-50 px-4 py-4 rounded-md">
	<div class="flex flex-wrap bg-opacity-100 space-y-4 lg:space-y-2">
		<div
			class="reviewer-pfp flex flex-row items-center justify-center lg:justify-start w-full lg:w-auto pr-4"
		>
			<img
				class="rounded-md w-64 h-64 lg:w-32 lg:h-32"
				src={user?.profile_picture || config['user']['default-image']}
				alt="{user?.username}'s avatar"
				on:error={() => {
					user.profile_picture = config['user']['default-image'];
				}}
			/>
		</div>
		<div
			class="user-wrap flex w-full lg:w-auto flex-wrap flex-col items-start"
			style="word-break: break-word;"
		>
			<div class="text-2xl lg:text-2xl w-full lg:w-auto font-semibold flex flex-wrap items-center">
				{user.username
					? user._id == localStorage.user_id
						? `${user?.username} (You)`
						: user?.username
					: 'Anonymous'}
				{#if tag}
					<div
						class="tag px-4 my-2 lg:my-0 py-1 bg-{tagColor} text-{tagColor_t} md:mx-4 font-light lg:text-sm flex items-center justify-center w-full lg:w-auto"
					>
						{tagText}
					</div>
				{/if}
			</div>
			<div class="hidden lg:block text-md font-light text-COLORBLE mt-4 mb-2 lg:m-0">
				{@html description}
			</div>
			<div class="actions flex items-center justify-start flex-1 text-COLORBLK w-full lg:w-auto">
				<slot />
			</div>
		</div>
	</div>
</div>

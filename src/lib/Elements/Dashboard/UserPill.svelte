<script lang="ts">
	import config from '$lib/config/settings';
	import type { User } from '$lib/types/User';
	export let user: User;
	export let tag: boolean = false;
	export let tagColor: string = 'COLORGRN2';
	export let tagColor_t: string = 'COLORWHT';
	export let tagText: string = '';
	export let description: string;
	export let html: boolean = false;
</script>

<!-- Color stub -->
<div
	class="placeholder hidden w-full bg-COLORBLE bg-COLORBLK bg-COLORBLK1 bg-COLORBLK2 bg-COLORBLK3 bg-COLORBLK4 bg-COLORBLK5 bg-COLORGRN bg-COLORGRN1 bg-COLORGRN2 bg-COLORPNK bg-COLORRED bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORYLW"
>
	&nbsp;
</div>

<div class="review my-4 rounded-md bg-COLORBLK4 bg-opacity-50 px-4 py-2">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<img
				class="rounded-md object-cover"
				loading="lazy"
				src={user?.profile_picture || config['user']['default-image']}
				alt="{user?.username}'s avatar"
				on:error={() => {
					user.profile_picture = config['user']['default-image'];
				}}
				style="width: 50px; height: 50px;"
			/>
		</div>
		<div class="user-wrap flex flex-wrap items-center lg:w-full">
			<div class="review-content text-COLORWHT" style="word-break: break-word;">
				<div class="flex items-center text-base font-semibold lg:text-lg">
					<a href="/app/space/{user._id}" class="hover:underline"
						><span
							>{user.username
								? user._id == localStorage.user_id
									? `${user?.username} (You)`
									: user?.username
								: 'Anonymous'}</span
						></a
					>
					{#if tag}
						<div
							class="tag px-4 py-1 bg-{tagColor} text-{tagColor_t} mx-4 flex items-center justify-center font-light lg:text-sm"
						>
							{tagText}
						</div>
					{/if}
				</div>
				<div class="text-md font-light text-COLORWHT1">
					{#if html}
						{@html description}
					{:else}
						{description}{/if}
				</div>
			</div>
			<div class="actions flex flex-1 items-center justify-start text-COLORWHT lg:justify-end">
				<slot />
			</div>
		</div>
	</div>
</div>

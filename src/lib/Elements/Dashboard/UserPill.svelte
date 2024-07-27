<script lang="ts">
	import config from '$lib/config/settings';
	import type { User } from '$lib/types/User';
	export let user: User;
	export let tag: boolean = false;
	export let tagColor: string = 'COLORACCENTD';
	export let tagColor_t: string = 'COLORLIGHT-100';
	export let tagText: string = '';
	export let description: string;
	export let html: boolean = false;
</script>

<!-- Color stub -->
<div
	class="placeholder hidden w-full bg-COLORACCENTD bg-COLORDARK-100 bg-COLORDARK-75 bg-COLORDARK-50 bg-COLORDARK-25 bg-COLORDARK-75 bg-COLORDARK-75 bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTL bg-COLORACCENTL bg-COLORLIGHT-100 bg-COLORWHT2 bg-COLORLIGHT-50 bg-COLORLIGHT-75 bg-COLORLIGHT-100 bg-COLORACCENTL"
>
	&nbsp;
</div>

<div class="review my-4 rounded-md bg-COLORDARK-75 bg-opacity-50 px-4 py-2">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<img
				class="hidden lg:block rounded-md object-cover"
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
			<div class="review-content text-COLORLIGHT-100" style="word-break: break-word;">
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
				<div class="text-md font-light text-COLORLIGHT-15">
					{#if html}
						{@html description}
					{:else}
						{description}{/if}
				</div>
			</div>
			<div class="actions flex flex-1 items-center justify-start text-COLORLIGHT-100 lg:justify-end">
				<slot />
			</div>
		</div>
	</div>
</div>

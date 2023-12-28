<script lang="ts">
	import config from '$lib/config/settings';
	import type { User } from '$lib/types/User';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faImage } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import Fa from 'svelte-fa';
	import { R2S3Upload } from '../Utility/vendor/dishout/r2_s3';
	export let user: User;
	export let tag: boolean = false;
	export let tagColor: string = 'COLORWHT';
	export let tagColor_t: string = 'COLORWHT';
	export let tagText: string = '';
	export let description: string;
	export let editProfilePicture = false;
	let photoValue: HTMLInputElement;
	let photoInput: HTMLInputElement;
	let userImage: HTMLImageElement;

	async function updateProfilePhoto(pub_url: string) {
		const r = (await fetchWebApi(
			'v1/admin/user/manage/profile_picture',
			'PUT',
			what_is(what.private.user, pub_url)
		)) as Response; // JS doesn't allow type declarations
		if (!r) return;
		if (!r.ok) {
			try {
				const res = await r.json();
				return toast.push(res.message);
			} catch (error) {
				return toast.push(`There was an issue while updating the profile photo: ${error.message}`);
			}
		}
		toast.push('Updated profile photo. It may take a while to show up around the site.');
		user.profile_picture = pub_url;
		localStorage.setItem('user', JSON.stringify(user)); // Update the user
	}
	export async function updateBannerPhoto(pub_url: string) {
		const r = (await fetchWebApi(
			'v1/admin/user/manage/banner_picture',
			'PUT',
			what_is(what.private.user, pub_url)
		)) as Response; // JS doesn't allow type declarations
		if (!r) return;
		if (!r.ok) {
			try {
				const res = await r.json();
				return toast.push(res.message);
			} catch (error) {
				return toast.push(`There was an issue while updating the banner photo: ${error.message}`);
			}
		}
		toast.push('Updated banner photo. It may take a while to show up around the site.');
		user.banner = pub_url;
		localStorage.setItem('user', JSON.stringify(user)); // Update the user
	}
</script>

<!-- Color stub -->
<div
	class="placeholder bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT bg-COLORYLW bg-COLORBYW bg-COLORPNK bg-COLORRED hidden w-full"
>
	&nbsp;
</div>

<div class="review bg-COLORBLK3 w-full bg-opacity-50 px-4 py-4 rounded-md z-10">
	<div class="flex flex-wrap bg-opacity-100 space-y-4 lg:space-y-2">
		<div
			class="reviewer-pfp flex flex-row items-center justify-start w-full lg:w-auto pr-4"
		>
			{#if editProfilePicture}
				<div
					class="pimg_wrp block bg-COLORBLE h-fit w-fit rounded-md"
					on:click={() => {
						photoInput.click();
					}}
				>
					<div class="pimg_wrp2 relative">
						<!-- Don't show the default input -->
						<input
							class="hidden"
							type="file"
							accept="image/*"
							bind:this={photoInput}
							on:change={async (e) => {
								toast.push('Uploading...');
								const pub_url = await R2S3Upload(e, 'profile_photos');
								await updateProfilePhoto(pub_url);
								photoValue.value = pub_url;
								userImage.src = pub_url;
							}}
						/>
						<input
							type="hidden"
							name="photoValue"
							class="photoValue"
							bind:this={photoValue}
							value={user ? user.profile_picture : undefined}
						/>
						<div
							style="top: -4%; right: -4%;"
							class="widget-wrp z-10 absolute flex w-full items-center justify-end"
						>
							<div
								class="widget shadow-md cursor-pointer hover:opacity-80 bg-COLORBLE px-2 py-2 text-COLORWHT w-fit rounded-md"
							>
								<Fa icon={faImage} size="0.85x" />
							</div>
						</div>
						<div
							class="profile-image relative block overflow-clip rounded-md hover:opacity-80 cursor-pointer"
						>
							<img
								class="rounded-md w-16 h-16 lg:w-32 lg:h-32"
								bind:this={userImage}
								src={user?.profile_picture || config['user']['default-image']}
								alt="{user?.username}'s avatar"
								on:error={() => {
									user.profile_picture = config['user']['default-image'];
								}}
							/>
						</div>
					</div>
				</div>
			{:else}
				<img
					class="rounded-md w-64 h-64 lg:w-32 lg:h-32"
					src={user?.profile_picture || config['user']['default-image']}
					alt="{user?.username}'s avatar"
					on:error={() => {
						user.profile_picture = config['user']['default-image'];
					}}
				/>
			{/if}
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
			<div class="actions flex items-center justify-start flex-1 text-COLORWHT w-full lg:w-auto">
				<slot />
			</div>
		</div>
	</div>
</div>

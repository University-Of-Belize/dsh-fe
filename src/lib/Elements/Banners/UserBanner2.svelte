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
	class="placeholder hidden w-full bg-COLORBYW bg-COLORPNK bg-COLORRED bg-COLORWHT bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORYLW"
>
	&nbsp;
</div>

<div class="review z-10 w-full rounded-md bg-COLORBLK3 bg-opacity-50 px-4 py-4">
	<div class="flex flex-wrap space-y-4 bg-opacity-100 lg:space-y-2">
		<div class="reviewer-pfp flex w-full flex-row items-center justify-start pr-4 lg:w-auto">
			{#if editProfilePicture}
				<div
					class="pimg_wrp block h-fit w-fit rounded-md bg-COLORBLE"
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
								const pub_url = await R2S3Upload(e, 'profile_photos', `${user?.id}`);
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
							class="widget-wrp absolute z-10 flex w-full items-center justify-end"
						>
							<div
								class="widget w-fit cursor-pointer rounded-md bg-COLORBLE px-2 py-2 text-COLORWHT shadow-md hover:opacity-80"
							>
								<Fa icon={faImage} size="0.85x" />
							</div>
						</div>
						<div
							class="profile-image relative block cursor-pointer overflow-clip rounded-md hover:opacity-80"
						>
							<img
								class="h-16 w-16 rounded-md object-cover lg:h-32 lg:w-32"
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
					class="h-16 w-16 rounded-md lg:h-32 lg:w-32"
					src={user?.profile_picture || config['user']['default-image']}
					alt="{user?.username}'s avatar"
					on:error={() => {
						user.profile_picture = config['user']['default-image'];
					}}
				/>
			{/if}
		</div>
		<div
			class="user-wrap flex w-full flex-col flex-wrap items-start lg:w-auto"
			style="word-break: break-word;"
		>
			<div class="flex w-full flex-wrap items-center text-2xl font-semibold lg:w-auto lg:text-2xl">
				{user.username
					? user._id == localStorage.user_id
						? `${user?.username} (You)`
						: user?.username
					: 'Anonymous'}
				{#if tag}
					<div
						class="tag my-2 px-4 py-1 lg:my-0 bg-{tagColor} text-{tagColor_t} flex w-full items-center justify-center font-light md:mx-4 lg:w-auto lg:text-sm"
					>
						{tagText}
					</div>
				{/if}
			</div>
			<div class="text-md mb-2 mt-4 hidden font-light text-COLORWHT1 lg:m-0 lg:block">
				{@html description}
			</div>
			<div class="actions flex w-full flex-1 items-center justify-start text-COLORWHT lg:w-auto">
				<slot />
			</div>
		</div>
	</div>
</div>

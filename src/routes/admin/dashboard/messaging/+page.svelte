<script lang="ts">
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import UserPill from '$lib/Elements/Dashboard/UserPill.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import CommentBox from '$lib/Elements/Inputs/CommentBox.svelte';
	import { createFeedback, deleteFeedback } from '$lib/Elements/Utility/Feedback';
	import config from '$lib/config/settings';
	import type { ServerMessage } from '$lib/types/Message';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
	import Editor from '@tinymce/tinymce-svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import SearchBar from '../../../../lib/Elements/Search/SearchBar.svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let interactions: ServerMessage[]; // Declare the data variable
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	let feedbackInput: CommentBox;
	let richTextInput: string;
	let prefersRichText = true;
	$: interactions; // List of interactions (ServerMessage[])

	async function catchAll() {
		const res = (await fetchWebApi('v1/user/messaging/interactions', 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		interactions = r.is; // Rizz
		// console.log(data);
	}

	onMount(async () => {
		try {
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(`Oops. Something unexpected happened while loading the dash: ${error.message}`);
		}
	});
</script>

<svelte:head>
	<title>UniFood | Dashboard / My messages</title>
</svelte:head>

<div class="content block h-full w-full overflow-auto bg-transparent px-2 py-6 lg:px-16 lg:py-16 pb-40">
	<div class="flex pb-2 text-2xl font-semibold">Message center</div>
	<div class="flex w-full flex-wrap justify-between pb-12 text-sm font-light">
		<div>
			Message users. You will need to know their <code>@TAG</code> for this.<br />Below are the your
			recent interactions so far.
		</div>
	</div>
	<div class="flex w-full flex-col-reverse flex-wrap">
		{#if interactions}
			{#each interactions as interaction, i}
			{#if interaction.from_user.username != user.username}
				<div class="user_wrap w-full">
					<UserPill user={interaction.from_user ?? {}} description={interaction.content} html>
						<div class="controls flex space-x-2">
							<a href="/admin/dashboard/messaging/{interaction.to_user.channel_id}"
								><div
									class="edit-wrap h-fit w-fit"
									on:click={() => {
										localStorage.setItem(
											'current_interaction',
											JSON.stringify(interaction.to_user)
										);
									}}
								>
									<Button
										icon={faPaperPlane}
										color="transparent"
										custom_style="border border-COLORWHT"
										color_t="COLORWHT"
										text="Go to channel"
									/>
								</div></a
							>
						</div>
					</UserPill>
				</div>
				{/if}
			{/each}{:else}<div class="font-light">
				There was a problem while displaying the data.
			</div>{/if}
	</div>
</div>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

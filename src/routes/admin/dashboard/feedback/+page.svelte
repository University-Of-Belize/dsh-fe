<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import UserPill from '$lib/Elements/Dashboard/UserPill.svelte';
	import CommentBox from '$lib/Elements/Inputs/CommentBox.svelte';
	import { createFeedback, deleteFeedback } from '$lib/Elements/Utility/Feedback';
	import type { Feedback } from '$lib/types/Feedback';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
	import Editor from '@tinymce/tinymce-svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import SearchBar from '../../../../lib/Elements/Search/SearchBar.svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Feedback[]; // Declare the data variable
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	let feedbackInput: CommentBox;
	let richTextInput: string;
	let prefersRichText = true;
	$: data; // List of feedback (Feedback[])

	async function catchAll() {
		const res = (await fetchWebApi('admin/feedback/manage', 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
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
	<title>UniFood | Dashboard / My Feedback</title>
</svelte:head>

<div class="content block h-full w-full overflow-auto bg-transparent p-2 py-8 lg:px-16 lg:py-16 pb-40">
	<div class="flex pb-2 text-2xl font-semibold">Feedback Hub</div>
	<div class="flex w-full flex-wrap justify-between pb-12 text-xl font-light">
		<div>Submit or manage your feedback</div>
		<div
			on:click={async () => {
				prefersRichText = prefersRichText ? false : true;
			}}
		>
			<!--- Lol, well 'custom_icon' took long enough -->
			<Button
				custom_icon="/icons/font-awesome/scribble.svg"
				color="COLORDARK-25"
				text="Swap editor views"
				color_t="COLORLIGHT-100"
				custom_style="w-full"
			/>
		</div>
	</div>
	<div class="flex w-full flex-col-reverse flex-wrap">
		{#if data != undefined}
			<div class="block">
				{#if prefersRichText}
					<div class="richTextInput mb-4">
						<div class="mb-4 text-2xl font-semibold text-COLORLIGHT-100">Write some feedback</div>
						<Editor bind:value={richTextInput} apiKey={$page.data.tinymce_apikey} />
					</div>
				{:else}
					<div class="markDownInput mb-4">
						<div class="mb-4 text-2xl font-semibold text-COLORLIGHT-100">Write some feedback</div>
					</div>
					<CommentBox
						bind:this={feedbackInput}
						placeholder="Press 'Enter' and write some feedback"
						{user}
					/>{/if}
				<div
					class="edit-wrap h-fit w-fit"
					on:click={() => {
						createFeedback((feedbackInput ? feedbackInput.value : richTextInput ?? '') ?? '');
						feedbackInput ? feedbackInput.clear() : false;
						setTimeout(() => {
							catchAll();
						}, 800);
					}}
				>
					<Button
						icon={faPaperPlane}
						color="transparent"
						custom_style="border border-COLORACCENTD"
						color_t="COLORACCENTD"
						text="Submit feedback"
					/>
				</div>
			</div>
			<!-- on:input={(e) => outTerminal('INFO', JSON.stringify(e.detail))} -->
			{#if data.length === 0}
				<!-- Note that the reversal of UI elements is intentional because of "flex-reverse-column" -->
				{#if !staff}
					<div class="py-4">
						<SearchBar
							placeholder="Browse around, make an order, and tell us here if you experience any issues."
							nomargin
						/>
					</div>
				{/if}
				<div class="font-light">
					{staff
						? 'Nobody has submitted any feedback as yet.'
						: 'You have not submitted any feedback as yet.'}
				</div>
			{/if}
			{#each data as feedback, i}
				<div class="user_wrap w-full">
					<UserPill user={feedback.author ?? {}} description={feedback.content} html>
						<div class="controls flex space-x-2">
							<div
								class="edit-wrap h-fit w-fit"
								on:click={() => {
									deleteFeedback(feedback._id);
									setTimeout(() => {
										catchAll();
									}, 800);
								}}
							>
								<Button
									icon={faTrash}
									color="transparent"
									custom_style="border border-COLORACCENTL"
									color_t="COLORACCENTL"
									text="Delete feedback"
								/>
							</div>
						</div>
					</UserPill>
				</div>
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

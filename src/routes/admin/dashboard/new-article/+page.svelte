<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import DashList from '$lib/Elements/Dashboard/DashList.svelte';
	import UserPill from '$lib/Elements/Dashboard/UserPill.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import CommentBox from '$lib/Elements/Inputs/CommentBox.svelte';
	import { createArticle, deleteArticle } from '$lib/Elements/Utility/Article';
	import config from '$lib/config/settings';
	import type { Article } from '$lib/types/Article';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faPaperPlane, faReply, faTrash } from '@fortawesome/free-solid-svg-icons';
	import Editor from '@tinymce/tinymce-svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import TurndownService from 'turndown';
	import SearchBar from '../../../../lib/Elements/Search/SearchBar.svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Article[]; // Declare the data variable
	let user: User =
		localStorage.user && localStorage.user !== 'undefined' ? JSON.parse(localStorage.user) : {};
	let articleInput: CommentBox;
	let richTextInput: string;
	let prefersRichText = true;
	class TurndownService_ extends TurndownService {
		// Override the escape method to disable escaping
		escape(text: string) {
			return text;
		}
	}
	const turndownService = new TurndownService_();
	$: data; // List of article (Article[])

	async function catchAll() {
		const res = (await fetchWebApi('v1/admin/post/manage', 'GET')) as Response;
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
	<title>UniFood | Dashboard / Help Article Composer</title>
</svelte:head>

<main class="h-screen w-full overflow-hidden">
	<div class="navigation z-20 w-full">
		<Navigation
			transparency={5}
			search={true}
			titleText="Article Portal"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex h-full items-center justify-start overflow-hidden text-COLORWHT">
		<div
			class="drawer hidden h-screen w-full flex-col justify-start overflow-auto bg-COLORWHT4 bg-opacity-20 px-4 py-2 lg:block lg:w-1/4"
			bind:this={navDrawer}
		>
			<DashList {staff} />
		</div>
		<div class="content block h-full w-full overflow-auto bg-transparent px-16 py-16 pb-40">
			<div class="flex w-full flex-wrap justify-between pb-2 text-2xl font-semibold">
				<div>Announcements Article Management</div>
				<div
					on:click={async () => {
						prefersRichText = prefersRichText ? false : true;
					}}
				>
					<!--- Lol, well 'custom_icon' took long enough -->
					<Button
						custom_icon="/icons/font-awesome/scribble.svg"
						color="COLORBLK3"
						text="Swap editor views"
						color_t="COLORWHT"
						custom_style="w-full"
					/>
				</div>
			</div>
			<div class="flex pb-12 text-xl font-light">Submit or delete announcements articles</div>
			<div class="flex w-full flex-col flex-wrap">
				{#if data != undefined}
					<div class="block">
						{#if prefersRichText}
							<div class="richTextInput mb-4">
								<div class="mb-4 text-2xl font-semibold text-COLORWHT">
									Rich-Text+MarkDown Editor
								</div>
								<Editor bind:value={richTextInput} apiKey={config.ui['tiny-mce']['api-key']} />
							</div>
						{:else}
							<div class="markDownInput mb-4">
								<div class="mb-4 text-2xl font-semibold text-COLORWHT">
									PlainText <a
										class="text-COLORWHT underline"
										href="https://spec.commonmark.org/0.30/"
										target="__blank">MarkDown</a
									> Editor
								</div>
								<CommentBox
									bind:this={articleInput}
									placeholder="MarkDown is supported."
									textOnly
									unsanitized
									{user}
								/>
							</div>{/if}
						<div
							class="edit-wrap h-fit w-fit"
							on:click={() => {
								createArticle(
									(articleInput
										? articleInput.value
										: turndownService.turndown(richTextInput) ?? '') ?? ''
								);
								articleInput.clear();
								setTimeout(() => {
									catchAll();
								}, 800);
							}}
						>
							<Button
								icon={faPaperPlane}
								color="transparent"
								custom_style="border border-COLORGRN1"
								color_t="COLORGRN"
								text="Submit article"
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
							You have not created any help articles as yet. Compose a new one.
						</div>
					{/if}
					<div class="pt-8 text-2xl font-semibold">Previous Submissions</div>
					<div class="flex flex-col-reverse">
						{#each data as article, i}
							<div class="user_wrap w-full">
								<UserPill user={article.author ?? {}} description={`Article ID: ${article._id}`}>
									<div class="controls flex space-x-2">
										<div
											class="edit-wrap h-fit w-fit"
											on:click={() => {
												deleteArticle(article._id);
												setTimeout(() => {
													catchAll();
												}, 800);
											}}
										>
											<Button
												icon={faTrash}
												color="transparent"
												custom_style="border border-COLORHPK"
												color_t="COLORHPK"
												text="Delete article"
											/>
										</div>
										<div
											class="edit-wrap h-fit w-fit"
											on:click={() => {
												goto(`/app/help-center/${article._id}`);
											}}
										>
											<Button
												icon={faReply}
												color="transparent"
												custom_style="border border-COLORGRN1"
												color_t="COLORGRN"
												text="View article"
											/>
										</div>
									</div>
								</UserPill>
							</div>
						{/each}
					</div>{:else}<div class="font-light">
						There was a problem while displaying the data.
					</div>{/if}
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

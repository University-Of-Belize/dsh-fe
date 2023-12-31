<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import CommentBox from '$lib/Elements/Generic/CommentBox.svelte';
	import DashList from '$lib/Elements/Generic/DashList.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import UserPill from '$lib/Elements/Generic/UserPill.svelte';
	import { createArticle, deleteArticle } from '$lib/Elements/Utility/Article';
	import type { Article } from '$lib/types/Article';
	import type { User } from '$lib/types/User';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faCog, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import SearchBar from './../../../../lib/Elements/Generic/SearchBar.svelte';
	let navDrawer: HTMLDivElement;
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Article[]; // Declare the data variable
	let user: User = localStorage.user ? JSON.parse(localStorage.user) : {};
	let articleInput: CommentBox;
	$: data; // List of article (Article[])

	async function catchAll() {
		const res = (await fetchWebApi('v1/admin/post/manage', 'GET')) as Response;
		if (res.status === 403) {
			localStorage.removeItem('token');
			localStorage.removeItem('user_id');
			localStorage.removeItem('user');
			toast.push('You need to log in.');
			goto('/auth/login');
		}
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
	<title>Plattr | Dashboard / Help Article Composer</title>
</svelte:head>

<main class="w-full h-screen overflow-hidden">
	<div class="navigation w-full z-20">
		<Navigation
			transparency={5}
			search={true}
			titleText="Article Portal"
			titleWhere="/admin/dashboard"
		/>
	</div>

	<div class="main-content flex items-center justify-start h-full text-COLORWHT overflow-hidden">
		<div
			class="drawer hidden lg:block bg-COLORWHT4 bg-opacity-20 px-4 py-2 flex-col justify-start h-screen w-full lg:w-1/4 overflow-auto"
			bind:this={navDrawer}
		>
			<div class="section py-6 bg-opacity-100">
				<div class="title font-semibold pb-5">My Account</div>
				<div
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
					/>
				</div>
			</div>
			<DashList {staff} />
		</div>
		<div class="content block px-16 py-16 w-full h-full bg-transparent overflow-auto pb-40">
			<div class="flex text-2xl font-semibold pb-2">Help Center Article Management</div>
			<div class="flex text-xl font-semibold pb-12">Submit or delete help center articles</div>
			<div class="flex flex-wrap flex-col w-full">
				{#if data != undefined}
					<div class="block">
						<CommentBox
							bind:this={articleInput}
							placeholder="MarkDown is supported."
							textOnly
							{user}
						/>
						<div
							class="edit-wrap w-fit h-fit"
							on:click={() => {
								createArticle(articleInput.value ?? '');
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
                    <div class="text-2xl font-semibold pt-8">Previous Submissions</div>
					<div class="flex flex-col-reverse">
						{#each data as article, i}
							<div class="user_wrap w-full">
								<UserPill
									user={article.author ?? {}}
									description={`Article ID: ${article._id}<br/>Content: ${article.content}`}
								>
									<div class="controls flex space-x-2">
										<div
											class="edit-wrap w-fit h-fit"
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

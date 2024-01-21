<script lang="ts">
	import CardPicker from '$lib/Elements/Cards/CardPicker.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import type { Article } from '$lib/types/Article';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	let data: Article[];

	async function catchAll() {
		const res = (await fetchWebApi('v1/admin/post/manage', 'GET')) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message);
		}
		const r = await res.json();
		data = r.is; // Rizz
		console.log(data);
	}

	onMount(async () => {
		try {
			await catchAll();
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while loading the help-center: ${error.message}`
			);
		}
	});
</script>

<svelte:head>
	<title>UniFood | Announcements</title>
</svelte:head>

<main class="h-screen w-full overflow-hidden text-COLORWHT">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} titleText="Announcements" />
	</div>
	<div
		class="content-wrapper absolute z-10 flex h-full w-full items-start justify-start overflow-auto pb-40"
	>
		<div class="content flex w-full flex-1 items-center justify-center">
			<div class="block p-8 text-left">
				<div
					class="title flex h-48 w-full items-center justify-center rounded-md bg-COLORBLK4 pb-5 text-4xl font-semibold"
				>
					<div class="block text-center">
						<div>Announcements (Beta)</div>
						<div class="mt-2 text-sm font-light text-COLORWHT1">Find help articles here</div>
					</div>
				</div>
				{#if data != undefined}
					{#each data as article, i}
						<CardPicker
							title="By @{article.author?.username}"
							subtitle=""
							body={article.content.length > 500
								? marked.parse(article.content.substring(0, 500)) + '...'
								: marked.parse(article.content)}
							image="/android-chrome-512x512.png"
							image_alt="UniFood Mobile App"
							button_icon={faBookOpenReader}
							button_color="COLORGRN2"
							button_text="Open article"
							where_to="/app/help-center/{article._id}"
						/>
					{/each}{:else}There was an issue while loading the help-center.{/if}
			</div>
		</div>
	</div>
</main>
<div class="footer relative z-10">
	<Footer text="Looks like you've reached the end.">
		<div class="block">
			<!-- <div class="text-xl font-light">Shop our entire menu by creating an account</div> -->
			<div class="flex w-full items-center justify-center pb-4 pt-8">
				<SearchBar />
			</div>
		</div>
	</Footer>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	:global(body)::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	:global(body) {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>

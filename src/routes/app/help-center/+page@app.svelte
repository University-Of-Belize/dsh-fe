<script lang="ts">
	import CardPicker from '$lib/Elements/Cards/CardPicker.svelte';
	import type { Article } from '$lib/types/Article';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { faBookOpenReader } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	let data: Article[];

	async function catchAll() {
		const res = (await fetchWebApi('admin/post/manage', 'GET')) as Response;
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

<div class="content flex w-full flex-1 items-center justify-center">
	<div class="block p-8 text-left">
		<div
			class="title flex h-48 w-full items-center justify-center rounded-md bg-COLORDARK-75 pb-5 text-4xl font-semibold"
		>
			<div class="block text-center">
				<div>Announcements (Beta)</div>
				<div class="mt-2 text-sm font-light text-COLORLIGHT-15">Find help articles here</div>
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
					button_color="COLORACCENTD"
					button_text="Open article"
					where_to="/app/help-center/{article._id}"
				/>
			{/each}{:else}There was an issue while loading the help-center.{/if}
	</div>
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

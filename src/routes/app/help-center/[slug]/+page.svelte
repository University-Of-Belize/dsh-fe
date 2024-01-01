<script lang="ts">
	import { page } from '$app/stores';
	// import config from '$lib/config/settings';
	import { onMount } from 'svelte';

	// import { goto } from '$app/navigation';
	// import Button from '$lib/Elements/Generic/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import type { User } from '$lib/types/User';
	import type { Article } from '$lib/types/Article';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { marked } from 'marked';
	// import insane from 'insane';
	// let hero_image: HTMLDivElement;
	const staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // The user
	const user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // The user
	const params = $page.params.slug;
	let data: Article;

	// Options for the "marked" renderer

	// Create a custom renderer
	const customRenderer = new marked.Renderer();

	// Override rendering for tables
	customRenderer.table = function (header, body) {
		return `
    <div class="flex flex-col border border-COLORBLK2 mt-8">
      <div class="flex flex-row bg-COLORBLK2 font-semibold border border-COLORBLK3">
        ${header}
      </div>
      <div class="flex flex-row border border-COLORBLK2">
        ${body}
      </div>
    </div>`;
	};

	// Override rendering for table rows
	customRenderer.tablerow = function (content) {
		return `<div class="flex flex-wrap md:flex-nowrap w-full h-full items-start justify-around p-2 border border-COLORBLK2">${content}</div>`;
	};

	// Override rendering for table cells
	customRenderer.tablecell = function (content, flags) {
		const alignClass = flags.align ? `text-${flags.align}` : '';
		return `<div class="${alignClass} flex items-center justify-start space-x-2 p-2 border border-COLORBLK2"><div class="block">${content}</div></div>`;
	};

	// Set the custom renderer when calling marked
	marked.setOptions({
		renderer: customRenderer
	});
	/************************************/

	async function catchAll() {
		const post = (await fetchWebApi(
			`v1/admin/post/lookup?article_id=${params}`,
			'GET'
		)) as Response;
		if (!post) return;
		if (!post.ok) {
			try {
				const res = await post.json();
				toast.push('There was an error while retrieving the article: ' + res.message);
			} catch {
				toast.push('There was an error while retrieving the article.');
			}
		}
		const r = await post.json();
		data = r.is;
	}

	onMount(async () => {
		try {
			catchAll();
		} catch (error) {
			console.log(error);
			toast.push(
				`Oops. Something unexpected happened while loading the help article: ${error.message}`
			);
		}
	});
</script>

<svelte:head>
	<title>Plattr | Help Center / Article View</title>
</svelte:head>

<div
	class="stub flex hidden flex-row flex-col flex-wrap items-start justify-start justify-center justify-between justify-around space-x-2 bg-COLORBLK1 md:flex-nowrap"
></div>

<main class="h-screen w-full text-COLORWHT">
	<div class="navigation z-20 w-full">
		<Navigation
			transparency={5}
			search={true}
			titleText="Help Center"
			titleWhere="/app/help-center"
		/>
	</div>

	<div
		class="content-wrapper absolute z-10 flex h-full w-full flex-wrap items-center justify-center"
	>
		<div class="content pb-27 mx-12 flex h-full w-full items-start justify-start pt-12 lg:flex-1">
			{#if data != undefined}
				<section
					class="content-wrapper prose prose-neutral block w-full max-w-full rounded-sm bg-COLORBLK1 p-8 text-COLORWHT1 prose-h1:text-COLORWHT prose-h2:text-COLORWHT2 prose-h3:text-COLORWHT3 prose-h4:text-COLORWHT4 prose-h5:text-COLORWHT5 prose-h6:text-COLORWHT5 prose-a:text-COLORWHT2 prose-strong:text-COLORWHT1 prose-code:text-COLORYLW prose-ol:text-COLORWHT1 prose-ul:text-COLORWHT2 prose-li:text-COLORWHT"
				>
					{@html marked.parse(data.content) || "Oops, this post doesn't exist!"}
				</section>
			{:else}
				<div class="text-2xl text-COLORWHT">Loading article...</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	/* :global(h1) {
		font-size: 2rem;
		margin-top: 1.5rem;
	}
	:global(h2) {
		font-size: 1.5rem;
		margin-top: 1.5rem;
	}
	:global(p) {
		margin-top: 1.25rem;
		padding: 1rem 1rem 1rem 1rem;
		border-radius: 0.25rem;
		background: rgb(var(--COLORBLK2));
	}
	:global(a) {
		text-decoration: underline;
	}
	:global(a:hover) {
		opacity: 0.75;
	}
	:global(ol) {
		list-style: none;
		counter-reset: my-counter;
		margin-top: 1.5rem;
	}
	:global(ul) {
		list-style: none;
		counter-reset: my-counter;
		margin-top: 1.5rem;
	}
	:global(hr) {
		margin-top: 2rem;
		margin-bottom: 2rem;
		color: rgb(var(--COLORBLK5));
	}
	:global(li) {
		counter-increment: my-counter;
		margin-bottom: 10px; /* Adjust as needed /
	} */

	/* :global(li:before) {
		content: counter(my-counter) '. ';
		font-weight: bold; /* Optional: make the numbers bold /
		color: #007bff; /* Optional: change the color of the numbers /
		margin-right: 5px; /* Optional: adjust the spacing between number and text /
	} */

	/* Terminal */
	/* :global(code) {
		display: inline-block;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
		color: rgb(var(--COLORGRN));
		background: rgb(var(--COLORBLK1));
		border: 1px solid rgb(var(--COLORBLK5));
		border-radius: 0.125rem;
		padding: 0.25rem 0.5rem 0.25rem 0.5rem;
		margin-top: 1rem;
        width: fit-content;
        max-width: 75%;
	} 
	 :global(.language-js) {
		display: block;
		padding: 1.125rem 1.125rem 1.125rem 1.125rem;
        margin-bottom: 0.5rem;
	}
	:global(.ERROR) {
		color: #ff0000;
	}
	:global(.WARNING) {
		color: #ff9900;
	}
	:global(.INFO) {
		color: #00ff00;
	} */
</style>

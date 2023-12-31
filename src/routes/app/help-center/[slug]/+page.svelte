<script lang="ts">
	import { page } from '$app/stores';
	import config from '$lib/config/settings';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import type { User } from '$lib/types/User';
	import type { Article } from '$lib/types/Article';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { toast } from '@zerodevx/svelte-toast';
	import { marked } from 'marked';
	import insane from 'insane';
	// let hero_image: HTMLDivElement;
	const staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // The user
	const user: User = localStorage.user ? JSON.parse(localStorage.user) : {}; // The user
	const params = $page.params.slug;
	let data: Article;

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

<main class="w-full h-screen text-COLORWHT">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} />
	</div>

	<div
		class="content-wrapper w-full h-full absolute flex items-center justify-center z-10 flex-wrap"
	>
		<div class="content lg:flex-1 flex h-full w-full items-start justify-start mx-12 pt-12 pb-27">
			{#if data != undefined}
				<div class="block content-wrapper">
					{@html marked.parse(data.content) || "Oops, this post doesn't exist!"}
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	:global(h1) {
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
		margin-bottom: 10px; /* Adjust as needed */
	}

	:global(li:before) {
		content: counter(my-counter) '. ';
		font-weight: bold; /* Optional: make the numbers bold */
		color: #007bff; /* Optional: change the color of the numbers */
		margin-right: 5px; /* Optional: adjust the spacing between number and text */
	}

	/* Terminal */
	:global(code) {
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
	}
</style>

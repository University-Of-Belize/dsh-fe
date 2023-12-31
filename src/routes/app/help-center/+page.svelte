<script lang="ts">
	import { goto } from '$app/navigation';
	import CardPicker from '$lib/Elements/Generic/CardPicker.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Generic/SearchBar.svelte';
	import type { Article } from '$lib/types/Article';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	let staff: boolean = localStorage.staff ? JSON.parse(localStorage.staff) : false; // Others will use this
	let data: Article[];
	import { faBookOpenReader, faDesktopAlt, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';

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
	<title>Plattr | Help Center</title>
</svelte:head>

<main class="w-full h-screen overflow-hidden text-COLORWHT">
	<div class="navigation w-full z-20">
		<Navigation transparency={5} search={true} titleText="Help Center" />
	</div>
	<div
		class="content-wrapper w-full h-full absolute flex items-start justify-start overflow-auto z-10 pb-40"
	>
	<div class="content flex-1 flex items-center justify-center w-full">
		<div class="block p-8 text-left">
				<div
					class="title flex justify-center items-center text-4xl font-semibold pb-5 w-full h-48 bg-COLORBLK4 rounded-md"
				>
					<div class="block text-center">
						<div>Help Center (Beta)</div>
						<div class="text-COLORWHT1 mt-2 text-sm font-light">Find help articles here</div>
					</div>
				</div>
				{#if data != undefined}
					{#each data as article, i}
						<CardPicker
							title="By @{article.author?.username}"
							subtitle=""
							body={article.content.length > 500
								? article.content.substring(0, 500) + '...'
								: article.content}
							image="/placeholder/via-placeholder/50.png"
							image_alt="Plattr Mobile App"
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
			<div class="flex justify-center items-center w-full pt-8 pb-4">
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

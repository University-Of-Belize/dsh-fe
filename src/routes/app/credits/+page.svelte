<script lang="ts">
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Search/SearchBar.svelte';
	import DataCard from '$lib/Elements/Cards/DataCard.svelte';

	// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
	// import Fa from 'svelte-fa';

	import type { ContributorData } from '$lib/types/Contibutor';

	// The "contributors" object
	const contributors: ContributorData[] = [
		{
			url: 'https://github.com/AlexDev404',
			image: 'https://avatars.githubusercontent.com/u/34188635',
			name: 'Immanuel Garcia',
			description: 'Systems Designer, Programmer, Documentor, Project Coordinator',
			retired: false
		},
		{
			url: 'https://github.com/Pedro-Kukul',
			image: 'https://avatars.githubusercontent.com/u/122998176',
			name: 'Pedro J Kukul',
			description: 'Database Designer, Programmer, Documentor',
			retired: false
		},
		{
			url: '#',
			image: '/assets/credits/DALESSEO_REQUENA.jpg',
			name: "D'Alesseo Requena",
			description: 'Public Relations Officer, Creative Lead, Project Organizer',
			retired: false
		},
		{
			url: 'https://hueilost.github.io/HueiLost/',
			image: 'https://avatars.githubusercontent.com/u/98348428',
			name: 'Maylin Chee',
			description:
				'Quality Assurance Officer, Creative Lead, Graphic Designer, UI Component Designer',
			retired: false
		},
		{
			url: 'https://github.com/Lee26Ed',
			image: 'https://avatars.githubusercontent.com/u/86505610',
			name: 'Lee Panti',
			description: 'Systems Designer, Database Designer, Programmer, Documentor',
			retired: true
		},
		{
			url: '#',
			image: '/assets/credits/KYLER_BROWN.jpg',
			name: 'Kyler Brown',
			description: 'Documentation, Systems Designer',
			retired: false
		},
		{
			url: '#',
			image: '/assets/credits/KYLE_GLADDEN.jpg',
			name: 'Kyle Gladden',
			description: 'Documentation, Systems Designer',
			retired: false
		}
	];
</script>

<svelte:head>
	<title>UniFood | Credits</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<!-- Params to empty string--not undefined otherwise it will make the value actually be the string 'undefined' -->
		<Navigation transparency={5} search={true} />
	</div>
	<div class="content-wrapper absolute z-10 block h-full w-full overflow-auto pb-40 lg:mx-6">
		<div class="content mx-4">
			<!--- The title -->
			<div class="my-8 block w-full text-2xl font-semibold text-COLORWHT">
				<div>Credits</div>
				<div class="text-sm font-light">
					These are all the people who made it possible to bring this app into existence throughout
					the course of its lifetime.
				</div>
			</div>
			<div class="block w-full flex-wrap lg:flex">
				{#each contributors as contributor}
					<!-- Start cards -->
					<div
						class="card-wrapper my-4 flex flex-wrap justify-center text-COLORWHT md:space-x-4 lg:justify-start"
					>
						<DataCard
							url={contributor.url}
							image={contributor.image}
							name={contributor.name}
							description={contributor.description}
							error_text={contributor.retired ? 'RETIRED' : false}
							no_forward={contributor.url == '#'}
						/>
					</div>
				{/each}
			</div>
			<!-- End cards -->
		</div>
	</div>
</main>
<div class="footer relative z-10">
	<Footer
		text="Special thanks to student services for being so patient and understanding the entire way though :)"
	>
		<div class="block">
			<!-- <div class="text-xl font-light">Shop our entire menu by creating an account</div> -->
			<div class="flex w-full items-center justify-center pb-4 pt-8">
				<SearchBar />
			</div>
		</div>
	</Footer>
</div>

<style>
	.categoryp-wrap::-webkit-scrollbar {
		height: 1px !important;
	}
</style>

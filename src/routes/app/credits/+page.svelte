<script lang="ts">
    import Footer from '$lib/Elements/Generic/Footer.svelte';
    import Navigation from '$lib/Elements/Generic/Navigation.svelte';
    import SearchBar from '$lib/Elements/Search/SearchBar.svelte';

	// import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
	// import Fa from 'svelte-fa';

</script>

<svelte:head>
	<title>UniFood | Credits</title>
</svelte:head>

<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<!-- Params to empty string--not undefined otherwise it will make the value actually be the string 'undefined' -->
		<Navigation transparency={5} search={true} />
	</div>
	<div
		class="content-wrapper absolute z-10 h-full w-full items-start justify-start overflow-auto pb-40 lg:mx-6 lg:flex"
	>

				<!--- The title -->
				<div class="my-8 block w-full text-2xl font-semibold text-COLORWHT">
					<div>Credits</div>
					<div class="text-sm font-light">
						These are all the people who made it possible to bring the app to life.
					</div>
				</div>

</main>
<div class="footer relative z-10">
	<Footer text="Special thanks to student services for being so patient and understanding the entire way though :)">
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

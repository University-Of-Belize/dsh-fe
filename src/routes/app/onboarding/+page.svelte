<script lang="ts">
	import CardPicker from '$lib/Elements/Generic/Cards/CardPicker.svelte';
	import Footer from '$lib/Elements/Generic/Footer.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import SearchBar from '$lib/Elements/Generic/Search/SearchBar.svelte';

	import { faDesktopAlt, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
</script>

<svelte:head>
	<title>Plattr | Onboarding</title>
</svelte:head>

<main class="h-screen w-full overflow-hidden text-COLORWHT">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div
		class="content-wrapper absolute z-10 flex h-full w-full items-start justify-start overflow-auto pb-40"
	>
		<div class="content flex flex-1 items-center justify-center">
			<div class="block p-8 text-left">
				<div class="title pb-5 text-2xl font-semibold">Select your platform</div>
				<CardPicker
					title="Mobile 📱"
					subtitle="Select this option if you're using a mobile device"
					body="Whether on the go or at home, our mobile-friendly platform ensures a seamless and
                    convenient ordering experience. Browse, customize, and enjoy your favorite dishes
                    with just a few taps. Plattr—your quick and easy way to delicious meals."
					image="/pwa/screenshots/mobile_1.jpg"
					image_alt="Plattr Mobile App"
					button_icon={faMobileAlt}
					button_color="COLORGRN2"
					button_text="Install for mobile"
					where_to="/app/mobile"
				/>
				<CardPicker
					title="Desktop 🧑‍💻"
					subtitle="Select this option if you're on desktop (PC or laptop)"
					body="Plattr's user-friendly desktop interface provides a seamless ordering experience. Effortlessly explore our menu, customize your selections, and complete your order with ease. Enjoy the convenience of ordering your favorite dishes from the comfort of your computer. Elevate your dining experience with Plattr's intuitive desktop platform."
					image="/pwa/screenshots/desktop_1.jpg"
					image_alt="Plattr Mobile App"
					button_icon={faDesktopAlt}
					button_color="COLORGRN2"
					button_text="Install for desktop"
					where_to="/app/desktop"
				/>
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

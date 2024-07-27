<script lang="ts">
	import CardPicker from '$lib/Elements/Cards/CardPicker.svelte';

	import { faDesktopAlt, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
</script>

<svelte:head>
	<title>UniFood | Onboarding</title>
</svelte:head>

<div class="content flex flex-1 items-center justify-center">
	<div class="block p-8 text-left">
		<div class="title pb-5 text-2xl font-semibold">Select your platform</div>
		<CardPicker
			title="Mobile 📱"
			subtitle="Select this option if you're using a mobile device"
			body="Whether on the go or at home, our mobile-friendly platform ensures a seamless and
                    convenient ordering experience. Browse, customize, and enjoy your favorite dishes
                    with just a few taps. UniFood—your quick and easy way to delicious meals."
			image="/pwa/screenshots/mobile_1.jpg"
			image_alt="UniFood Mobile App"
			button_icon={faMobileAlt}
			button_color="COLORACCENTD"
			button_text="Install for mobile"
			where_to="/app/mobile"
		/>
		<CardPicker
			title="Desktop 🧑‍💻"
			subtitle="Select this option if you're on desktop (PC or laptop)"
			body="UniFood's user-friendly desktop interface provides a seamless ordering experience. Effortlessly explore our menu, customize your selections, and complete your order with ease. Enjoy the convenience of ordering your favorite dishes from the comfort of your computer. Elevate your dining experience with UniFood's intuitive desktop platform."
			image="/pwa/screenshots/desktop_1.jpg"
			image_alt="UniFood Mobile App"
			button_icon={faDesktopAlt}
			button_color="COLORACCENTD"
			button_text="Install for desktop"
			where_to="/app/desktop"
		/>
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

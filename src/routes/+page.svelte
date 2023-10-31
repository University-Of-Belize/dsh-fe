<script lang="ts">
	import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import { goto } from '$app/navigation';
</script>

<main class="w-full h-screen">
	<div class="hero">
		<div class="image-and-wrapper relative" style="height: 800px">
			<div class="navigation absolute w-full top-0 z-20">
				<Navigation transparency={25} search={false}/>
			</div>
			<div class="content-wrapper w-full h-full absolute flex items-center justify-center z-10">
				<div class="content flex-1 flex items-center justify-center">
					<div class="block content-wrapper">
						<div
							class="running-heading text-COLORWHT py-10 text-7xl font-medium flex w-full justify-center items-center"
						>
							Order Anytime,<br /> Anywhere
						</div>
						<div class="running-subheading">
							<div
								on:click={() => {
									goto('/auth/login');
								}}
							>
							<Button icon={faRightToBracket} color="COLORYLW" text="Login"/></div>
						</div>
					</div>
				</div>
				<div class="fix flex-1">&nbsp;</div>
			</div>
			<div
				class="wrapper bg-black opacity-50 w-full h-full absolute flex items-center justify-center"
			>
				<!-- Nothing, this is an overlay-->
			</div>
			<div class="hero-image h-full w-full" />
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}

	.hero-image {
		background-image: url('./homepage/hero.png');
		background-size: cover;
	}
</style>

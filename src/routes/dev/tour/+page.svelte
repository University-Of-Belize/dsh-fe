<!-- Secret page -->
<script lang="ts">
	import { onMount } from 'svelte';
	// @ts-expect-error This is an old library so it doesn't have types
	import YouTube from 'svelte-youtube';

	let overlay: HTMLDivElement;

	onMount(async () => {
		localStorage.setItem('tour', 'Yes');
		localStorage.setItem('needs_dashTour', 'true')
		navigator.serviceWorker.getRegistrations().then((registrations) => {
			for (const registration of registrations) {
				registration.unregister();
			}
		});
	});

	const options = {
		width: '100%',
		height: '100%',
		//  see https://developers.google.com/youtube/player_parameters
		playerVars: {
			autoplay: 1
		}
	};

	function onReady(event) {
		// setTimeout(() => {
		// 	event.detail.target.pauseVideo();
		// }, 500);
	}

	function onEnd(event) {
		console.log('End: ' + event);
		overlay.classList.remove('invisible');
		setTimeout(() => {
			window.location.href = '/';
		}, 3000);
	}
</script>

<!-- Cached CSS classes -->
<span class="css-cache invisible hidden"></span>

<!-- Overlay with text -->
<div
	bind:this={overlay}
	class="invisible absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 transition-all"
>
	<div class="text-2xl text-white">
		<p>Thank you for watching</p>
		<p>Enjoy the rest of the tour</p>
	</div>
</div>

<div class="absolute inset-0 top-0 -z-10 flex items-center justify-center bg-black bg-opacity-90">
	<span class="text-center text-white"
		>If you can see this, we forced<br />an app update just now. <br /><br /><b>To continue</b>,
		reload the page by pulling down from the top of the screen<br />(if in app) or using the refresh
		button in the browser.<br /><br /><span class="font-thin">ERR: outdated_client</span></span
	>
</div>

<YouTube
	videoId="Oq46-UCWuZ4"
	class="h-screen w-full"
	{options}
	on:ready={onReady}
	on:end={onEnd}
/>

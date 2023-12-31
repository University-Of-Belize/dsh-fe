<script lang="ts">
	import { onMount } from 'svelte';

	let terminal: HTMLDivElement;

	async function outTerminal(type: 'ERROR' | 'WARNING' | 'INFO', message: string) {
		const terminalElement = document.createElement('div');
		terminalElement.classList.add('consoleEvent');
		terminalElement.classList.add(type);
		terminalElement.innerHTML = `[${type}] ${message}`;
		terminal.appendChild(terminalElement);
	}

	onMount(async () => {
		outTerminal('INFO', 'This space is used to develop new components for the user interface.');
	});
</script>

<main class="text-COLORWHT p-8">
	<div class="text-2xl font-semibold mt-6 mb-2">Development Area</div>
	<div
		bind:this={terminal}
		class="consoleEventLog block font-mono border boarder-COLORWHT text-COLORBLE rounded-sm w-full p-8"
	>
		<div class="consoleEvent">[TERMINAL] Ready to accept input</div>
	</div>
	<div class="text-xl font-semibold mt-6">Boilerplate code — Nothing here to see!</div>
</main>

<style>
	/* Terminal */
	:global(.ERROR) {
		color: #ff0000;
	}
	:global(.WARNING) {
		color: #ff9900;
	}
	:global(.INFO) {
		color: #00ff00;
	}
	:global(.consoleEvent) {
		font-family: 'Courier New', Courier, monospace;
		/* font-size: 14px; */
	}
</style>

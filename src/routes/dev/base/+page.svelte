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

<main class="p-8 text-COLORLIGHT-100">
	<div class="mb-2 mt-6 text-2xl font-semibold">Development Area</div>
	<div
		bind:this={terminal}
		class="consoleEventLog block w-full rounded-sm border border-COLORLIGHT-100 p-8 font-mono text-COLORACCENTL"
	>
		<div class="consoleEvent">[TERMINAL] Ready to accept input</div>
	</div>
	<div class="mt-6 text-xl font-semibold">Boilerplate code — Nothing here to see!</div>
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

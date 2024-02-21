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
		outTerminal('ERROR', 'This microservice has been shut-down for maintenance. Please try again later.');
	});
</script>

<main class="p-8 text-COLORWHT">
	<div class="mb-2 mt-6 text-2xl font-semibold">Testing is paused</div>
	<div
		bind:this={terminal}
		class="consoleEventLog block w-full rounded-sm border border-COLORWHT p-8 font-mono text-COLORGRN2"
	>
		<div class="consoleEvent">[TERMINAL] Ready to accept input</div>
	</div>
	<div class="mt-6 text-xl font-semibold">Testing has been put on-hold.<br/>Please check your email for further updates.</div>
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

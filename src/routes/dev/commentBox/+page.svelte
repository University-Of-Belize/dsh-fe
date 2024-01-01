<script lang="ts">
	import { onMount } from 'svelte';
	import CommentBox from './../../../lib/Elements/Generic/CommentBox.svelte';

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

<main class="p-8 text-COLORWHT">
	<div class="mb-2 mt-6 text-2xl font-semibold">Development Area</div>
	<div
		bind:this={terminal}
		class="consoleEventLog boarder-COLORWHT block w-full rounded-sm border p-8 font-mono text-COLORBLE"
	>
		<div class="consoleEvent">[TERMINAL] Ready to accept input</div>
	</div>
	<div class="mt-6 text-xl font-semibold">commentBox component</div>
	<div class="text-md mb-6 mt-2 block font-light">
		<code>src/lib/Elements/Generic/CommentBox.svelte</code>
		<div>Takes in a `user` object, returns the content as a custom <code>input</code> event</div>
	</div>
	<CommentBox
		placeholder="Write some feedback"
		user={JSON.parse(localStorage.user)}
		on:input={(e) => outTerminal('INFO', JSON.stringify(e.detail))}
	/>
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

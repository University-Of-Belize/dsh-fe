<script lang="ts">
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';

	let tagArea: HTMLDivElement;
	let tagInputArea: TextInput;
	let terminal: HTMLDivElement;
	let wantsBackspace: boolean = false;
	export let placeholder: string = 'Type a tag and press Enter';
	export let custom_style: string | undefined = '';
	export let results: string[] = [];

	async function outTerminal(type: 'ERROR' | 'WARNING' | 'INFO', message: string) {
		const terminalElement = document.createElement('div');
		terminalElement.classList.add('consoleEvent');
		terminalElement.classList.add(type);
		terminalElement.innerHTML = `[${type}] ${message}`;
		terminal.appendChild(terminalElement);
	}

	async function addTag(tag: string) {
		const tagElement = document.createElement('div');
		const closeElement = document.createElement('span');

		// Remove the placeholder from tagInputArea
		tagInputArea.placeholder = '';

		// Tag element
		tagElement.classList.add('tag');

		// Close element
		closeElement.classList.add('tag-close');
		// closeElement.setAttribute('data-index', i);
		closeElement.innerHTML = '×';

		// Add tag element to DOM
		tagElement.innerHTML = tag + closeElement.outerHTML;
		// Add event listener to close element which removes the tag
		tagElement.lastChild.addEventListener('click', (e) => {
			tagElement.remove();
			// Remove the element in the array that matches the tag
			results.splice(results.indexOf(tag), 1);
			outTerminal('INFO', JSON.stringify(results));
		});
		tagArea.appendChild(tagElement);
		// Add a margin left of 10px to the close element within the tag element after appending it to the DOM
		setTimeout(() => {
			// @ts-ignore
			tagElement.querySelector('.tag-close').style.marginLeft = '20px';
		}, 50); // Add some "bounce" (lol)
	}

	async function checkTags(event_: CustomEvent) {
		const event = event_.detail;
		// outTerminal('WARNING', );
		// console.log(event)
		if (event instanceof KeyboardEvent) {
			// outTerminal('INFO', `KeyboardEvent: ${event.key}`);

			if (tagArea.children.length > 0) {
				// @ts-ignore
				if (tagArea.lastChild.querySelector('.tag-close').style.marginLeft === '20px') {
					// @ts-ignore
					tagArea.lastChild.querySelector('.tag-close').style.marginLeft = '10px';
				}
			}
			if (tagInputArea.value.length > 0) {
				wantsBackspace = false;
			}
			if (tagArea.children.length > 0 && tagInputArea.value.length === 0) {
				tagInputArea.placeholder = placeholder;
			}
			// outTerminal('WARNING', tagInputArea.value.length);
			// If the event key is a backspace, remove the last element from the tag area
			if (event.key === 'Backspace' && tagInputArea.value.length === 0) {
				// We do this to prevent the last letter from deleting the tag
				if (!wantsBackspace) return (wantsBackspace = true);
				// @ts-ignore
				tagArea.lastChild.remove();
				results.pop(); // Remove the last element from the results array as well
				outTerminal('INFO', JSON.stringify(results));
				wantsBackspace = false;
			}
			if (event.key === 'Enter') {
				let tags = tagInputArea.value.split(' ');
				for (let tag of tags) {
					if (tag.trim() != '') {
						await addTag(tag);
						results.push(tag); // Add the tag to the results array
						outTerminal('INFO', JSON.stringify(results));
					}
				}
				tagInputArea.value = '';
			}
		}
	}
</script>

<main class="p-8 text-COLORLIGHT-100">
	<div class="mb-2 mt-6 text-2xl font-semibold">Development Area</div>
	<div
		bind:this={terminal}
		style="font-family: 'Courier New', Courier, monospace;"
		class="consoleEventLog block w-full rounded-sm border border-COLORLIGHT-100 p-8 font-mono text-COLORACCENTL"
	>
		<div>[TERMINAL] Ready to accept input</div>
	</div>
	<div class="mt-6 text-xl font-semibold">Tag</div>
	<div class="content mt-4">
		<div class="tag w-fit">
			This is what a tag looks like
			<div class="tag-close ml-1">×</div>
		</div>
	</div>
	<div class="mt-6 text-xl font-semibold">Tag Input</div>
	<div
		class="tagInput mt-2 flex w-full items-center rounded-sm border border-COLORLIGHT-100 bg-COLORLIGHT-100 px-4 py-2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-40 {custom_style}"
	>
		<div bind:this={tagArea} class="tagArea flex bg-red-500 px-2" />
		<TextInput
			{placeholder}
			name="tagInputArea"
			class="tagInputArea"
			container_style="margin: 0;"
			custom_style="bg-transparent w-full border-0 px-0"
			bind:this={tagInputArea}
			on:keydown={(e) => {
				checkTags(e);
			}}
		/>
	</div>
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
		font-size: 14px;
	}
	/* Tag component */
	:global(.tag) {
		display: flex;
		align-items: center;
		height: 35px;
		margin-right: 5px;
		padding: 0 8px;
		color: #fff;
		background: #47cf73;
		border-radius: 15px;
		cursor: pointer;
	}
	:global(.tag-close) {
		display: inline-block;
		margin-left: 1px; /* Transition to 20px in script */
		transition: 0.2s all;
		user-select: none;
		overflow: hidden;
	}
</style>

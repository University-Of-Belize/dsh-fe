<svelte:options accessors />

<script lang="ts">
	import TextInput from '$lib/Elements/Generic/Inputs/TextInput.svelte';
	export let placeholder: string = 'Type a tag and press Enter';
	export let custom_style: string | undefined = '';
	export let results: string[] = [];
	let tagArea: HTMLDivElement;
	let tagInputArea: TextInput;
	let wantsBackspace: boolean = false;

	export async function addTag(tag: string) {
		const tagElement = document.createElement('div');
		const closeElement = document.createElement('span');

		// Remove the placeholder from tagInputArea
		tagInputArea.placeholder = '';

		// Tag element
		tagElement.classList.add('tag2');
		tagElement.classList.add('bg-COLORBLE');

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
		if (event instanceof KeyboardEvent) {
			// If the tag area has children, and the last child has a margin left of 20px, change it to 10px
			if (tagArea.children.length > 0) {
				// @ts-ignore
				if (tagArea.lastChild.querySelector('.tag-close').style.marginLeft === '20px') {
					// @ts-ignore
					tagArea.lastChild.querySelector('.tag-close').style.marginLeft = '10px';
				}
			}

			// If the tag input area has a value, set wantsBackspace to false
			if (tagInputArea.value.length > 0) {
				wantsBackspace = false;
			}
			// If the tag input area has no value, set the placeholder to the default
			if (tagArea.children.length > 0 && tagInputArea.value.length === 0) {
				tagInputArea.placeholder = placeholder;
			}

			// If the event key is a backspace, remove the last element from the tag area
			if (event.key === 'Backspace' && tagInputArea.value.length === 0) {
				// We do this to prevent the last letter from deleting the tag
				if (!wantsBackspace) return (wantsBackspace = true);
				// @ts-ignore
				tagArea.lastChild.remove();
				results.pop(); // Remove the last element from the results array as well

				wantsBackspace = false;
			}
			if (event.key === 'Enter') {
				let tags = tagInputArea.value.split(' ');
				for (let tag of tags) {
					if (tag.trim() != '') {
						await addTag(tag);
						results.push(tag); // Add the tag to the results array
					}
				}
				tagInputArea.value = '';
			}
		}
	}
</script>

<div class="stub hidden bg-COLORBLE" />
<div
	class="tagInput mt-2 flex w-full items-center rounded-sm border border-COLORWHT bg-COLORWHT5 px-4 py-2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-40 {custom_style}"
>
	<div bind:this={tagArea} class="tagArea flex px-2" />
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

<style>
	/* Tag component */
	:global(.tag) {
		/* w-full rounded-sm bg-COLORWHT5 px-4 py-2 items-center text-sm border border-COLORWHT aria-disabled:opacity-40 aria-disabled:cursor-not-allowed */
		display: flex;
		justify-content: center;
		align-items: center;
		height: 35px;
		width: fit-content;
		margin-right: 5px;
		padding: 0 8px;
		color: #fff;
		background: #47cf73;
		border-radius: 15px;
		/* cursor: pointer; */
	}
	:global(.tag2) {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 2.25rem; /* Corresponds to h-9 in Tailwind */
		margin-right: 0.25rem; /* Corresponds to mr-1 in Tailwind */
		padding: 0.5rem; /* Corresponds to p-2 in Tailwind */
		color: white; /* Corresponds to text-white in Tailwind */
		border-radius: 0.375rem; /* Corresponds to rounded-md in Tailwind */
		background-color: #93c5fd; /* Corresponds to bg-blue-300 in Tailwind */
		background-color: rgb(var(--COLORBLE));
		width: fit-content; /* Corresponds to w-fit in Tailwind */
	}
	:global(.tag-close) {
		display: inline-block;
		margin-left: 1px; /* Transition to 20px in script */
		transition: 0.2s all;
		user-select: none;
		overflow: hidden;
		cursor: pointer;
	}
</style>

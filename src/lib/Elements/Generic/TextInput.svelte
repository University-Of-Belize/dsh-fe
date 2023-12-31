<svelte:options accessors />

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined =
		undefined; // Optional
	export let name: string; // Required
	export let placeholder: string; // Required
	export let custom_style: string | undefined = '';
	export let container_style: string = '';
	export let value: string = '';
	export let required: boolean = false; // Optional
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot type here.'; // Optional
	let class_: string | undefined = '';
	export { class_ as class };

	let inputBox: HTMLInputElement;
	const dispatch = createEventDispatcher();

	function handleInput(event: Event) {
		dispatch('input', event?.target?.value);
	}
	function handleKeyDown(event: Event) {
		value = inputBox.value;
		dispatch('keydown', event);
	}
</script>

<div
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	style={container_style}
	class="textinput_generic flex-1 flex mt-2 rounded-sm bg-COLORBLK2 px-4 py-2 items-center text-sm border border-COLORWHT aria-disabled:opacity-40 aria-disabled:cursor-not-allowed {custom_style}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.25x" class="text-COLORWHT pr-4" />
	</div>
	<input
		bind:this={inputBox}
		on:keydown={handleKeyDown}
		on:input={handleInput}
		{value}
		type="text"
		{name}
		class="w-full font-medium focus:outline-none text-COLORWHT py-1 px-2 bg-transparent disabled:text-COLORWHT5 disabled:cursor-not-allowed {class_}"
		{placeholder}
		{required}
		{disabled}
	/>
</div>

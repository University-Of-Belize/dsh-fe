<svelte:options accessors />

<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined =
		undefined; // Optional
	export let name: string; // Required
	export let placeholder: string; // Required
	export let custom_style: string | undefined = '';
	export let container_style: string = '';
	export let value: string = '';
	export let autocomplete: string | undefined = 'current-password';
	export let type: 'text' | 'email' | 'password' | 'color' = 'text';
	export let required: boolean = false; // Optional
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot type here.'; // Optional
	let class_: string | undefined = '';
	export { class_ as class };

	let inputBox: Input;
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
	class="textinput_generic mt-2 flex flex-1 items-center rounded-sm border border-COLORWHT bg-COLORBLK2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-40 {custom_style}"
>
	<!-- <div class="icon w-fit">
		<Fa {icon} size="1.25x" class="pr-4 text-COLORWHT" />
	</div>
	<input
		bind:this={inputBox}
		on:keydown={handleKeyDown}
		on:input={handleInput}
		{value}
		{type}
		{name}
		class="w-full border-0 bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none active:outline-none disabled:cursor-not-allowed disabled:text-COLORWHT5 {class_}"
		{placeholder}
		{required}
		{disabled}
	/> -->

	<Input
		bind:this={inputBox}
		on:keydown={handleKeyDown}
		on:input={handleInput}
		{value}
		{type}
		{name}
		{placeholder}
		{required}
		{disabled}
		{autocomplete}
		class="border-0 bg-transparent text-COLORWHT outline-none focus:border-0 focus:outline-0 focus:ring-0 disabled:cursor-not-allowed disabled:text-COLORWHT5 {class_}"
	>
		<Fa {icon} slot="left" size="0.75x" class="px-1 text-COLORWHT" />
	</Input>
</div>

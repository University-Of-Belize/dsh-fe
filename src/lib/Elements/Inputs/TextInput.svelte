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
	export let type: 'text' | 'email' | 'password' | 'color' | 'number' = 'text';
	export let max: string | undefined;
	export let min: string | undefined;
	export let step: string | undefined;
	export let required: boolean = false; // Optional
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot type here.'; // Optional
	let class_: string | undefined = '';
	export { class_ as class };

	let inputBox: Input;
	const dispatch = createEventDispatcher();

	function handleInput(event: Event) {
		value = event?.target?.value;
		dispatch('input', event?.target?.value);
	}
	function handleKeyDown(event: Event) {
		dispatch('keydown', event);
	}
	function handleKeyDownWithTarget(event: Event) {
		dispatch('keydown_target', [event, event.target]);
	}
</script>

<span class="hidden h-full"></span>
<div
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	style={container_style}
	class="textinput_generic mt-2 flex flex-1 items-center rounded-md border border-COLORLIGHT-100 bg-COLORDARK-50 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-40 {custom_style}"
>
	<!-- <div class="icon w-fit">
		<Fa {icon} size="1.25x" class="pr-4 text-COLORLIGHT-100" />
	</div>
	<input
		bind:this={inputBox}
		on:keydown={handleKeyDown}
		on:input={handleInput}
		{value}
		{type}
		{name}
                {max}
                {min}
		class="w-full border-0 bg-transparent px-2 py-1 font-medium text-COLORLIGHT-100 focus:outline-none active:outline-none disabled:cursor-not-allowed disabled:text-COLORLIGHT-100 {class_}"
		{placeholder}
		{required}
		{disabled}
	/> -->

	<Input
		bind:this={inputBox}
		on:keydown={handleKeyDown}
		on:keydown={handleKeyDownWithTarget}
		on:input={handleInput}
		{value}
		{type}
		{max}
		{min}
		{step}
		{name}
		{placeholder}
		{required}
		{disabled}
		{autocomplete}
		class="border-0 bg-transparent text-COLORLIGHT-100 outline-none placeholder:text-COLORLIGHT-50 focus:border-0 focus:outline-0 focus:ring-0 disabled:cursor-not-allowed disabled:text-COLORLIGHT-100 {class_}"
	>
		<Fa {icon} slot="left" size="0.75x" class="px-1 text-COLORLIGHT-100" />
	</Input>
</div>

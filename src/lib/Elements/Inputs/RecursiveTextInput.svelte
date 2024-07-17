<svelte:options accessors />

<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined =
		undefined;
	export let name: string;
	export let placeholder: string;
	export let custom_style: string | undefined = '';
	export let container_style: string = '';
	export let value: string = '';
	export let autocomplete: string | undefined = 'current-password';
	export let type: 'text' | 'email' | 'password' | 'color' | 'number' = 'text';
	export let max: string | undefined;
	export let min: string | undefined;
	export let step: string | undefined;
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let disabled_text: string = 'You cannot type here.';
	export let auto_disable: boolean = false;
	let class_: string | undefined = '';
	export { class_ as class };
	let debounceTimeoutBox: NodeJS.Timeout; // Timeout for inputBox
	let debounceTimeoutSlave: NodeJS.Timeout; // Timeout for inputSlave
	let inputBox: Input;
	let inputSlave: Input;
	const dispatch = createEventDispatcher();
	export const TimeOut: number = 4500;

	function handleInput(event: Event, input: Input) {
		dispatch('input', event?.target?.value ?? event?.detail);
		if (auto_disable) {
			auto_disabled(input);
		}
	}

	function handleKeyDown(event: Event) {
		value = inputBox.value;
		dispatch('keydown', event);
	}

	function auto_disabled(input: Input) {
		let debounceTimeout = input === inputBox ? debounceTimeoutBox : debounceTimeoutSlave;
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			input.disabled = true;
		}, TimeOut);
		if (input === inputBox) {
			debounceTimeoutBox = debounceTimeout;
		} else {
			debounceTimeoutSlave = debounceTimeout;
		}
	}
</script>

<span class="hidden h-full"></span>
<div
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	style={container_style}
	class="textinput_generic mt-2 flex flex-1 items-center rounded-md border border-COLORWHT bg-COLORBLK2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-40 {custom_style}"
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
                {max}
                {min}
		class="w-full border-0 bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none active:outline-none disabled:cursor-not-allowed disabled:text-COLORWHT5 {class_}"
		{placeholder}
		{required}
		{disabled}
	/> -->

	<Input
		bind:this={inputBox}
		on:keydown={handleKeyDown}
		on:input={(e) => handleInput(e, inputBox)}
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
		class="border-0 bg-transparent text-COLORWHT outline-none placeholder:text-COLORWHT3 focus:border-0 focus:outline-0 focus:ring-0 disabled:cursor-not-allowed disabled:text-COLORWHT5 {class_}"
	>
		<Fa {icon} slot="left" size="0.75x" class="px-1 text-COLORWHT" />
	</Input>
</div>
{#if value.trim() !== ''}
	<svelte:self
		bind:this={inputSlave}
		on:keydown={handleKeyDown}
		on:input={(e) => handleInput(e, inputSlave)}
		{type}
		{max}
		{min}
		{step}
		{name}
		{placeholder}
	/>
{/if}

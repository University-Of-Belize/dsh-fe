<script lang="ts">
	import { faChevronDown, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	const dispatch = createEventDispatcher();
	let form: HTMLFormElement;

	export let options: string[] = [];
	export let name: string | undefined;
	export let icon: IconDefinition;
	export let selectedOption: string = '';
	export let value: string = '';
	export let placeholder = '';
	export let toUrl: string;

	function handleChange(event: Event) {
		dispatch('change', event?.target?.value);
	}
</script>

<form action={toUrl} bind:this={form}>
	<div
		class="select flex-1 flex rounded-sm bg-COLORWHT1 px-4 py-2 mx-8 items-center text-sm bg-opacity-90 justify-between w-full hover:bg-opacity-80 cursor-pointer text-COLORBLK select-none"
	>
		<div class="icon w-fit">
			<Fa {icon} size="1.01x" class="pr-4" />
		</div>
		<select
			{name}
			class="block appearance-none w-full bg-transparent px-4 py-2 pr-8 rounded leading-tight focus:outline-none"
			value={value ?? selectedOption}
			on:change={handleChange}
		>
			{#if placeholder}
				<option value="" disabled selected>{@html placeholder}</option>
			{/if}
			{#each options as option}
				<option value={option}>{option}</option>
			{/each}
		</select>
		<div class="icon w-fit">
			<Fa icon={faChevronDown} size="0.75x" />
		</div>
	</div>
</form>

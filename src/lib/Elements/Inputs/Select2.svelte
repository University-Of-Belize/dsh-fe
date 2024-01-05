<script lang="ts">
	import type { Category } from '$lib/types/Category';
	import { faChevronDown, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	const dispatch = createEventDispatcher();

	export let options: Category[] = [];
	export let name: string | undefined;
	export let icon: IconDefinition;
	export let value: string = '';
	export let placeholder = '';
	export let custom_style = '';

	function handleChange(event: Event) {
		dispatch('change', event?.target?.value);
	}
</script>

<div
	class="select flex w-full flex-1 cursor-pointer select-none items-center justify-between rounded-sm bg-COLORWHT bg-opacity-90 px-4 py-2 text-sm text-COLORWHT hover:bg-opacity-80 {custom_style}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.01x" class="pr-4" />
	</div>
	<select
		{name}
		class="block w-full appearance-none rounded bg-transparent px-4 py-2 pr-8 leading-tight focus:outline-none"
		{value}
		on:change={handleChange}
	>
		{#if placeholder}
			<option value="placeholder" disabled selected>{@html placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option._id ?? option}>{option.name ?? option}</option>
		{/each}
	</select>
	<div class="icon w-fit">
		<Fa icon={faChevronDown} size="0.75x" />
	</div>
</div>

<script lang="ts">
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
		class="select mx-8 flex w-full flex-1 cursor-pointer select-none items-center justify-between rounded-sm bg-COLORLIGHT-100 bg-opacity-90 px-4 py-2 text-sm text-COLORLIGHT-100 hover:bg-opacity-80"
	>
		<div class="icon w-fit">
			<Fa {icon} size="1.01x" class="pr-4" />
		</div>
		<select
			{name}
			class="block w-full appearance-none rounded bg-transparent px-4 py-2 pr-8 leading-tight focus:outline-none"
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
	</div>
</form>

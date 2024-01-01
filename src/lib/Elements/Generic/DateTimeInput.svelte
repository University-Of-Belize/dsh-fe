<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition; // Required
	export let name: string; // Required
	export let placeholder: string; // Required
	export let custom_style: string | undefined = '';
	export let value: string | undefined = '';
	export let disabled: boolean; // Optional
	export let disabled_text: string = 'You cannot type here.'; // Optional

	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
		dispatch('input', event?.target?.value);
	}
</script>

<div
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	class="username mt-2 flex flex-1 items-center rounded-sm border border-COLORWHT bg-COLORWHT5 px-4 py-2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-40 {custom_style}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.25x" class="pr-4 text-COLORWHT" />
	</div>
	<input
		on:input={handleChange}
		{value}
		type="datetime-local"
		{name}
		class="w-full bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none disabled:cursor-not-allowed disabled:text-COLORWHT"
		{placeholder}
		{disabled}
	/>
</div>

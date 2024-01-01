<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition; // Required
	export let name: string; // Required
	export let placeholder: string; // Required
	export let custom_style: string | undefined = '';
	export let value: string | undefined = '';

	const dispatch = createEventDispatcher();

	function handleChange(event: Event) {
		dispatch('input', event?.target?.value);
	}
</script>

<div
	class="username mt-2 flex flex-1 items-center rounded-sm border border-COLORWHT bg-COLORWHT5 px-4 py-2 text-sm {custom_style}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.25x" class="pr-4 text-COLORWHT" />
	</div>
	<input
		on:input={handleChange}
		{value}
		type="date"
		{name}
		class="w-full bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none"
		{placeholder}
	/>
</div>

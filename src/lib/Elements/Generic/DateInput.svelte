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
	class="username flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 items-center text-sm border border-COLORBLK {custom_style}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.25x" class="text-COLORBLK pr-4" />
	</div>
	<input
		on:input={handleChange}
		{value}
		type="date"
		{name}
		class="w-full font-medium focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
		{placeholder}
	/>
</div>

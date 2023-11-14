<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	const dispatch = createEventDispatcher();
	export let toUrl: string;
	export let placeholder: string;
	export let otherParams: string[];
	export let value: string = '';
	let form: HTMLFormElement;

	function handleChange(event: Event) {
		dispatch('input', event.target?.value);
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set('search', event.target?.value);
		otherParams.forEach((param) => {
			if (urlParams.has(param)) {
				urlParams.set(param, urlParams.get(param) ?? '');
			}
		});
		window.history.replaceState({}, '', '?' + urlParams.toString());
	}
</script>

<form
	bind:this={form}
	class="searchbar flex-1 flex rounded-sm bg-COLORWHT1 px-4 py-2 mx-8 items-center text-sm bg-opacity-90"
	on:input={handleChange}
	action={toUrl ?? '/product'}
>
	<div class="searchicon w-fit">
		<Fa icon={faSearch} size="1.01x" class="text-COLORBLK pr-4" />
	</div>
	<input
		{value}
		type="text"
		name="search"
		class="w-full font-regular focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
		placeholder={placeholder ?? 'Search for something else?'}
	/>
</form>

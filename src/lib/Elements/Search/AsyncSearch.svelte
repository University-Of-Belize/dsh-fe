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
	class="searchbar mx-8 flex flex-1 items-center rounded-sm bg-COLORLIGHT-100 bg-opacity-90 px-4 py-2 text-sm"
	on:input={handleChange}
	action={toUrl ?? '/product'}
>
	<div class="searchicon w-fit">
		<Fa icon={faSearch} size="1.01x" class="pr-4 text-COLORLIGHT-100" />
	</div>
	<input
		value={value ?? ''}
		type="text"
		name="search"
		class="font-regular w-full bg-transparent px-2 py-1 text-COLORLIGHT-100 focus:outline-none"
		placeholder={placeholder ?? 'Search for something else?'}
	/>
</form>

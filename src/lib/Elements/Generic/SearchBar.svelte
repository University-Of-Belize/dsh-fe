<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let toUrl: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
</script>

<form
	class="searchbar flex-1 flex rounded-sm bg-COLORWHT1 px-4 py-2 mx-8 items-center text-sm bg-opacity-90"
	action={toUrl ?? '/product'}
>
	<div class="searchicon w-fit">
		<Fa icon={faSearch} size="1.01x" class="text-COLORBLK pr-4" />
	</div>
	<input
		type="text"
		name="search"
		class="w-full font-regular focus:outline-none text-COLORBLK py-1 px-2 bg-transparent"
		placeholder={placeholder ?? 'Search for something else?'}
	/>
</form>

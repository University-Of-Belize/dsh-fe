<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let toUrl: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let nomargin: boolean | undefined = undefined;
</script>

{#if !nomargin}
	<form
		class="searchbar mx-8 flex flex-1 items-center rounded-sm border border-COLORWHT5 bg-COLORBLK bg-opacity-90 px-4 py-2 text-sm focus:bg-COLORBLK1 active:bg-COLORBLK1"
		action={toUrl ?? '/product'}
	>
		<div class="searchicon w-fit">
			<Fa icon={faSearch} size="1.01x" class="pr-4 text-COLORWHT" />
		</div>
		<input
			type="text"
			name="search"
			class="font-regular w-full bg-transparent px-2 py-1 text-COLORWHT focus:outline-none"
			placeholder={placeholder ?? 'Search for something else?'}
		/>
	</form>
{:else}
	<form
		class="searchbar flex flex-1 items-center rounded-sm border border-COLORWHT5 bg-COLORBLK bg-opacity-90 px-4 py-2 text-sm focus:bg-COLORBLK1 active:bg-COLORBLK1"
		action={toUrl ?? '/product'}
	>
		<div class="searchicon w-fit">
			<Fa icon={faSearch} size="1.01x" class="pr-4 text-COLORWHT" />
		</div>
		<input
			type="text"
			name="search"
			class="font-regular w-full bg-transparent px-2 py-1 text-COLORWHT focus:outline-none"
			placeholder={placeholder ?? 'Search for something else?'}
		/>
	</form>
{/if}

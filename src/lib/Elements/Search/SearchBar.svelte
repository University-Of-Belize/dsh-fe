<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let toUrl: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let nomargin: boolean | undefined = undefined;
	let class_: string = '';
	export { class_ as class };
</script>

<span class="stub block inline flex hidden lg:hidden"></span>
{#if !nomargin}
	<form
		class="searchbar mx-8 flex flex-1 items-center rounded-sm border border-COLORLIGHT-100 bg-COLORDARK-100 bg-opacity-90 px-4 py-2 text-sm focus:bg-COLORDARK-75 active:bg-COLORDARK-75 {class_}"
		action={toUrl ?? '/product'}
	>
		<div class="searchicon w-fit">
			<Fa icon={faSearch} size="1.01x" class="pr-4 text-COLORLIGHT-100" />
		</div>
		<input
			type="text"
			name="search"
			class="font-regular w-full border-0 bg-transparent px-2 py-1 text-COLORLIGHT-100 outline-0 focus:border-0 focus:shadow-none focus:outline-none active:border-0 active:shadow-none active:outline-0 active:ring-0"
			placeholder={placeholder ?? 'Search for something else?'}
		/>
	</form>
{:else}
	<form
		class="searchbar flex flex-1 items-center rounded-sm border border-COLORLIGHT-100 bg-COLORDARK-100 bg-opacity-90 px-4 py-2 text-sm focus:bg-COLORDARK-75 active:bg-COLORDARK-75"
		action={toUrl ?? '/product'}
	>
		<div class="searchicon w-fit">
			<Fa icon={faSearch} size="1.01x" class="pr-4 text-COLORLIGHT-100" />
		</div>
		<input
			type="text"
			name="search"
			class="font-regular w-full border-0 bg-transparent px-2 py-1 text-COLORLIGHT-100 outline-0 focus:border-0 focus:shadow-none focus:outline-none active:border-0 active:shadow-none active:outline-0 active:ring-0"
			placeholder={placeholder ?? 'Search for something else?'}
		/>
	</form>
{/if}

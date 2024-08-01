<script lang="ts">
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let toUrl: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let nomargin: boolean | undefined = undefined;
	export let value: string | undefined = "";
	export let transparency: number = 0;
	let class_: string = '';
	export { class_ as class };
</script>

<span class="stub block inline flex hidden lg:hidden"></span>
{#if !nomargin}
	<form action={toUrl ?? '/product'} method="GET" class="mx-4 hidden w-full lg:block">
		<label for="topbar-search" class="sr-only">Search</label>
		<div class="relative w-full">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Fa icon={faSearch} class="mr-4 text-COLORLIGHT-100" />
			</div>
			<input
				{value}
				type="text"
				name="search"
				title="Click to search for snacks, drinks and lunch"
				id="topbar-search"
				class="bg-opacity-{transparency +
					35} block w-full rounded-lg border-0 bg-COLORDARK-75 p-1.5 pl-9 text-xs font-light text-COLORLIGHT-100 placeholder-COLORLIGHT-100 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm {class_}"
				placeholder={placeholder ?? 'Search for something else?'}
			/>
		</div>
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

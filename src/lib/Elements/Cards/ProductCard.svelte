<script lang="ts">
	export let url: string;
	export let image: string;
	export let name: string;
	export let description: string;
	export let error_text: string;
	export let no_forward: boolean = false;

	import config from '$lib/config/index';
</script>

<div class="item flex flex-col gap-4 overflow-hidden py-4 lg:p-10 transition-all ease-in-out">
	<div
		class="imageHolder flex w-full items-center justify-center overflow-hidden rounded-md bg-COLORACCENTL"
		style="height: 200px"
	>
		<a aria-label="Visit the link for '{name}'" href={url}>
			<img
				class="duration-200 hover:scale-95"
				src={image ?? config['product-showcase']['default-image']}
				alt="Picture showing the item '{name}'"
				width="250px"
			/></a
		>
	</div>
	<div class="itemName flex items-center justify-between gap-4">
		<a href={url}><h3>{@html name}</h3></a>
		<span>$458.23</span>
	</div>
	<div class="itemDesc text-sm"><p>{description}</p></div>
	{#if error_text}
		<p class="itemErr text-sm">{error_text}</p>
	{/if}

	{#if !no_forward}
		<a aria-label="Visit the link for '{name}'" href={url} class="py-4 text-sm font-semibold">
			<!-- <span>▷</span> -->
			<span class="underline">View page</span>
		</a>
	{/if}
</div>

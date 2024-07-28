<script lang="ts">
	export let url: string;
	export let image: string;
	export let name: string;
	export let description: string;
	export let error_text: string;
	export let no_forward: boolean = false;

	import config from '$lib/config/index';
</script>

<div class="my-10 grid max-w-md">
	<div class="invisible mx-2 rounded-xl bg-gray-100"></div>
	<div
		class="cursor group mx-2 overflow-hidden rounded-2xl border border-COLORDARK-75 bg-COLORDARK-75 duration-200 hover:-translate-y-4 lg:mx-4"
	>
		<div class="flex h-60 flex-col justify-between overflow-hidden">
			<a aria-label="Visit the link for '{name}'" href={url}
				><img
					alt="Picture showing the data '{name}'"
					src={image ?? config['product-showcase']['default-image']}
					class="h-full w-full object-cover duration-200 group-hover:scale-110"
				/></a
			>
		</div>
		<div class="flex-1 overflow-hidden bg-COLORDARK-75 px-6 py-8">
			<a href={url}><h5 class="mb-4 text-xl font-bold">{@html name}</h5></a>
			<p class="mb-1 text-COLORLIGHT-15">{description}</p>
			{#if error_text}
				<p class="mb-8 text-rose-600">{error_text}</p>
			{/if}
			<div class="flex justify-between">
				{#if !no_forward}
					<a aria-label="Visit the link for '{name}'" href={url} class="group text-lg font-bold">
						<!-- <span>▷</span> -->
						<span class="underline">View page</span>
					</a>
				{/if}
			</div>
		</div>
	</div>
	<div class="invisible mx-2 rounded-xl bg-gray-100"></div>
</div>

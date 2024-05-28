<script lang="ts">
	export let url: string;
	export let image: string;
	export let name: string;
	export let description: string;

	import config from '$lib/config/settings';
</script>

<div class="my-10 grid max-w-md">
	<div class="mx-2 rounded-xl bg-gray-100"></div>
	<div
		class="cursor group mx-4 overflow-hidden rounded-2xl border border-COLORWHT duration-200 hover:-translate-y-4"
	>
		<div class="flex h-60 flex-col justify-between overflow-hidden">
			<img
				src={image ?? config['product-showcase']['default-image']}
				class="h-full w-full object-cover duration-200 group-hover:scale-110"
			/>
		</div>
		<div class="flex-1 overflow-hidden bg-white px-6 py-8">
			<a href={url}><h5 class="mb-4 text-xl font-bold group-hover:text-indigo-600">{@html name}</h5></a>
			<p class="mb-8 text-gray-600">{description}</p>
			<div class="flex justify-between">
				<a href={url} class="group text-lg font-bold hover:text-indigo-600 focus:text-indigo-600">
					<!-- <span>▷</span> -->
					<span class="underline">Visit page</span>
				</a>
			</div>
		</div>
	</div>
	<div class="mx-2 rounded-xl bg-gray-100"></div>
</div>

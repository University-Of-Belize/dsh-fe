<script lang="ts">
	import {
		addVariation,
		deleteCategoryVariation,
		deleteVariation
	} from '$lib/Elements/Utility/Variations';
	import type { VariationData } from '$lib/types/Variation';
	import { faSortAlphaAsc } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import TextInput from '../Inputs/TextInput.svelte';
	import { writable, type Writable } from 'svelte/store';
	let productVariations: Writable<VariationData> = writable() as Writable<VariationData>; // Variation data
	export { productVariations as variations };
	let debounceTimeout1: NodeJS.Timeout;
	let TextBoxVariations: TextInput;
</script>

<section class="space-y-2">
	{#each $productVariations[0] as $variation, vcat_index}
		<div class="mt-8" id={$variation._id}>
			<div class="mt-8 flex text-base">
				<span>{$variation.Name}</span>
				<span
					class="ml-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-COLORBLK p-3 text-sm font-light text-COLORWHT hover:opacity-80"
					on:click={async () => {
						const errored = await deleteCategoryVariation($variation._id);
						if (!errored) {
							// Remove the element
							$productVariations[0].splice(vcat_index, 1);
							document.getElementById($variation._id).remove();
						}
					}}>x</span
				>
			</div>
			<div class="mt-3 flex select-none flex-wrap items-center gap-1">
				{#each $productVariations[1] as v, variation_index}
					{#if v.VCategory_id.trim() === $variation._id.trim()}
						<div
							id={v._id}
							class="flex cursor-pointer items-center justify-center rounded-lg border border-black px-6 py-2 font-bold text-COLORWHT"
						>
							<span>{v.Name}</span>
							<span
								class="ml-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-COLORBLK p-3 text-sm font-light text-COLORWHT hover:opacity-80"
								on:click={async () => {
									const errored = await deleteVariation(v._id);
									if (!errored) {
										toast.push(`You have deleted the variation '${v.Name}'.`);
										// Remove the element
										$productVariations[1].splice(variation_index, 1);
										document.getElementById(v._id).remove();
									}
								}}>x</span
							>
						</div>
					{/if}
				{/each}
			</div>

			<TextInput
				on:keydown_target={async (e) => {
					const target = e.detail[1];
					if (e.detail[0].key === 'Enter' && target.value.trim() !== '') {
						const json = await addVariation(target.value.trim() ?? '', $variation._id);
						if (json) {
							$productVariations[1].push(json);
							$productVariations = $productVariations;
							target.value = '';
						}
					}
				}}
				bind:this={TextBoxVariations}
				required
				icon={faSortAlphaAsc}
				name="name"
				placeholder="Enter variation category name and press enter"
				custom_style="bg-transparent"
			/>
		</div>
	{/each}
</section>

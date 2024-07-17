<script lang="ts">
	import {
		addVariation,
		deleteCategoryVariation,
		deleteVariation
	} from '$lib/Elements/Utility/Variations';
	import type { VariationData } from '$lib/types/Variation';
	import { faSortAlphaAsc } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import RecursiveTextInput from '../Inputs/RecursiveTextInput.svelte';
	let productVariations: VariationData;
	export { productVariations as variations };
	let debounceTimeout1: NodeJS.Timeout;
	let recursiveTextBoxVariations: RecursiveTextInput;
</script>

<section class="space-y-2">
	{#each productVariations[0] as $variation, vcat_index}
		<div class="mt-8" id={$variation._id}>
			<div class="mt-8 flex text-base">
				<span>{$variation.Name}</span>
				<span
					class="ml-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-COLORBLK p-3 text-sm font-light text-COLORWHT hover:opacity-80"
					on:click={async () => {
						const errored = await deleteCategoryVariation($variation._id);
						if (!errored) {
							// Remove the element
							productVariations[0].splice(vcat_index, 1);
							document.getElementById($variation._id).remove();
						}
					}}>x</span
				>
			</div>
			<div class="mt-3 flex select-none flex-wrap items-center gap-1">
				{#each productVariations[1] as v, variation_index}
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
										productVariations[1].splice(variation_index, 1);
										document.getElementById(v._id).remove();
									}
								}}>x</span
							>
						</div>
					{/if}
				{/each}
			</div>

			<RecursiveTextInput
				on:input={(e) => {
					// console.log(e.detail)
					clearTimeout(debounceTimeout1);
					debounceTimeout1 = setTimeout(() => {
						addVariation(e.detail, variation._id);
						// productVariations[1].push({
						//     _id: Math.random().toString(36).substring(7),
						//     Name: e.detail,
						//     VCategory_id: variation
						// });
						// variation_input.value = '';
                        recursiveTextBoxVariations.disabled = true;
					}, recursiveTextBoxVariations.TimeOut);
				}}
				bind:this={recursiveTextBoxVariations}
				required
				auto_disable
				icon={faSortAlphaAsc}
				name="name"
				placeholder="Enter variation category name and press enter"
				custom_style="bg-transparent"
			/>
		</div>
	{/each}
</section>

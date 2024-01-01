<script lang="ts">
	import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { Product } from '$lib/types/Product.ts';
	export let reviews: Product['reviews'] = [];
	function calculateRating(reviews: Product['reviews'][], count: boolean = false) {
		let sum = 0;
		let index = 0;
		reviews.forEach((review, i) => {
			// @ts-ignore
			sum += review.rating;
			index = i;
		});
		const result = (sum / reviews.length).toFixed(2);
		// console.log(Number.isNaN(parseFloat(result)));
		if (Number.isNaN(parseFloat(result))) return 'No reviews yet';
		return count ? index : result; // I know this is bad and unscalable, but I'm lazy
	}
</script>

<div class="flex items-center justify-start text-lg text-COLORYLW">
	<!-- Don't ask. It's copilot-->
	<div class="rating-as-text mt-1 pr-2">
		{calculateRating(reviews)}
	</div>
	{#each Array.from({ length: 5 }, (_, i) => i) as _}
		{#if _ < Math.floor(calculateRating(reviews))}
			<Fa icon={faStar} size="1x" />
		{:else if _ === Math.floor(calculateRating(reviews)) && calculateRating(reviews) % 1 >= 0.5}
			<Fa icon={faStarHalfAlt} size="1x" />
		{:else}
			<Fa icon={faStar} size="1x" class="opacity-25" />
		{/if}
	{/each}
</div>

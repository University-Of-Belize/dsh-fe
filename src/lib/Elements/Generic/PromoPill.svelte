<script lang="ts">
	import type { Promo } from '$lib/types/Promo';
	import { faTag } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { getDate } from '../Utility/time';
	export let promo: Promo;
	export let description: string;
</script>

<!-- Color stub -->
<div
	class="placeholder bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORBLK bg-COLORYLW bg-COLORBYW bg-COLORPNK bg-COLORRED hidden w-full"
>
	&nbsp;
</div>

<div class="review my-4 bg-COLORWHT3 bg-opacity-50 px-4 py-2 rounded-md">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<Fa icon={faTag} size="3x" class="text-COLORBLK" />
		</div>
		<div class="user-wrap flex flex-wrap items-center w-full">
			<div class="review-content text-COLORBLK" style="word-break: break-word;">
				<div class="text-base lg:text-lg font-semibold flex items-center">
					{promo.description ? promo.description : 'Untitled Promotion'}
				</div>
				<div class="text-sm lg:text-base font-light flex items-center text-COLORBLK opacity-75">
					{promo.expiry_date ? `Expires: ${getDate(promo.expiry_date)}` : 'Unset expiry date'}
				</div>
				<div class="text-sm font-light text-COLORBLE">
					{@html description}
				</div>
			</div>
			<div class="actions flex items-center justify-start lg:justify-end flex-1 text-COLORBLK">
				<slot />
			</div>
		</div>
	</div>
	<slot name="alias" />
</div>

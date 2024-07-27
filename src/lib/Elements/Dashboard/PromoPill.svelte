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
	class="placeholder hidden w-full bg-COLORACCENTL bg-COLORACCENTL bg-COLORACCENTL bg-COLORLIGHT-100 bg-COLORLIGHT-100 bg-COLORWHT2 bg-COLORLIGHT-50 bg-COLORACCENTL"
>
	&nbsp;
</div>

<div class="review my-4 rounded-md bg-COLORDARK-75 bg-opacity-50 px-4 py-2">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<Fa icon={faTag} size="3x" class="text-COLORLIGHT-100" />
		</div>
		<div class="user-wrap flex w-full flex-wrap items-center">
			<div class="promo-content text-COLORLIGHT-100" style="word-break: break-word;">
				<div class="flex items-center text-base font-semibold lg:text-lg">
					{promo.description ? promo.description : 'Untitled Promotion'}
				</div>
				<div class="flex items-center text-sm font-light text-COLORLIGHT-15 lg:text-base">
					{promo.expiry_date ? `Expires: ${getDate(promo.expiry_date)}` : 'Unset expiry date'}
				</div>
				<div class="text-sm font-light text-COLORLIGHT-75">
					{@html description}
				</div>
			</div>
			<div class="actions flex flex-1 items-center justify-start text-COLORLIGHT-100 lg:justify-end">
				<slot />
			</div>
		</div>
	</div>
	<slot name="alias" />
</div>

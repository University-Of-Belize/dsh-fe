<svelte:options accessors />

<script lang="ts">
	import { escapeHtml } from '$lib/Elements/Utility/Review';
	import config from '$lib/config/settings';
	import { faPencil } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let user: import('$lib/types/User').User;
	export let placeholder: string | undefined = undefined;
	export let value: string = '';
	export let textOnly: boolean = false;
	export let unsanitized: boolean = false;
	let newReviewContent: HTMLDivElement;
	let placeholderRemoved = false;

	const dispatch = createEventDispatcher();

	function handleInput(event: Event) {
		value = unsanitized
			? textOnly
				? newReviewContent.innerText
				: newReviewContent.innerHTML
			: escapeHtml(textOnly ? newReviewContent.innerText : newReviewContent.innerHTML);
		dispatch(
			'input',
			unsanitized
				? textOnly
					? newReviewContent.innerText
					: newReviewContent.innerHTML
				: escapeHtml(textOnly ? newReviewContent.innerText : newReviewContent.innerHTML)
		);
	}

	export function clear() {
		newReviewContent.innerHTML = '';
	}
</script>

<div class="review my-4 rounded-md bg-transparent px-4 py-2">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<img
				class="rounded-md object-cover"
				src={user?.profile_picture ?? config['user']['default-image']}
				alt="{user?.username}'s avatar"
				on:error={() => {
					user.profile_picture = config['user']['default-image'];
				}}
				style="width: 50px; height: 50px;"
			/>
		</div>
		<div class="review-content h-full w-full rounded-md px-1 py-1 text-COLORWHT">
			<div class="review-wrap mb-4 rounded-md border border-COLORBLE">
				<div class="text-i-combo flex items-center justify-start font-semibold text-COLORGRY">
					<div class="icon px-2 py-2"><Fa icon={faPencil} size="1.01x" /></div>
					{placeholder ?? 'Write a review...'}
				</div>
				<div
					bind:this={newReviewContent}
					on:input={(e) => {
						if (!placeholderRemoved) {
							newReviewContent.innerHTML = '';
							placeholderRemoved = true;
						}
						handleInput(e);
					}}
					class="text-md mx-6 h-full w-full cursor-text bg-transparent px-2 py-1 font-light text-COLORGRN focus:outline-none"
					contenteditable="true"
				>
					<div class="select-none text-COLORWHT1" contenteditable="false">What's on your mind?</div>
					<div contenteditable="true">&nbsp;</div>
				</div>
			</div>
		</div>
	</div>
</div>

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
	let newReviewContent: HTMLDivElement;
	let placeholderRemoved = false;

	const dispatch = createEventDispatcher();

	function handleInput(event: Event) {
		value = escapeHtml(textOnly ? newReviewContent.innerText : newReviewContent.innerHTML);
		dispatch(
			'input',
			escapeHtml(textOnly ? newReviewContent.innerText : newReviewContent.innerHTML)
		);
	}

	export function clear() {
		newReviewContent.innerHTML = '';
	}
</script>

<div class="review my-4 bg-transparent px-4 py-2 rounded-md">
	<div class="flex bg-opacity-100">
		<div class="reviewer-pfp flex flex-col items-center justify-start pr-4">
			<img
				class="rounded-md"
				src={user.profile_picture || config['user']['default-image']}
				alt="{user.username}'s avatar"
				on:error={() => {
					user.profile_picture = config['user']['default-image'];
				}}
				style="width: 50px; height: 50px;"
			/>
		</div>
		<div class="review-content text-COLORWHT w-full h-full px-1 py-1 rounded-md">
			<div class="review-wrap border border-COLORBLE rounded-md mb-4">
				<div class="text-i-combo flex font-semibold items-center justify-start text-COLORGRY">
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
					class="text-md font-light text-COLORGRN h-full w-full px-2 py-1 mx-6 bg-transparent focus:outline-none cursor-text"
					contenteditable="true"
				>
					<div class="select-none text-COLORWHT1" contenteditable="false">What's on your mind?</div>
					<div contenteditable="true">&nbsp;</div>
				</div>
			</div>
		</div>
	</div>
</div>

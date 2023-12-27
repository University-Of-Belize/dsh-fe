<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	// export let image: string;
	export let title: string;
	export let subtitle: string = '';
	export let body: string;
	export let body_optional: string = '';
	export let button_text: string;
	export let where_to: string;
	// export let image_alt: string = "No image alt provided";
	export let button_icon: IconDefinition;
	export let button_color: string = 'COLORBLK4';
	export let button_text_color: string = 'COLORWHT';
	export let button_reloads: boolean = false;
</script>

<div class="card-picker flex flex-wrap w-full my-4">
	<!-- <div class="m-1 flex-1">
        <div class="flex w-full border border-gray-300 rounded-md overflow-hidden">
            <img src={image} alt={image_alt} class="w-full object-cover" />
        </div>
    </div> -->

	<div
		class="flex-1 basis-full lg:basis-0 border border-COLORHPK bg-COLORBLK1 text-COLORWHT rounded-md overflow-hidden lg:mx-1 p-6"
	>
		<div class="font-semibold text-xl mb-6">
			{@html title}

			<div class="text-COLORWHT2 mb-6 text-sm">
				{@html subtitle}
			</div>
			<div class="text-COLORWHT2 text-xl mb-6">
				{@html body}
			</div>
			<div class="text-COLORWHT2 text-lg font-normal mb-6">
				{@html body_optional}
			</div>

			<div
				class="btn_wrp"
				on:click={() => {
					goto(where_to);
					if (button_reloads) {
						setTimeout(() => {
							window.location.reload();
						}, 500);
					}
				}}
			>
				<Button
					icon={button_icon}
					color={button_color}
					color_t={button_text_color}
					text={button_text}
				/>
			</div>
		</div>
	</div>
</div>

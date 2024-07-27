<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
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
	export let button_color: string = 'COLORDARK-15';
	export let button_text_color: string = 'COLORLIGHT-100';
	export let button_reloads: boolean = false;
</script>

<div class="card-picker my-4 flex w-full flex-wrap">
	<!-- <div class="m-1 flex-1">
        <div class="flex w-full border border-gray-300 rounded-md overflow-hidden">
            <img src={image} alt={image_alt} class="w-full object-cover" />
        </div>
    </div> -->

	<div
		class="flex-1 basis-full overflow-hidden rounded-md border border-COLORACCENTL bg-COLORDARK-75 p-6 text-COLORLIGHT-100 lg:mx-1 lg:basis-0"
	>
		<div class="mb-6 text-xl font-semibold">
			{@html title}

			<div class="mb-6 text-sm text-COLORWHT2">
				{@html subtitle}
			</div>
			<div class="mb-6 text-xl text-COLORWHT2">
				{@html body}
			</div>
			<div class="mb-6 text-lg font-normal text-COLORWHT2">
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

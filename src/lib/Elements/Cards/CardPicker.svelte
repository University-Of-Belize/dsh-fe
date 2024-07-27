<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	export let image: string;
	export let title: string;
	export let subtitle: string = '';
	export let body: string;
	export let button_text: string;
	export let where_to: string;
	export let image_alt: string = 'No image alt provided';
	export let button_icon: IconDefinition;
	export let button_color: string = 'COLORLIGHT-100';
	export let button_text_color: string = 'COLORLIGHT-100';
</script>

<div class="card-picker my-4 flex w-full flex-wrap">
	<div class="m-1 flex-1">
		<div class="flex w-full overflow-hidden rounded-md border border-COLORACCENTD">
			<img src={image} alt={image_alt} class="w-full object-cover" />
		</div>
	</div>

	<div
		class="flex-1 basis-full overflow-hidden rounded-md border border-COLORACCENTD p-6 text-COLORLIGHT-100 lg:mx-6 lg:basis-0"
	>
		<div class="mb-6 text-xl font-semibold">
			{title}

			<div class="mb-6 text-sm font-light text-COLORWHT2">
				{subtitle}
			</div>
			<div
				class="prose prose-neutral mb-6 block w-full max-w-full rounded-sm text-xl text-COLORLIGHT-100 prose-h1:text-COLORLIGHT-100 prose-h2:text-COLORWHT2 prose-h3:text-COLORLIGHT-50 prose-h4:text-COLORLIGHT-75 prose-h5:text-COLORLIGHT-100 prose-h6:text-COLORLIGHT-100 prose-a:text-COLORWHT2 prose-strong:text-COLORLIGHT-15 prose-code:text-COLORACCENTL prose-ol:text-COLORLIGHT-15 prose-ul:text-COLORWHT2 prose-li:text-COLORLIGHT-100"
			>
				{@html body}
			</div>

			<div class="btn_wrp" on:click={() => goto(where_to)}>
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

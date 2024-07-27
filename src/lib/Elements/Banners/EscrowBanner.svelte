<script lang="ts">
	import config from '$lib/config/settings';
	export let text: string;
	export let subtitle: string;
	export let branding_text: string = config.ui['branding-text'];
	export let html: boolean = false;
</script>

<div class="footer block w-full bg-COLORDARK-75 text-center text-COLORLIGHT-100">
	<div class="chunk-one flex items-center justify-center py-14">
		<div class="block">
			<div class="branding-text w-full items-center justify-center text-4xl font-semibold">
				{branding_text}
			</div>
			<div class="text text-xl font-light">{text}</div>
			<div class="text text-sm font-light">
				{#if html}
					{@html subtitle}
				{:else}
					{subtitle}
				{/if}
			</div>
			<div class="content flex w-full items-center justify-center">
				<slot />
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	export let text: string;
	export let subtitle: string;
	export let branding_text: string = 'Cafe';
</script>

<div class="footer block w-full bg-COLORBLK5 text-center text-COLORWHT">
	<div class="chunk-one flex items-center justify-center py-14">
		<div class="block">
			<div class="branding-text w-full items-center justify-center text-4xl font-semibold">
				{branding_text}
			</div>
			<div class="text text-xl font-light">{text}</div>
			<div class="text text-sm font-light">{subtitle}</div>
			<div class="content flex w-full items-center justify-center">
				<slot />
			</div>
		</div>
	</div>
</div>

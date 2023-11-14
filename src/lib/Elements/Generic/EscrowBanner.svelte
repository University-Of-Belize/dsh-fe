<script lang="ts">
	export let text: string;
	export let subtitle: string;
	export let branding_text: string = 'Cafe';
</script>

<div class="footer block text-center text-COLORBLK bg-COLORWHT w-full">
	<div class="chunk-one flex justify-center items-center py-14">
		<div class="block">
			<div class="branding-text w-full justify-center items-center font-semibold text-4xl">
				{branding_text}
			</div>
			<div class="text text-xl font-light">{text}</div>
			<div class="text text-sm font-light">{subtitle}</div>
			<div class="content flex w-full justify-center items-center">
				<slot />
			</div>
		</div>
	</div>
</div>

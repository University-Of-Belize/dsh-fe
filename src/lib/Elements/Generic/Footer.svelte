<script lang="ts">
	export let text: string;
	export let branding_text: string = "Cafe";
</script>

<div class="footer block text-center text-COLORBLK bg-COLORWHT">
	<div class="chunk-one flex justify-center items-center py-14">
		<div class="block">
			<div class="branding-text w-full justify-center items-center font-semibold text-4xl">
				{branding_text}
			</div>
			<div class="text text-xl font-bold">{text}</div>
			<div class="content flex w-full justify-center items-center">
				<slot />
			</div>
		</div>
	</div>
	<div class="chunk-two flex justify-start items-center text-2xl bg-COLORPNK text-white px-8 py-4">{branding_text}
	</div>
</div>

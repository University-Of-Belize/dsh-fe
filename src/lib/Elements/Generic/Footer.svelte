<script lang="ts">
	import config from '$lib/config/index';
	export let text: string;
	export let branding_text: string = config.ui['branding-text'];
</script>

<div class="footer block bg-COLORDARK-75 text-center text-COLORLIGHT-100">
	<div class="chunk-one flex items-center justify-center py-14">
		<div class="block">
			<div class="branding-text w-full items-center justify-center text-4xl font-semibold">
				{branding_text}
			</div>
			<div class="text text-xl font-bold">{text}</div>
			<div class="content flex w-full items-center justify-center">
				<slot />
			</div>
		</div>
	</div>
	<div class="chunk-two flex items-center justify-start bg-COLORACCENTL px-8 py-4 text-2xl text-white">
		{branding_text}
	</div>
</div>

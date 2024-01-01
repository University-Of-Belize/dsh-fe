<script lang="ts">
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined;
	export let color: string = 'COLORBLK4';
	export let color_t: string = 'COLORWHT';
	export let text: string;
	export let custom_style: string | undefined = '';
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot interact with this element.'; // Optional
	export let icon_on_sm: boolean = false; // Optional
</script>

<div
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	class="placeholder hidden w-full border-COLORBLE border-COLORHPK bg-COLORBLE bg-COLORBLK bg-COLORBLK1 bg-COLORBLK2 bg-COLORBLK3 bg-COLORBLK4 bg-COLORBLK5 bg-COLORBYW bg-COLORGRN bg-COLORGRN1 bg-COLORGRN2 bg-COLORHPK bg-COLORPNK bg-COLORRED bg-COLORWHT bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORYLW text-COLORBLE text-COLORBLK text-COLORBLK1 text-COLORBLK2 text-COLORBLK3 text-COLORBLK4 text-COLORBLK5 text-COLORBYW text-COLORGRN text-COLORGRN1 text-COLORGRN2 text-COLORHPK text-COLORHPK text-COLORPNK text-COLORRED text-COLORWHT text-COLORWHT text-COLORWHT2 text-COLORWHT3 text-COLORWHT4 text-COLORWHT5 text-COLORYLW aria-disabled:cursor-not-allowed aria-disabled:select-none aria-disabled:opacity-40"
>
	&nbsp;
</div>
<div
	aria-disabled={disabled}
	class="button flex w-fit rounded-sm bg-{color} cursor-pointer hover:bg-opacity-80 text-{color_t} select-none items-center px-2 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40 lg:px-4 {custom_style}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.01x" class="pr-1 md:pr-4" />
	</div>
	<div class="{icon_on_sm ? 'hidden' : ''} md:block">
		{text}
	</div>
</div>

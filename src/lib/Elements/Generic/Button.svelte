<script lang="ts">
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined;
	export let color: string = "COLORBLK4";
	export let color_t: string = 'COLORWHT';
	export let text: string;
	export let custom_style: string | undefined = '';
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot interact with this element.'; // Optional
</script>

<div
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	class="placeholder border-COLORHPK border-COLORBLE text-COLORHPK bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORBLK bg-COLORBLK1 bg-COLORBLK2 bg-COLORBLK3 bg-COLORBLK4 bg-COLORBLK5 bg-COLORGRN bg-COLORGRN1 bg-COLORGRN2 bg-COLORHPK bg-COLORWHT bg-COLORYLW bg-COLORBLE bg-COLORBYW bg-COLORPNK bg-COLORRED text-COLORWHT text-COLORWHT2 text-COLORWHT3 text-COLORWHT4 text-COLORWHT5 text-COLORBLK text-COLORBLK1 text-COLORBLK2 text-COLORBLK3 text-COLORBLK4 text-COLORBLK5 text-COLORGRN text-COLORGRN1 text-COLORGRN2 text-COLORHPK text-COLORWHT text-COLORYLW text-COLORBLE text-COLORBYW text-COLORPNK text-COLORRED aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:select-none hidden w-full"
>
	&nbsp;
</div>
<div
	aria-disabled={disabled}
	class="button w-fit flex rounded-sm bg-{color} hover:bg-opacity-80 cursor-pointer text-{color_t} px-4 py-2 items-center text-sm select-none aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none {custom_style}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.01x" class="pr-4" />
	</div>
	{text}
</div>

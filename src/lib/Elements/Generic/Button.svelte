<script lang="ts">
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined;
	export let color: string;
	export let color_t: string = 'COLORBLK';
	export let text: string;
	export let custom_style: string | undefined = '';
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot interact with this element.'; // Optional
</script>

<div
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	class="placeholder border-COLORHPK border-COLORBLE bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORHPK bg-COLORBLK bg-COLORYLW bg-COLORBLE bg-COLORBYW bg-COLORPNK bg-COLORRED aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:select-none hidden w-full"
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

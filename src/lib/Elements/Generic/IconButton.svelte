<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let icon: IconDefinition;
	export let color: string;
	export let color_t: string = "COLORWHT1";
	let className: string = '';
	export { className as class };
</script>

<div
	class="placeholder text-COLORHPK bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORHPK bg-COLORBLK bg-COLORYLW bg-COLORBYW bg-COLORPNK bg-COLORRED bg-COLORHPK hidden w-full"
>
	&nbsp;
</div>
<div
	class="button w-fit flex rounded-sm bg-{color} h-full hover:bg-opacity-80 cursor-pointer text-{color_t} px-4 py-2 items-center text-sm select-none mr-2 {className}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.01x" />
	</div>
</div>

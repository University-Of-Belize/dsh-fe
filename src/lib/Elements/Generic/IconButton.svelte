<script lang="ts">
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition;
	export let color: string;
	export let color_t: string = 'COLORWHT1';
	let className: string = '';
	export { className as class };
</script>

<div
	class="placeholder text-COLORHPK text-COLORHPK bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORBLK bg-COLORBLK1 bg-COLORBLK2 bg-COLORBLK3 bg-COLORBLK4 bg-COLORBLK5 bg-COLORGRN bg-COLORGRN1 bg-COLORGRN2 bg-COLORHPK bg-COLORWHT bg-COLORYLW bg-COLORBYW bg-COLORPNK bg-COLORRED bg-COLORHPK hidden w-full"
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

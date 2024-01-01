<script lang="ts">
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition;
	export let color: string;
	export let color_t: string = 'COLORWHT1';
	let className: string = '';
	export { className as class };
</script>

<div
	class="placeholder hidden w-full bg-COLORBLK bg-COLORBLK1 bg-COLORBLK2 bg-COLORBLK3 bg-COLORBLK4 bg-COLORBLK5 bg-COLORBYW bg-COLORGRN bg-COLORGRN1 bg-COLORGRN2 bg-COLORHPK bg-COLORHPK bg-COLORPNK bg-COLORRED bg-COLORWHT bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORYLW text-COLORHPK text-COLORHPK"
>
	&nbsp;
</div>
<div
	class="button flex w-fit rounded-sm bg-{color} h-full cursor-pointer hover:bg-opacity-80 text-{color_t} mr-2 select-none items-center px-4 py-2 text-sm {className}"
>
	<div class="icon w-fit">
		<Fa {icon} size="1.25x" />
	</div>
</div>

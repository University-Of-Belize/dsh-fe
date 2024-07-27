<script lang="ts">
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition;
	export let color: string;
	export let color_t: string = 'COLORLIGHT-15';
	let className: string = '';
	export { className as class };
</script>

<div
	class="placeholder hidden w-full bg-COLORACCENTD bg-COLORDARK-100 bg-COLORDARK-75 bg-COLORDARK-50 bg-COLORDARK-25 bg-COLORDARK-75 bg-COLORDARK-75 bg-COLORACCENTL bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTL bg-COLORACCENTL bg-COLORACCENTL bg-COLORACCENTL bg-COLORLIGHT-100 bg-COLORLIGHT-100 bg-COLORWHT2 bg-COLORLIGHT-50 bg-COLORLIGHT-75 bg-COLORLIGHT-100 bg-COLORACCENTL text-COLORACCENTD text-COLORACCENTL text-COLORACCENTL text-COLORLIGHT-100"
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

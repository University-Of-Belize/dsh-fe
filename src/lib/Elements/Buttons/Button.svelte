<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined =
		undefined;
	export let color: string = 'COLORDARK-75';
	export let color_t: string = 'COLORLIGHT-100';
	export let text: string;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let custom_style: string | undefined = '';
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot interact with this element.'; // Optional
	export let icon_on_sm: boolean = false; // Optional
	export let custom_icon: string | undefined = undefined;
	export let rounding: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'lg';
	let class_: string | undefined = "";
	export { class_ as class };
	let objectData: HTMLObjectElement;
	let iconData: HTMLDivElement;
	const dispatch = createEventDispatcher();

	function handleHover(event: Event) {
		dispatch('hover', event);
	}
	function handleMouseLeave(event: Event) {
		dispatch('mouseleave', event);
	}
	function handleClick(event: Event) {
		dispatch('click', event);
	}
</script>

<div
	aria-disabled={disabled}
	class="placeholder hidden pb-12 w-full border-COLORACCENTD border-COLORACCENTL bg-COLORDARK-75 bg-COLORDARK-25 bg-COLORDARK-50 bg-COLORDARK-75 bg-COLORDARK-100 bg-COLORACCENTD text-COLORDARK-100 bg-COLORDARK-75 bg-COLORDARK-50 bg-COLORDARK-25 bg-COLORDARK-75 bg-COLORDARK-75 bg-COLORACCENTL bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTL bg-COLORACCENTL bg-COLORACCENTL bg-COLORLIGHT-15 bg-COLORLIGHT-25 bg-COLORLIGHT-50 bg-COLORLIGHT-75 bg-COLORLIGHT-100 bg-COLORWHT2 bg-COLORLIGHT-50 bg-COLORLIGHT-75 bg-COLORLIGHT-100 bg-COLORACCENTL text-COLORACCENTD text-COLORLIGHT-100 text-COLORDARK-75 text-COLORDARK-50 text-COLORDARK-25 text-COLORDARK-15 text-COLORDARK-15 text-COLORACCENTL text-COLORACCENTD text-COLORACCENTD text-COLORACCENTD text-COLORACCENTL text-COLORACCENTL text-COLORACCENTL text-COLORACCENTL text-COLORLIGHT-100 text-COLORLIGHT-100 text-COLORWHT2 text-COLORLIGHT-50 text-COLORLIGHT-75 text-COLORLIGHT-100 text-COLORACCENTL aria-disabled:cursor-not-allowed aria-disabled:select-none aria-disabled:opacity-40 {class_}"
>
	&nbsp;
</div>
<button
	on:mouseover={(e) => handleHover(e)}
	on:focus={(e) => handleHover(e)}
	on:mouseleave={(e) => handleMouseLeave(e)}
	on:click={(e) => handleClick(e)}
	on:keypress={(e) => handleClick(e)}
	tabindex="-1"
	{type}
	aria-disabled={disabled}
	title={disabled ? disabled_text : ''}
	class="button flex w-fit rounded-{rounding} bg-{color} cursor-pointer hover:bg-opacity-80 text-{color_t} select-none items-center px-2 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40 lg:px-4 {custom_style}"
>
	<div class="icon hidden w-fit lg:block">
		{#if custom_icon}
			<div bind:this={iconData} class="h-9 w-9 pr-1 first:fill-COLORLIGHT-100 md:pr-4"></div>
			<div style="width: 0px; height: 0px; opacity: 0; overflow: hidden;">
				<object
					bind:this={objectData}
					on:load={() => {
						// Deal with the SVGs accordingly
						if (iconData.innerHTML === '') {
							try {
								iconData.append(objectData.contentWindow.document.querySelectorAll('*')[0]);
								// Get the first SVG element inside of iconData and apply the appropriate styling
								const svg = iconData.getElementsByTagName('svg')[0];
								svg.style.width = '100%';
								svg.style.height = '100%';
								svg.style.fill = 'white';
							} catch (error) {
								// Dump the fallback into the iconData
								iconData.innerHTML = objectData.innerHTML;
							}
						}
					}}
					data={custom_icon}
					title="icon"
				>
					<!-- Optional fallback content -->
					<!-- Most icons look OK like this when using object-contain -->
					<img src={custom_icon} alt="icon" class="h-full w-full object-contain" />
				</object>
			</div>
			<!-- <img src={custom_icon} alt="icon" class="h-9 w-9 fill-white pr-1 md:pr-4" /> -->
		{:else if icon}
			<Fa {icon} size="1.01x" class="hidden pr-1 md:pr-4 lg:block" />
		{/if}
	</div>
	<div class="{icon_on_sm ? 'hidden' : ''} md:block">
		{text}
	</div>
</button>

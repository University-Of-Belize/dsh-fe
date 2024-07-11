<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Fa from 'svelte-fa';
	export let icon: import('@fortawesome/free-solid-svg-icons').IconDefinition | undefined =
		undefined;
	export let color: string = 'COLORBLK4';
	export let color_t: string = 'COLORWHT';
	export let text: string;
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let custom_style: string | undefined = '';
	export let disabled: boolean = false; // Optional
	export let disabled_text: string = 'You cannot interact with this element.'; // Optional
	export let icon_on_sm: boolean = false; // Optional
	export let custom_icon: string | undefined = undefined;
	export let rounding: "sm" | "md" | "lg" | "xl" | "2xl" = "lg";
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
	class="placeholder hidden w-full border-COLORBLE border-COLORHPK bg-COLORBLE bg-COLORBLK bg-COLORBLK1 bg-COLORBLK2 bg-COLORBLK3 bg-COLORBLK4 bg-COLORBLK5 bg-COLORBYW bg-COLORGRN bg-COLORGRN1 bg-COLORGRN2 bg-COLORHPK bg-COLORPNK bg-COLORRED bg-COLORWHT bg-COLORWHT bg-COLORWHT2 bg-COLORWHT3 bg-COLORWHT4 bg-COLORWHT5 bg-COLORYLW text-COLORBLE text-COLORBLK text-COLORBLK1 text-COLORBLK2 text-COLORBLK3 text-COLORBLK4 text-COLORBLK5 text-COLORBYW text-COLORGRN text-COLORGRN1 text-COLORGRN2 text-COLORHPK text-COLORHPK text-COLORPNK text-COLORRED text-COLORWHT text-COLORWHT text-COLORWHT2 text-COLORWHT3 text-COLORWHT4 text-COLORWHT5 text-COLORYLW aria-disabled:cursor-not-allowed aria-disabled:select-none aria-disabled:opacity-40"
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
	<div class="icon w-fit hidden lg:block">
		{#if custom_icon}
			<div bind:this={iconData} class="h-9 w-9 pr-1 first:fill-COLORWHT md:pr-4"></div>
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
			<Fa {icon} size="1.01x" class="hidden lg:block pr-1 md:pr-4" />
		{/if}
	</div>
	<div class="{icon_on_sm ? 'hidden' : ''} md:block">
		{text}
	</div>
</button>

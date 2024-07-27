<script lang="ts">
	export let icon: string;
	export let icon_alt: string = 'icon';
	export let tag: boolean = false;
	export let tagColor: string = 'COLORACCENTD';
	export let tagColor_t: string = 'COLORLIGHT-100';
	export let tagText: string = '';
	export let title: string = '';
	export let description: string;
	let iconData: HTMLDivElement;
	let objectData: HTMLObjectElement;
</script>

<!-- Color stub -->
<div
	class="placeholder hidden w-full bg-COLORACCENTD bg-COLORDARK-100 bg-COLORDARK-75 bg-COLORDARK-50 bg-COLORDARK-25 bg-COLORDARK-75 bg-COLORDARK-75 bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTD bg-COLORACCENTL bg-COLORACCENTL bg-COLORLIGHT-100 bg-COLORWHT2 bg-COLORLIGHT-50 bg-COLORLIGHT-75 bg-COLORLIGHT-100 bg-COLORACCENTL"
>
	&nbsp;
</div>

<div class="review my-4 rounded-md bg-COLORDARK-75 bg-opacity-50 px-4 py-2">
	<div class="flex bg-opacity-100">
		<div
			class="reviewer-pfp mr-4 flex h-9 w-9 flex-col items-center justify-start rounded-md bg-COLORDARK-75 p-2"
		>
			<div bind:this={iconData} class="flex items-center justify-center first:fill-COLORLIGHT-100"></div>
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
					data={icon}
					title={icon_alt}
				>
					<!-- Optional fallback content -->
					<!-- Most icons look OK like this when using object-contain -->
					<img src={icon} class="h-full w-full rounded-md object-contain" alt={icon_alt} />
				</object>
			</div>
		</div>
		<div class="user-wrap flex flex-wrap items-center lg:w-full">
			<div class="review-content text-COLORLIGHT-100" style="word-break: break-word;">
				<div class="flex items-center text-base font-semibold lg:text-lg">
					{title}
					{#if tag}
						<div
							class="tag px-4 py-1 bg-{tagColor} text-{tagColor_t} mx-4 flex items-center justify-center font-light lg:text-sm"
						>
							{tagText}
						</div>
					{/if}
				</div>
				<div class="text-md font-light text-COLORLIGHT-15">
					{@html description}
				</div>
			</div>
			<div class="actions flex flex-1 items-center justify-start text-COLORLIGHT-100 lg:justify-end">
				<slot />
			</div>
		</div>
	</div>
</div>

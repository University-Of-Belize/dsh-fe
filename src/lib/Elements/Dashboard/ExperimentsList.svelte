<script lang="ts">
	import GenericPill from '$lib/Elements/Dashboard/GenericPill.svelte';
	// import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import { toast } from '@zerodevx/svelte-toast';

	import type { ThemeData } from '$lib/types/ThemeDefinition';

	// The "themes" object
	const themes: ThemeData[] = [
		{ name: 'Soft Pink', id: 'soft-pink' },
		{
			name: 'Dark Legacy',
			id: 'dark-legacy',
			description:
				'Port of app\'s legacy dark mode skin. Probably does not work properly.'
		},
		{
			name: 'Dark v3',
			id: 'dark-v3',
			description:
				'One of the more "fun" dark-mode skins. Report any cosmetic bugs using Feedback Hub.'
		},
		{
			name: 'UB Theme',
			id: 'ub-theme',
			description:
				'UB Theme is meant to comply with the branding guidelines given to us by The University of Belize.'
		}
	];
</script>

<!-- Dark mode -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Dark mode"
	description="Latest, stable dark mode theme. Website default."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'dark'}
			<div
				class="deactivate h-fit w-fit"
				on:click={() => {
					localStorage.removeItem('theme');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTL"
					color_t="COLORACCENTL"
					text="DEACTIVATE"
				/>
			</div>
		{:else}
			<div
				class="activate h-fit w-fit"
				on:click={() => {
					localStorage.setItem('theme', 'dark');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTD"
					color_t="COLORACCENTD"
					text="ACTIVATE"
				/>
			</div>
		{/if}
	</div>
</GenericPill>

<!-- Light mode -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Light mode"
	description="Latest, stable light mode theme. Report any cosmetic bugs using Feedback Hub."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'light'}
			<div
				class="deactivate h-fit w-fit"
				on:click={() => {
					localStorage.removeItem('theme');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTL"
					color_t="COLORACCENTL"
					text="DEACTIVATE"
				/>
			</div>
		{:else}
			<div
				class="activate h-fit w-fit"
				on:click={() => {
					localStorage.setItem('theme', 'light');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTD"
					color_t="COLORACCENTD"
					text="ACTIVATE"
				/>
			</div>
		{/if}
	</div>
</GenericPill>

{#each themes as theme}
	<!--- {theme.name} (Theme) -->
	<GenericPill
		icon="/icons/font-awesome/scribble.svg"
		title="{theme.name} (Theme)"
		description={theme.description ?? `${theme.name} (Theme). Created using 'Theme Creator'.`}
	>
		<div class="controls flex space-x-2">
			{#if localStorage.theme === theme.id}
				<div
					class="deactivate h-fit w-fit"
					on:click={() => {
						localStorage.removeItem('theme');
						toast.push('One moment...');
						setTimeout(() => {
							window.location.reload();
						}, 3000);
					}}
				>
					<Button
						color="transparent"
						custom_style="border border-COLORACCENTL"
						color_t="COLORACCENTL"
						text="DEACTIVATE"
					/>
				</div>
			{:else}
				<div
					class="activate h-fit w-fit"
					on:click={() => {
						localStorage.setItem('theme', theme.id);
						toast.push('One moment...');
						setTimeout(() => {
							window.location.reload();
						}, 3000);
					}}
				>
					<Button
						color="transparent"
						custom_style="border border-COLORACCENTD"
						color_t="COLORACCENTD"
						text="ACTIVATE"
					/>
				</div>
			{/if}
		</div>
	</GenericPill>
{/each}

<!-- Staff tools V1 -->
<GenericPill
	icon="/icons/font-awesome/gear-code.svg"
	title="Staff tools V1"
	description="Website staff management tools."
>
	<div class="controls flex space-x-2">
		{#if localStorage.staff === 'true'}
			<div
				class="deactivate h-fit w-fit"
				on:click={() => {
					localStorage.removeItem('staff');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTL"
					color_t="COLORACCENTL"
					text="DEACTIVATE"
				/>
			</div>
		{:else}
			<div
				class="activate h-fit w-fit"
				on:click={() => {
					localStorage.setItem('staff', 'true');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTD"
					color_t="COLORACCENTD"
					text="ACTIVATE"
				/>
			</div>
		{/if}
	</div>
</GenericPill>

<!--- Theme Creator (Experimental) -->
<GenericPill
	icon="/icons/font-awesome/gear-code.svg"
	title="Theme Creator (Defunct/Experimental)"
	description="'Theme Creator' allows the creation of new skins for the website."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'custom'}
			<div
				class="deactivate h-fit w-fit"
				on:click={() => {
					localStorage.removeItem('theme');
					localStorage.removeItem('theme-map');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTL"
					color_t="COLORACCENTL"
					text="DEACTIVATE"
				/>
			</div>
		{:else}
			<div
				class="activate h-fit w-fit"
				on:click={() => {
					localStorage.setItem('theme', 'custom');
					localStorage.setItem('theme-map', '{}');
					toast.push('One moment...');
					setTimeout(() => {
						window.location.reload();
					}, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTD"
					color_t="COLORACCENTD"
					text="ACTIVATE"
				/>
			</div>
		{/if}
	</div>
</GenericPill>

<!--- Developer Mode -->
<GenericPill icon="/icons/font-awesome/gear-code.svg" title="Dev" description="dev">
	<div class="controls flex space-x-2">
		{#if localStorage.dev != undefined}
			<div
				class="deactivate h-fit w-fit"
				on:click={() => {
					localStorage.removeItem('dev');
					toast.push('One moment...');
					// No reload
					// setTimeout(() => {
					// 	window.location.reload();
					// }, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTL"
					color_t="COLORACCENTL"
					text="DEACTIVATE"
				/>
			</div>
		{:else}
			<div
				class="activate h-fit w-fit"
				on:click={() => {
					localStorage.setItem('dev', '');
					toast.push('One moment...');
					// No reload
					// setTimeout(() => {
					// 	window.location.reload();
					// }, 3000);
				}}
			>
				<Button
					color="transparent"
					custom_style="border border-COLORACCENTD"
					color_t="COLORACCENTD"
					text="ACTIVATE"
				/>
			</div>
		{/if}
	</div>
</GenericPill>

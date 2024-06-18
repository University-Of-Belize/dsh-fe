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
			name: 'Light v2',
			id: 'light-v2',
			description: "Experimental, but not as bad. Generated using 'Theme Creator'."
		},
		{ name: 'Grey', id: 'grey', description: 'Used to be light mode. Not anymore.' },
		{
			name: 'Dark v3',
			id: 'dark-v3',
			description:
				'Third iteration of experimental dark mode skin. Report any cosmetic bugs using Feedback Hub.'
		},
		{
			name: 'Dark v2',
			id: 'dark-v2',
			description: 'Latest, stable dark mode skin. Report any cosmetic bugs using Feedback Hub.'
		},
		{
			name: 'UB Theme',
			id: 'ub-theme',
			description:
				'UB Theme is meant to comply with the branding guidelines given to us by The University of Belize.'
		},
		{
			name: 'Fandom Wiki',
			id: 'fandom-wiki'
		},
		{
			name: 'Green',
			id: 'green-ish'
		},
		{
			name: 'Bubblegum',
			id: 'bubble-gum'
		},
		{
			name: 'Lol',
			id: 'lol'
		}
	];
</script>

<!-- Dark mode -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Dark mode (Legacy)"
	description="Legacy dark mode skin. Website default."
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
					custom_style="border border-COLORHPK"
					color_t="COLORHPK"
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
					custom_style="border border-COLORGRN1"
					color_t="COLORGRN"
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
					custom_style="border border-COLORHPK"
					color_t="COLORHPK"
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
					custom_style="border border-COLORGRN1"
					color_t="COLORGRN"
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
						custom_style="border border-COLORHPK"
						color_t="COLORHPK"
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
						custom_style="border border-COLORGRN1"
						color_t="COLORGRN"
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
					custom_style="border border-COLORHPK"
					color_t="COLORHPK"
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
					custom_style="border border-COLORGRN1"
					color_t="COLORGRN"
					text="ACTIVATE"
				/>
			</div>
		{/if}
	</div>
</GenericPill>

<!--- Theme Creator (Experimental) -->
<GenericPill
	icon="/icons/font-awesome/gear-code.svg"
	title="Theme Creator (Experimental)"
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
					custom_style="border border-COLORHPK"
					color_t="COLORHPK"
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
					custom_style="border border-COLORGRN1"
					color_t="COLORGRN"
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
					custom_style="border border-COLORHPK"
					color_t="COLORHPK"
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
					custom_style="border border-COLORGRN1"
					color_t="COLORGRN"
					text="ACTIVATE"
				/>
			</div>
		{/if}
	</div>
</GenericPill>

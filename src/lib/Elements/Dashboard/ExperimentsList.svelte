<script lang="ts">
	import GenericPill from '$lib/Elements/Dashboard/GenericPill.svelte';
	// import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import { toast } from '@zerodevx/svelte-toast';
</script>

<!-- Dark mode -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Dark mode"
	description="Latest, stable dark mode skin. Website default."
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

<!-- Dark v2 -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Dark v2"
	description="Experimental dark mode skin. Report any cosmetic bugs using Feedback Hub."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'dark-v2'}
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
					localStorage.setItem('theme', 'dark-v2');
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

<!-- Dark v3 -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Dark v3"
	description="Third iteration of experimental dark mode skin. Report any cosmetic bugs using Feedback Hub."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'dark-v3'}
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
					localStorage.setItem('theme', 'dark-v3');
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

<!-- Grey mode -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Grey theme"
	description="Used to be light mode. Not anymore."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'grey'}
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
					localStorage.setItem('theme', 'grey');
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

<!-- Light v2 (Theme) -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Light v2 (Theme)"
	description="Experimental, but not as bad. Generated using 'Theme Creator'."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'light-v2'}
			<!-- Theme name -->
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
					localStorage.setItem('theme', 'light-v2'); // Theme name
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

<!-- Staff tools V1 -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Staff tools V1"
	description="Staff management tools."
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

<!--- UB (Theme) -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="UB (Theme)"
	description="Just- don't. This is a joke. This is only here to comply with UB branding standards for the time being."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'ub-theme'}
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
					localStorage.setItem('theme', 'ub-theme');
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
	icon="/icons/font-awesome/scribble.svg"
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

<!-- Fandom Wiki (Theme) -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Fandom Wiki (Theme)"
	description="Generated using 'Theme Creator'."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'fandom-wiki'}
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
					localStorage.setItem('theme', 'fandom-wiki');
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

<!--- Green (Theme) -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Green (Theme)"
	description="Generated using 'Theme Creator'."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'green-ish'}
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
					localStorage.setItem('theme', 'green-ish');
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

<!--- Bubblegum (Theme) -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Bubblegum (Theme)"
	description="Generated using 'Theme Creator'."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'bubble-gum'}
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
					localStorage.setItem('theme', 'bubble-gum');
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

<!-- Lol (Theme) -->
<GenericPill
	icon="/icons/font-awesome/scribble.svg"
	title="Lol (Theme)"
	description="Generated using 'Theme Creator'."
>
	<div class="controls flex space-x-2">
		{#if localStorage.theme === 'lol'}
			<!-- Theme name -->
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
					localStorage.setItem('theme', 'lol'); // Theme name
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

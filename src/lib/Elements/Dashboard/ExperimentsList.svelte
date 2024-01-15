<script lang="ts">
	import GenericPill from '$lib/Elements/Dashboard/GenericPill.svelte';
	// import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Buttons/Button.svelte';
	import { toast } from '@zerodevx/svelte-toast';
</script>

<GenericPill
	icon="/icons/scribble.svg"
	title="Dark mode"
	description="Latest dark mode skin. Website default."
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
<GenericPill
	icon="/icons/scribble.svg"
	title="Light mode"
	description="Unstable, really bad for the eyes."
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

<GenericPill
	icon="/icons/scribble.svg"
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

<GenericPill
	icon="/icons/scribble.svg"
	title="UB Theme"
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

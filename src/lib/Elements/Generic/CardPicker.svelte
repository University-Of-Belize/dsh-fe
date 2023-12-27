<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Elements/Generic/Button.svelte';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
    export let image: string;
    export let title: string;
    export let subtitle: string = ""
    export let body: string;
    export let button_text: string;
    export let where_to: string;
    export let image_alt: string = "No image alt provided";
    export let button_icon: IconDefinition;
    export let button_color: string = "COLORWHT"
    export let button_text_color: string = "COLORWHT"
</script>

<div class="card-picker flex flex-wrap w-full my-4">
    <div class="m-1 flex-1">
        <div class="flex w-full border border-COLORBLE rounded-md overflow-hidden">
            <img src={image} alt={image_alt} class="w-full object-cover" />
        </div>
    </div>

    <div class="flex-1 basis-full text-COLORWHT lg:basis-0 border border-COLORBLE rounded-md overflow-hidden lg:mx-6 p-6">
        <div class="font-semibold text-xl mb-6">
           {title}

            <div class="text-COLORWHT2 mb-6 text-sm">
                {subtitle}
            </div>
            <div class="text-COLORWHT text-xl mb-6">
                {body}
            </div>

            
            <div class="btn_wrp" on:click={()=>goto(where_to)}>
            <Button
                icon={button_icon}
                color={button_color}
                color_t={button_text_color}
                text={button_text}
            />
    
        </div>
        </div>
    </div>
</div>
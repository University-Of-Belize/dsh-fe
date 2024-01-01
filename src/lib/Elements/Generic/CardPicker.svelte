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
            <div class="text-COLORWHT text-xl mb-6 prose prose-neutral block w-full max-w-full rounded-sm prose-h1:text-COLORWHT prose-h2:text-COLORWHT2 prose-h3:text-COLORWHT3 prose-h4:text-COLORWHT4 prose-h5:text-COLORWHT5 prose-h6:text-COLORWHT5 prose-a:text-COLORWHT2 prose-strong:text-COLORWHT1 prose-code:text-COLORYLW prose-ol:text-COLORWHT1 prose-ul:text-COLORWHT2 prose-li:text-COLORWHT">
                {@html body}
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
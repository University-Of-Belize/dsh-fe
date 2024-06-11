import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: number;

const addToCart = async (item: string | undefined, quantity: number) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'v1/user/cart',
				'POST',
				what_is(what.public.user, [item, quantity])
			)) as Response;
			const data = await response.json();
			if (response.ok) {
				// **************** TELEMETRY ******************
				gtag('event', 'add_to_cart', {
					item_id: item,
					quantity
				});
				// ************** END TELEMETRY ****************
				// toast.push('Added item to cart.');
				return data;
			} else {
				// console.error('Failed to add item to cart.');
				toast.push(`Failed to add item to cart. ${data.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				});
				// **************** TELEMETRY ******************
				gtag('event', 'cart_error', {
					error: data.message,
					item_id: item,
					quantity
				});
				// ************** END TELEMETRY ****************
			}
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
	}
};

async function emptyCart(index: number | null) {
	try {
		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'v1/user/cart',
				'DELETE',
				what_is(what.public.user, index?.toString())
			)) as Response;
			const data = await response.json();
			if (response.ok) {
				toast.push('Emptied the cart.');
				// **************** TELEMETRY ******************
				gtag('event', 'emptied_cart', {
					error: data.message
				});
				// ************** END TELEMETRY ****************
				return data;
			} else {
				// console.error('Failed to add item to cart.');
				toast.push(`Failed to empty cart. ${data.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				});
			}
		}, 500); // One action at a time
	} catch (error) {
		console.log(error);
	}
}

export { addToCart, emptyCart };

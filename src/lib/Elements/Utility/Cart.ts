import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import config from "$lib/config/settings.json";
import { toast } from '@zerodevx/svelte-toast';

const addToCart = async (item: string, quantity: number) => {
	try {
		const response = await fetch(`${config["server"]["HTTPOrigin"]}/api/v1/user/cart`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.token}`
			},
			body: JSON.stringify(what_is(what.public.user, [item, quantity]))
		});

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			console.error('Failed to add item to cart.');
			toast.push('Failed to add item to cart.', {
				dismissable: false,
				theme: {
					'--toastBarBackground': '#842d69'
				}
			});
		}
	} catch (error) {
		console.log(error);
	}
};
export { addToCart };

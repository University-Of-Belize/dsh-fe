import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';

import type { CartProduct } from '$lib/types/Product';
import type { Product } from '$lib/types/Product.ts';

let debounceTimeout: number;

const addToCart = async (
	product: Product,
	item: string | undefined,
	quantity: number,
	variations: string[]
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'user/cart',
				'POST',
				what_is(what.public.user, [item, quantity, variations.filter((n) => n)])
			)) as Response;
			const data = await response.json();
			if (response.ok) {
				// **************** TELEMETRY ******************
				gtag('event', 'add_to_cart', {
					currency: 'BZD',
					value: product.price ? product.price['$numberDecimal'] : 0,
					items: [
						{
							item_id: product._id,
							item_name: product.productName ? product.productName.trim() : 'Unavailable',
							//affiliation: "Google Merchandise Store",
							//coupon: "SUMMER_FUN",
							discount: 0.0,
							index: 0,
							item_brand: 'UniFood',
							item_category: product.category ? product.category.name.trim() : 'Unavailable',
							//item_category2: "Adult",
							//item_category3: "Shirts",
							//item_category4: "Crew",
							//item_category5: "Short sleeve",
							//item_list_id: "related_products",
							item_list_name: product.productName ? product.productName.trim() : 'Unavailable',
							item_variant: product.slug ? product.slug.trim() : 'Unavailable',
							//location_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
							price: product.price ? product.price['$numberDecimal'] : 'Unavailable',
							quantity: 1
						}
					]
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
					cart_error: data.message,
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
				'user/cart',
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

async function updateCartQuantity(product_slug: string, quantity: number | null) {
	try {
		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'user/cart',
				'POST',
				what_is(what.public.user, [product_slug, quantity, []])
			)) as Response;
			const data = await response.json();
			// if (response.ok) {
			// 	toast.push('Emptied the cart.');
			// 	// **************** TELEMETRY ******************
			// 	gtag('event', 'emptied_cart', {
			// 		error: data.message
			// 	});
			// 	// ************** END TELEMETRY ****************
			// 	return data;
			// } else {
			if (!response.ok) {
				// console.error('Failed to add item to cart.');
				toast.push(`Failed to update cart. ${data.message}`, {
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

async function removeFromCart(index: string) {
	try {
		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'user/cart',
				'DELETE',
				what_is(what.public.user, index)
			)) as Response;
			const data = await response.json();
			// if (response.ok) {
			// 	toast.push('Emptied the cart.');
			// 	// **************** TELEMETRY ******************
			// 	gtag('event', 'emptied_cart', {
			// 		error: data.message
			// 	});
			// 	// ************** END TELEMETRY ****************
			// 	return data;
			// } else {
			if (!response.ok) {
				// console.error('Failed to add item to cart.');
				toast.push(`Failed to update cart. ${data.message}`, {
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

async function syncCart(cart: CartProduct[]) {
	try {
		clearTimeout(debounceTimeout);

		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'user/cart',
				'PUT',
				what_is(what.public.user, cart)
			)) as Response;
			const data = await response.json();
			// if (response.ok) {
			// 	toast.push('Emptied the cart.');
			// 	// **************** TELEMETRY ******************
			// 	gtag('event', 'emptied_cart', {
			// 		error: data.message
			// 	});
			// 	// ************** END TELEMETRY ****************
			// 	return data;
			// } else {
			if (!response.ok) {
				// console.error('Failed to add item to cart.');
				toast.push(`Failed to update cart. ${data.message}`, {
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
export { addToCart, emptyCart, removeFromCart, syncCart, updateCartQuantity };

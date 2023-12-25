import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';

async function userDeleteOrderProduct(order_id: string, index: number) {
	const r = await fetchWebApi(
		'v1/order/place',
		'PUT',
		what_is(what.public.order, [
			order_id,
			null, // Promo code
			{
				product_action: 'd', // 'd' for DELETE / 'm' for MODIFY
				index
				// "productID": "6545669a5cfbe8781b14e287",
				// "quantity": 1
			}
		])
	) as Response;
	if (!r.ok) {
		try {
			const res = await r.json();
			toast.push(res.message);
		} catch (err) {
			toast.push(`Failed: ${err}`);
		}
	}
	const res = await r.json();
	toast.push(res.is[0]);
}

export { userDeleteOrderProduct };

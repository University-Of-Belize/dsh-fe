import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: number;

// Create product
const createProduct = async (
	category_id: string,
	slug: string,
	productName: string,
	description: string,
	keywords: string[],
	image_url: string,
	price: number,
	discount: number
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [
				category_id,
				slug,
				productName,
				description,
				keywords,
				image_url,
				price,
				discount
			];
			const res = (await fetchWebApi(
				'admin/menu/manage',
				'POST',
				what_is(what.private.menu, payload)
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			toast.push(`Product ${productName} created successfully.`);
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while creating the product: ${error.message}`);
	}
};

// Edit product
const editProduct = async (
	oldSlug: string,
	category_id: string,
	slug: string,
	productName: string,
	description: string,
	keywords: string[],
	image_url: string,
	price: number,
	discount: number
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [
				oldSlug,
				category_id,
				slug,
				productName,
				description,
				keywords,
				image_url,
				price,
				discount
			];
			const res = (await fetchWebApi(
				'admin/menu/manage',
				'PUT',
				what_is(what.private.menu, payload)
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			toast.push(`Product ${productName} modified successfully.`);
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while modifying the product: ${error.message}`);
	}
};

const deleteProduct = async (productId: string) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const res = (await fetchWebApi(
				'admin/menu/manage',
				'DELETE',
				what_is(what.private.menu, productId)
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			toast.push('Product deleted successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while deleting the product: ${error.message}`);
	}
};

export { createProduct, deleteProduct, editProduct };


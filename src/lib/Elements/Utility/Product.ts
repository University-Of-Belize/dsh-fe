import { goto } from '$app/navigation';
import config from '$lib/config/settings';
import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: number;

// Create product
const createProduct = async (
	category_id: string,
	slug: string,
	productName: string,
	description: string,
	image_url: string,
	price: number,
	discount: number,
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [category_id, slug, productName, description, image_url, price, discount];
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/menu/manage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.token}`
				},
				body: JSON.stringify(what_is(what.private.menu, payload))
			});
			if (res.status === 403) {
				localStorage.removeItem('token');
				localStorage.removeItem('user_id');
				localStorage.removeItem('user');
				toast.push('You need to log in.');
				goto('/auth/login');
			}
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
	image_url: string,
	price: number,
	discount: number,
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [oldSlug, category_id, slug, productName, description, image_url, price, discount];
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/menu/manage`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.token}`
				},
				body: JSON.stringify(what_is(what.private.menu, payload))
			});
			if (res.status === 403) {
				localStorage.removeItem('token');
				localStorage.removeItem('user_id');
				localStorage.removeItem('user');
				toast.push('You need to log in.');
				goto('/auth/login');
			}
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
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/menu/manage`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.token}`
				},
				body: JSON.stringify(what_is(what.private.menu, productId))
			});
			if (res.status === 403) {
				localStorage.removeItem('token');
				localStorage.removeItem('user_id');
				localStorage.removeItem('user');
				toast.push('You need to log in.');
				goto('/auth/login');
			}
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

export { createProduct, editProduct, deleteProduct };

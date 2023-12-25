import { goto } from '$app/navigation';
import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: number;

const createPromo = async (
	newCode: string,
	nickname: string,
	description: string,
	discount_percentage: number,
	start_date: number,
	end_date: number
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [
				newCode,
				nickname,
				description ? description : '',
				discount_percentage,
				start_date,
				end_date
			];
			const res = (await fetchWebApi(
				'v1/admin/promo/manage',
				'POST',
				what_is(what.private.promos, payload)
			)) as Response;
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
			toast.push('Promotion created successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(
			`Oops. Something unexpected happened while creating the promotion: ${error.message}`
		);
	}
};

const editPromo = async (
	oldCode: string,
	newCode: string,
	nickname: string,
	description: string,
	discount_percentage: number,
	start_date: number,
	end_date: number
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [
				oldCode,
				newCode,
				nickname,
				description ? description : '',
				discount_percentage,
				start_date,
				end_date
			];
			const res = (await fetchWebApi(
				'v1/admin/promo/manage',
				'PUT',
				what_is(what.private.promos, payload)
			)) as Response;
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
			toast.push('Promotion modified successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(
			`Oops. Something unexpected happened while modifying the promotion: ${error.message}`
		);
	}
};

const deletePromo = async (code: string) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const res = (await fetchWebApi(
				'v1/admin/promo/manage',
				'DELETE',
				what_is(what.private.promos, code)
			)) as Response;
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
			toast.push('Promotion deleted successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(
			`Oops. Something unexpected happened while deleting the promotion: ${error.message}`
		);
	}
};

const getPromo = async () => {
	try {
		const res = (await fetchWebApi('v1/admin/promo/manage', 'GET')) as Response;
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
		return r;
	} catch (error) {
		console.log(error);
		toast.push(
			`Oops. Something unexpected happened while fetching the available promotions: ${error.message}`
		);
	}
};

export { createPromo, editPromo, deletePromo, getPromo };

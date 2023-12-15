import { goto } from '$app/navigation';
import config from '$lib/config/settings';
import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
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
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/promo/manage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.token}`
				},
				body: JSON.stringify(what_is(what.private.promos, payload))
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
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/promo/manage`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.token}`
				},
				body: JSON.stringify(what_is(what.private.promos, payload))
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
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/promo/manage`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.token}`
				},
				body: JSON.stringify(what_is(what.private.promos, code))
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
		const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/promo/manage`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.token}`
			}
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
		return r;
	} catch (error) {
		console.log(error);
		toast.push(
			`Oops. Something unexpected happened while fetching the available promotions: ${error.message}`
		);
	}
};

function getDate(unixTimestamp: number) {
	return unixTimestamp
		? new Date(unixTimestamp * 1000).toISOString().split('T')[0]
		: new Date().toISOString().split('T')[0];
}

export { createPromo, editPromo, deletePromo, getPromo, getDate };

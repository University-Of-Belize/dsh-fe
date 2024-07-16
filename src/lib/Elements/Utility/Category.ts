import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: number;

const createCategory = async (
	newName: string,
	description: string,
	alias: string,
	hidden: boolean
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [newName, description, alias.trim() === '' ? newName : alias, hidden];
			const res = (await fetchWebApi(
				'admin/category/manage',
				'POST',
				what_is(what.private.category, payload)
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			toast.push(`Category ${newName} created successfully.`);
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while creating the category: ${error.message}`);
	}
};
const editCategory = async (
	oldName: string,
	newName: string,
	description: string,
	alias: string,
	hidden: boolean
) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const payload = [
				oldName,
				newName,
				description,
				alias.trim() === '' ? newName : alias,
				hidden
			];
			const res = (await fetchWebApi(
				'admin/category/manage',
				'PUT',
				what_is(what.private.category, payload)
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			toast.push('Category modified successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(
			`Oops. Something unexpected happened while modifying the category: ${error.message}`
		);
	}
};

const deleteCategory = async (categoryName: string) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const res = (await fetchWebApi(
				'admin/category/manage',
				'DELETE',
				what_is(what.private.category, categoryName)
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			toast.push('Category deleted successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while deleting the category: ${error.message}`);
	}
};

export { createCategory, deleteCategory, editCategory };


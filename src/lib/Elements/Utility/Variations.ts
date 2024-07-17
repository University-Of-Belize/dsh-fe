import { fetchWebApi } from '$lib/vendor/dishout/api';
import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { toast } from '@zerodevx/svelte-toast';

// Add product variation
async function addVariation(variation_name: string, vcategory_id: string) {
	// delete variation with id
	const response = (await fetchWebApi(
		'admin/menu/variation',
		'POST',
		what_is(what.private.variation, [variation_name, vcategory_id])
	)) as Response;
	if (response.ok) {
		toast.push(`Variation has been added.`);
		const res = await response.json();
		return res[1];
	} else {
		let json;
		try {
			json = await response.json();
		} catch (error) {
			// Nothing
		}

		toast.push(`Variation could not be added. ${json ? json.message : ''}`);
	}
}

// Delete product variation by ID
async function deleteVariation(id: string) {
	// delete variation with id
	const response = (await fetchWebApi(`admin/menu/variation/${id}`, 'DELETE')) as Response;
	if (response.ok) {
		toast.push(`Variation has been deleted.`);
        return false;
	} else {
		let json;
		try {
			json = await response.json();
		} catch (error) {
			// Nothing
		}

		toast.push(`Variation could not be deleted. ${json ? json.message : ''}`);
        return true;
	}
}

// Delete product variation category by ID
async function deleteCategoryVariation(id: string) {
	// delete variation with id
	const response = (await fetchWebApi(`admin/menu/variation/tag/${id}`, 'DELETE')) as Response;
	if (response.ok) {
		toast.push(`Variation category has been deleted.`);
        return false;
	} else {
		let json;
		try {
			json = await response.json();
		} catch (error) {
			// Nothing
		}

		toast.push(`Variation category could not be deleted. ${json ? json.message : ''}`);
        return true;
	}
}

export { addVariation, deleteVariation, deleteCategoryVariation };

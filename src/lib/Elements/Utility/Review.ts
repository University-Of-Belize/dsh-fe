import { goto } from '$app/navigation';
import config from '$lib/config/settings';
import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: number;

const deleteReview = async (reviewId: string) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const res = await fetchWebApi('v1/admin/review/manage', 'DELETE', what_is(what.private.review, reviewId));
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
			toast.push('Review deleted successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while deleting the review: ${error.message}`);
	}
};

async function createReview(product_id: string, rating: number, comment: string) {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const response = await fetchWebApi('v1/review/create', 'POST', what_is(what.public.review, [product_id, rating, comment]));
			const data = await response.json();
			if (!response.ok) {
				return toast.push(data.message, {
					dismissable: false,
					theme: {
						'--toastBarBackground': '#842d69'
					}
				});
			}
			toast.push(
				// "Your review was created. It'll take a few minutes to show up. Indexing every: <b>3 minutes</b>"
				data.is[0]
			);
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while deleting the review: ${error.message}`);
	}
}

function escapeHtml(unsafe: string) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

export { createReview, deleteReview, escapeHtml };

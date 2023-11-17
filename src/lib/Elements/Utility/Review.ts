import { goto } from '$app/navigation';
import config from '$lib/config/settings';
import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: number;

const deleteReview = async (reviewId: string) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const res = await fetch(`${config['server']['HTTPOrigin']}/api/v1/admin/review/manage`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${localStorage.token}`
				},
				body: JSON.stringify(what_is(what.private.review, reviewId))
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
			toast.push('Review deleted successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while deleting the review: ${error.message}`);
	}
};

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export { deleteReview, escapeHtml };

import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';
let debounceTimeout: NodeJS.Timeout;

const deleteArticle = async (articleId: string) => {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const res = (await fetchWebApi(
				'admin/post/manage',
				'DELETE',
				what_is(what.private.post, articleId)
			)) as Response;
			const r = await res.json();
			if (!res.ok) {
				return toast.push(r.message);
			}
			toast.push('Article deleted successfully.');
			return r;
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(
			`Oops. Something unexpected happened while deleting the submission: ${error.message}`
		);
	}
};

async function createArticle(comment: string) {
	try {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'admin/post/manage',
				'POST',
				what_is(what.private.post, comment)
			)) as Response;
			const data = await response.json();
			if (!response.ok) {
				return toast.push(data.message, {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
					}
				});
			}
			toast.push(
				// "Your review was created. It'll take a few minutes to show up. Indexing every: <b>3 minutes</b>"
				data.is ? 'Article created successfully' : 'Something went on with the API.'
			);
			// setTimeout(() => {
			// 	window.location.reload();
			// }, 2000);
		}, 500); // 500ms break
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while deleting the article: ${error.message}`);
	}
}

export { createArticle, deleteArticle };


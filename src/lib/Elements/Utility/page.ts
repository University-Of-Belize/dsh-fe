import { toast } from '@zerodevx/svelte-toast';

function locateNodeUsingHash(node: string) {
	const { hash } = document.location;
	if (hash) {
		toast.push('Locating...');
	}
	setTimeout(() => {
		const scrollTo = hash && document.getElementById(hash.slice(1));
		if (scrollTo) {
			scrollTo.scrollIntoView();
		} else if (hash && !scrollTo) {
			toast.push(`Couldn't find that one.<br/>No ${node} found with that ID.`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': '#842d69'
				}
			});
		}
	}, 2000);
}

export { locateNodeUsingHash };

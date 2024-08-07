import { what_is } from '$lib/vendor/dishout/What_Is';
import what from '$lib/vendor/dishout/Whats';
import { fetchWebApi } from '$lib/vendor/dishout/api';
import { toast } from '@zerodevx/svelte-toast';
/*
Make this function compatible with these calls

# Toggle staff
editUser(
													'm',
													data.username,
													undefined,
													null,
													null,
													data.email,
													data.staff == true ? false : true,
													data.credit,
													data.restrictions,
													undefined,
													undefined
												)

# Invalidate token
editUser('f', 'INVALID')

# Documentation
{
	"what": "__user",
	"is": [
		OLD_USERNAME : string,
		USERNAME : string | undefined,
		PASSWORD: STRING | (undefined only if STAFF == true),
		EMAIL: STRING,
		STAFF: BOOLEAN,
		CREDIT: DECIMAL128,
		RESTRICTIONS: NUMBER,
		BYPASS_ACTIVATION: BOOLEAN | (undefined only if "action" == "m"),
		ACTION: OBJECT = {
			"action": "f" | "m",
			"action_num": NUMBER | (undefined only if "action" == "m")
		}
	]
}

## Possible values for "action_num"
1 - invalidate token [Y]
2 - trigger verification (manual/change email) [Y]
3 - lockout (undefine reset_token, token, activation_token) [Y]
4 - delete [Y]
5 - ban (lockout + restrictions = -1) [Y]

*/
async function editUser(
	action: 'f' | 'm',
	actionNum: number | undefined,
	oldUsername: string,
	email: string,
	staff: boolean,
	credit: number,
	restrictions: number,
	username?: string,
	password?: string | null
) {
	const payload = what_is(what.private.user, [
		oldUsername,
		username,
		password,
		email,
		staff,
		credit,
		restrictions,
		{
			action,
			action_num: actionNum
		}
	]);

	try {
		const res = (await fetchWebApi('admin/user/manage', 'PUT', payload)) as Response;
		if (!res.ok) {
			const r = await res.json();
			return toast.push(r.message, {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
				}
			});
		}

		const r = await res.json();
		console.log(r);
	} catch (error) {
		console.log(error);
		toast.push(`Oops. Something unexpected happened while modifying the user: ${error.message}`);
	}
}

let debounceTimeout: number;

// Register the user
async function registerUser(payload: string[]) {
	try {
		clearTimeout(debounceTimeout);
		console.log(payload);
		debounceTimeout = setTimeout(async () => {
			const response = (await fetchWebApi(
				'admin/user/manage',
				'POST',
				what_is(what.private.user, payload)
			)) as Response;
			if (!response.ok) {
				const json = await response.json();
				return toast.push(`${json.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
					}
				});
			}
			const json = await response.json();
			toast.push(`'${json.is.username}' has been created successfully.`);
			localStorage.setItem('next_', JSON.stringify(json.is._id));
		}, 500); // debounce every 500ms
	} catch (error) {
		toast.push(
			`${error.message}: You have been temporarily blocked from our services. Do not persist. Try again later.`,
			{
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
				}
			}
		);
		console.log(error);
	}
}

export { editUser, registerUser };

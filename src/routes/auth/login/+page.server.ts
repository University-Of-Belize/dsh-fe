// Import getGoogleSession from the auth module
import { getGoogleSession } from '$lib/auth/google/index';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () =>{
    const data = await getGoogleSession();

    return {
        props: {
            google: data
        }
    }
}
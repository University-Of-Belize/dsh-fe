// Import getGoogleSession from the auth module
import { getGitHubSession } from '$lib/auth/github';
import { getGoogleSession } from '$lib/auth/google/index';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () =>{
    const google_session = await getGoogleSession();
    const github_session = await getGitHubSession();

    return {
        props: {
            google: google_session,
            github: github_session
        }
    }
}
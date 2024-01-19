import { handleErrorWithSentry, Replay } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://537f9ebddaa9b420f4927ab5304c417a@o4506573592723456.ingest.sentry.io/4506573594755072',
	tracesSampleRate: 1.0,

	// This enables Session Replay, but you need to replace the URL with the
	// URL provided to you in the Sentry UI.
	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// If you don't want to use Session Replay, just remove the line below:
	integrations: [
		new Replay({
			maskAllInputs: true,
			maskAllText: false,
			blockAllMedia: true
		})
	]
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();

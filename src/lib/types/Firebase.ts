interface FirebaseMessage {
	from: string;
	//	https://firebase.google.com/docs/cloud-messaging/concept-options#collapsible_and_non-collapsible_messages
	collapseKey: string;
	messageId: string;
	notification?: {
		title?: string;
		body?: string;
		/**
		 * The URL of an image that is downloaded on the device and displayed in the notification.
		 */
		image?: string;
		/**
		 * The URL to use for the notification's icon. If you don't send this key in the request,
		 * FCM displays the launcher icon specified in your app manifest.
		 */
		icon?: string;
	};
	data?: {
		[key: string]: string;
	};
	fcmOptions?: {
		/**
		 * The link to open when the user clicks on the notification.
		 */
		link?: string;
		/**
		 * The label associated with the message's analytics data.
		 */
		analyticsLabel?: string;
	};
}

export type { FirebaseMessage };

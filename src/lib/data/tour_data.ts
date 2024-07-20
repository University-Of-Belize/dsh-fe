import type { TourSteps } from '$lib/tour/index';
const admin_tour: TourSteps[] = [
	{
		target: '#dash_title',
		data: {
			title: 'Your dashboard',
			content:
				"Yeah, so welcome to your dashboard. Let's make this short. This is where you can control all sorts of things such as..."
		}
	},
	{
		target: '#user-menu-button',
		data: {
			title: 'Account options',
			content: 'Use this menu to access settings related to your account.'
		}
	},
	{
		target: '#theme_switcher',
		data: {
			title: 'Switching your theme (try it out)',
			content: 'Switch your theme using this button.'
		}
	},
	{
		target: '#shortcut_container',
		data: {
			title: 'Your shortcuts',
			content: 'We have a couple shortcuts to some common functionality laid out here.'
		}
	},

	{
		target: '#my_account',
		data: {
			title: 'Your account settings',
			content: 'Set things such as your username, your password, and other sorts of stuff.'
		}
	},
	{
		target: '#app_experiments',
		data: {
			title: 'App experiments',
			content: "Head over to our app experiments if you're feeling curious."
		}
	},
	{
		target: '#user_management',
		data: {
			title: 'Manage users',
			content:
				'Manage and edit users here. When clicked, it will bring up a list of users you can manage. We plan to implement searching in the future, but not right now.'
		}
	},
	{
		target: '#review_management',
		data: {
			title: 'Manage reviews',
			content:
				'You can also manage reviews. Similar to User Management, it will also bring up a list of reviews.'
		}
	},
	{
		target: '#feedback_hub',
		data: {
			title: 'Review feedback',
			content: `This is a centre for general feedback about how you're doing. Think of it as a suggestion box.
                People will give you feedback based on how they feel, or any issues they're experiencing with the app.
                There's also the forum (https://plattr.wuaze.com) for more informal conversation.`
		}
	},
	{
		target: '#new_user',
		data: {
			title: 'Create users (Quick Access)',
			content:
				'Create new users using this form. Ensure you fill out all fields in order to not receive any reject messages from the server.'
		}
	},
	{
		target: '#message_user',
		data: {
			title: 'Message users',
			content:
				'Talk to users about any order changes or answer their queries using this feature. When clicked you will see the most recent interactions. Click on any one of them to continue the conversation.'
		}
	},
	{
		target: '#view_receipts',
		data: {
			title: 'View receipts',
			content:
				'All closed orders end up here. There are currently no plans allow staff to delete receipts.'
		}
	},
	{
		target: '#refill_account',
		data: {
			title: 'Refill an account',
			content:
				'Once an account runs out of credit you can refill it here. Let us know if the interface is intuitive enough or can be improved upon through the forum.'
		}
	},
	{
		target: '#help_articles',
		data: {
			title: 'Write help articles (deprecated)',
			content:
				"This is like a private blog. Users do not receive notifications when you post to this. It's scheduled to be removed soon."
		}
	},
	{
		target: '#open_orders',
		data: {
			title: 'View open orders',
			content:
				'All open orders end up here. You have the option to either accept, reject or modify these orders. Marking as complete will close the order and mark as completed.'
		}
	},
	{
		target: '#category_management',
		data: {
			title: 'View and mangage categories',
			content:
				'You can view and create categories for your products here. You must create at least ONE category in order to publish a product.'
		}
	},
	{
		target: '#product_management',
		data: {
			title: 'View and mangage products',
			content:
				'View and create products here. There are is a wide variety of expanding options on how you can create your products. More features are planned on being supported in the near future.'
		}
	},
	{
		target: '#promo_management',
		data: {
			title: 'View and manage voucher codes',
			content:
				'You can create voucher (discount) codes here that users can apply to their entire order on checkout. (Minimum discount percentage is currently 1%)'
		}
	},
	{
		target: '#new_category',
		data: {
			title: 'Create categories (Quick Access)',
			content:
				'You can create new categories using this form. Ensure you fill out all fields in order to not receive any reject messages from the server.'
		}
	},
	{
		target: '#new_promo',
		data: {
			title: 'Create voucher code (Quick Access)',
			content:
				'You can create new voucher codes using this form. Ensure you fill out all fields in order to not receive any reject messages from the server.'
		}
	},
	{
		target: '#quick_access',
		data: {
			title: 'Access more functionality (staff)',
			content: 'Jump to common functionality using this button.'
		}
	},
	{
		target: '#dash_title',
		data: {
			title: "That's it! Safe trails!",
			content:
				'Let us know if you need anything else in the forum. Scheduled updates to the platform are set to sporadically release during the semester, so expect a good amount of change and new features.'
		}
	}
];

export { admin_tour };

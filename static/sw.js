// Thank you "https://xdaforums.com/" !!
'use strict';

// ################################## CONSTANTS #################################

let CACHE_NAME = 'dsh-offline';
let CACHE_ROUTE = '/cache/storage.json';
let OFFLINE_ROUTE = '/watchdog/error';

let supportPreloading = false;
// let filesList = [];

// ############################### MAIN THREAD ##############################
// setInterval(async () => {
// 	console.log('Adding the following files to cache storage:', filesList);
// 	await caches
// 		.open(CACHE_NAME)
// 		.then((cache) => cache.addAll(filesList))
// 		.then(() => {
// 			return "PRIMARY";
// 		});
// }, 5000);

// ############################### EVENT LISTENERS ##############################
self.addEventListener('install', function (event) {
	self.skipWaiting();
	event.waitUntil(createCache());
});

self.addEventListener('activate', function (event) {
	self.clients.claim();

	event.waitUntil(
		new Promise(function (resolve) {
			if (self.registration.navigationPreload) {
				self.registration.navigationPreload[supportPreloading ? 'enable' : 'disable']();
			}

			resolve();
		})
	);
});

self.addEventListener('fetch', async (event) => {
	const request = event.request;
	// console.log(request.url)
	// filesList.push(request.url);
	// const accept = request.headers.get('accept');

	// if (
	// 	request.mode !== 'navigate' ||
	// 	request.method !== 'GET' ||
	// 	(accept && !accept.includes('text/html'))
	// ) {
	// 	return;
	// }

	const response = Promise.resolve(event.preloadResponse).then(async (r) => {
		// We don't want to save any of the API requests
		if (!request.url.includes('/api/')) {
			await caches.open(CACHE_NAME).then((cache) => cache.add(request.url));
		}
		return fetch(request) ?? r; // Prefer fetch over cached response
	});

	// This function runs whenever the fetch request fails
	event.respondWith(
		response.catch(function () {
			// console.log(request, error);
			return caches
				.open(CACHE_NAME)
				.then((cache) => {
					const url = new URL(request.url);
					const pathname = url.pathname;
					return cache.match(pathname === '/' ? OFFLINE_ROUTE : pathname);
				})
				.catch(() => { // If not in cache storage, return the online fetch request
					return fetch(request);
				});
		})
	);
});

// May be useful in near future
self.addEventListener('push', function (event) {
	let data;
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}

	try {
		data = event.data.json();
	} catch (e) {
		console.warn('Received push notification but payload not in the expected format.', e);
		console.warn('Received data:', event.data.text());
		return;
	}

	if (!data || !data.title || !data.body) {
		console.warn(
			'Received push notification but no payload data or required fields missing.',
			data
		);
		return;
	}

	data.last_count = 0;

	let options = {
		body: data.body,
		dir: data.dir || 'ltr',
		data: data
	};
	if (data.badge) {
		options.badge = data.badge;
	}
	if (data.icon) {
		options.icon = data.icon;
	}

	let notificationPromise;

	if (data.tag && data.tag_phrase) {
		options.tag = data.tag;
		options.renotify = true;

		notificationPromise = self.registration
			.getNotifications({ tag: data.tag })
			.then(function (notifications) {
				let lastKey = notifications.length - 1,
					notification = notifications[lastKey],
					count = 0;

				if (notification) {
					count = parseInt(notification.data.last_count, 10) + 1;
					options.data.last_count = count;

					options.body = options.body + ' ' + data.tag_phrase.replace('{count}', count.toString());
				}

				return self.registration.showNotification(data.title, options);
			});
	} else {
		notificationPromise = self.registration.showNotification(data.title, options);
	}

	event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function (event) {
	let notification = event.notification;

	notification.close();

	if (notification.data.url) {
		event.waitUntil(clients.openWindow(notification.data.url));
	}
});
// ##################################################################

// ################################### CACHING ##################################

function getCacheName() {
	let match = self.location.pathname.match(/^\/(.*)\/[^/]+$/);
	let cacheModifier;
	if (match && match[1].length) {
		cacheModifier = match[1].replace(/[^a-zA-Z0-9_-]/g, '');
	} else {
		cacheModifier = '';
	}

	return CACHE_NAME + (cacheModifier.length ? '-' : '') + cacheModifier;
}

function createCache() {
	let cacheName = getCacheName();

	return caches
		.delete(cacheName)
		.then(function () {
			return caches.open(cacheName);
		})
		.then(function (cache) {
			return fetch(CACHE_ROUTE)
				.then(function (response) {
					return response.json();
				})
				.then(function (response) {
					let key = response.key || null;
					let files = response.files || [];
					files.push(OFFLINE_ROUTE);

					return cache.addAll(files).then(function () {
						return key;
					});
				});
		})
		.catch(function (error) {
			console.error('There was an error setting up the cache:', error);
		});
}

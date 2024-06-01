// Thank you "https://xdaforums.com/" !!
"use strict";
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
self.importScripts(
   "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
self.importScripts(
   "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);
// Firebase is now in the global namespace

// ################################## CONSTANTS #################################

let CACHE_NAME = "dsh-offline";
let CACHE_ROUTE = "/cache/storage.json";
let OFFLINE_ROUTE = "/watchdog/error";
let supportPreloading = false;
let debounceTimeout;

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
self.addEventListener("install", function (event) {
   self.skipWaiting();
   event.waitUntil(createCache());
});

self.addEventListener("activate", function (event) {
   self.clients.claim();

   event.waitUntil(
      new Promise(function (resolve) {
         if (self.registration.navigationPreload) {
            self.registration.navigationPreload[
               supportPreloading ? "enable" : "disable"
            ]();
         }

         resolve();
      }),
   );
});

self.addEventListener("fetch", async (event) => {
   const request = event.request;
   // console.log(request.url)
   // filesList.push(request.url);
   // const accept = request.headers.get('accept');

   // We do not intercept requests other than 'GET' requests because
   // they cause issues with the ServiceWorker
   if (
      // request.mode !== 'navigate' ||
      request.method !== "GET" //||
      // (accept && !accept.includes('text/html'))
   ) {
      return;
   }

   const response = Promise.resolve(event.preloadResponse).then(async (r) => {
      // We don't want to save any of the API requests
      if (!request.url.includes("/api/" || "cloudflarestorage.com")) {
         await caches.open(CACHE_NAME).then((cache) => cache.add(request.url));
      }
      return fetch(request, { method: request.method }) ?? r; // Prefer fetch over cached response
   });

   // This function runs whenever the fetch request fails
   event.respondWith(
      response.catch(async () => {
         // console.log(request);
         return await caches
            .open(CACHE_NAME)
            .then((cache) => {
               const url = new URL(request.url);
               const pathname = url.pathname;
               return cache.match(pathname === "/" ? OFFLINE_ROUTE : pathname);
            })
            .catch(() => {
               // If not in cache storage, return the online fetch request
               return fetch(request, { method: request.method });
            });
      }),
   );
});

// May be useful in near future
self.addEventListener("push", function (event) {
   let data;
   if (!(self.Notification && self.Notification.permission === "granted")) {
      return;
   }

   try {
      data = event.data.json();
   } catch (e) {
      console.warn(
         "Received push notification but payload not in the expected format.",
         e,
      );
      console.warn("Received data:", event.data.text());
      return;
   }

   if (!data || !data.title || !data.body) {
      console.warn(
         "Received push notification but no payload data or required fields missing.",
         data,
      );
      return;
   }

   data.last_count = 0;

   let options = {
      body: data.body,
      dir: data.dir || "ltr",
      data: data,
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

               options.body =
                  options.body +
                  " " +
                  data.tag_phrase.replace("{count}", count.toString());
            }

            return self.registration.showNotification(data.title, options);
         });
   } else {
      notificationPromise = self.registration.showNotification(
         data.title,
         options,
      );
   }

   event.waitUntil(notificationPromise);
});

self.addEventListener("notificationclick", function (event) {
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
      cacheModifier = match[1].replace(/[^a-zA-Z0-9_-]/g, "");
   } else {
      cacheModifier = "";
   }

   return CACHE_NAME + (cacheModifier.length ? "-" : "") + cacheModifier;
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
         console.error("There was an error setting up the cache:", error);
      });
}

/*********** FIREBASE */

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyBXolTmpW_6vwf7ryhmBxAGDVZr3vEaEU8",
   authDomain: "plattr-32d57.firebaseapp.com",
   projectId: "plattr-32d57",
   storageBucket: "plattr-32d57.appspot.com",
   messagingSenderId: "955312324775",
   appId: "1:955312324775:web:fa4d3755462265f83a1b82",
   measurementId: "G-N0E9QJVTK4",
};
// Initialize Firebase with the provided configuration
firebase.initializeApp(firebaseConfig);

// Handle background messages
self.addEventListener("push", function (event) {
   console.log(
      "[firebase-messaging-sw.js] Received background message ",
      event.data.json(),
   );

   clearTimeout(debounceTimeout);
   debounceTimeout = setTimeout(async () => {
      // Extract notification details from the received data
      const push = event.data.json().notification;
      const title = push.title;
      const notificationOptions = {
         body: push.body,
         icon:
            push.image ??
            "https://cafe.ub.edu.bz/apple-touch-icon-precomposed.png",
         // ?? 'https://www.gstatic.com/devrel-devsite/prod/v4c72fb03a7a581549fb317877b3b0627265bda97bd9ba2a29365d1ada8a00354/firebase/images/favicon.png'
      };
      // Show the notification
		event.waitUntil(
         self.registration.showNotification(title, notificationOptions),
      );
	}, 3750); // bounce every 3750ms - notifications should be slow, not spammed
});

<script lang="ts">
	// import config from '$lib/config/settings';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import TextInput from '$lib/Elements/Inputs/TextInput.svelte';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import { lockPointer } from '$lib/vendor/dishout/lock';
	import { faLock, faRectangleAd } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import html2canvas from 'html2canvas';
	import { onMount } from 'svelte';
	$: continue_url = $page.url.searchParams.get('continue');
	let debounceTimeout: number;
	let logging_in: boolean = false;
	let canvas: HTMLCanvasElement;
	let data: string = '';

	onMount(() => {
		// Take a screenshot
		html2canvas(document.body).then((c) => {
			data = c.toDataURL();
		});
		// Check if we're already logged in
		const token = localStorage.token || localStorage.getItem('token');
		const blocked = localStorage.blocked || localStorage.getItem('blocked');
		if (token && !blocked) {
			// token exists, do something
			toast.push("You're already logged in");
			goto(continue_url ?? '/admin/dashboard');
		}
		if (blocked) {
			toast.push("Sorry, you've been blocked from our services.");
			goto('/auth/verify');
		}
	});

	async function Login(payload: any) {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			logging_in = true;
			await postData(payload, 'login');
		}, 500); // bounce every 500ms - let's hope they don't try to fucking spam the API
	}

	const handleSubmit = (event: Event) => {
		event.preventDefault();
		// @ts-ignore
		const valueArray = Array.from(event.target)
			.filter((el) => el.name)
			.map((el) => el.value);

		Login(valueArray);
	};
	async function postData(data: any, path: string) {
		try {
			const response = (await fetchWebApi(
				`v1/auth/${path}`,
				'POST',
				what_is(what.public.auth, data),
				false,
				undefined,
				true
			)) as Response;
			const json = await response.json();
			if (response.status === 403) {
				// Hackish asf lmfao
				if (json.message === "Sorry, you've been blocked from our services.") {
					// Flag the user
					localStorage.setItem('blocked', 'true');
					toast.push(`${json.message}`, {
						dismissable: false,
						theme: {
							'--toastBarBackground': 'rgb(var(--COLORRED))'
						}
					});
					// Redirect to verify to notify the status
					return goto('/auth/verify');
				}
			}
			if (!response.ok) {
				// Special cases
				if (response.status === 418) {
					localStorage.setItem('token', json.is[1]);
					toast.push(json.is[0]);
					document.body.style.background = 'red';
					document.body.insertAdjacentHTML(
						'afterbegin',
						"<h1 id='__x' class='text-4xl' style='color: white'>/???/5448455245/是/不是/回去/46524F4D5F57484154594F5544494</h1>"
					);
					// Hide the state
					window.history.replaceState(undefined, '???', '/auth/login');
					// Lock pointer (try #1)
					document.documentElement.requestPointerLock();
					return setTimeout(() => {
						lockPointer();
						meltScreen();
						navigator.keyboard.lock(); // Promise -- but we don't need the output
						setTimeout(() => {
							goto('/dev/EDGECASEZERO', { replaceState: false });
							// window.open(`${config.server['bound-domain']}/dev/EDGECASEZERO`);
						}, 4000);
					}, 1000);
				}
				// special cases
				setTimeout(() => {
					logging_in = false; // Slight "bounce"
				}, 450);
				return toast.push(`${json.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORRED))'
					}
				});
			}
			localStorage.setItem('user_id', json.is[0]);
			localStorage.setItem('token', json.is[1]);
			// Remove 'oops' or 'blocked' if exist
			localStorage.removeItem('oops');
			localStorage.removeItem('blocked');
			toast.push('Welcome back!');
			setTimeout(() => {
				goto(continue_url ?? '/admin/dashboard');
			}, 2000);
		} catch (error) {
			setTimeout(() => {
				logging_in = false; // Reenable after such time
			}, 3000);
			toast.push(`${error.message}. Try again later.`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORRED))'
				}
			});
			console.log(error);
		}
	}

	// ----------------------------------- MELT -------------------------------------- //
	function meltScreen() {
		canvas.classList.remove('hidden');
		document.body.style.overflow = 'hidden';

		(function () {
			var requestAnimationFrame =
				window.requestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				};
			window.requestAnimationFrame = requestAnimationFrame;
		})();

		var image1 = new Image(),
			image2 = new Image();

		var ctx = canvas.getContext('2d');

		const width = document.body.clientWidth;
		const height = document.body.clientHeight;

		canvas.width = width;
		canvas.height = height;

		// wipe effect
		var meltCan = document.createElement('canvas'),
			meltCtx = meltCan.getContext('2d'),
			images = [image1, image2],
			bgImage = 1,
			meltImage = 0,
			settings = {
				colSize: 2, // width of the columns
				maxDev: 100, // max deviation a column can have
				maxDiff: 50, // max difference in height a column can have to its neighbor
				fallSpeed: 16 // how fast the columns fall
			},
			columns = width / settings.colSize, // total number of columns
			y = [], // holds the current y pos of each column
			done = true; // used to tell when the effect is actually done

		meltCan.width = width;
		meltCan.height = height;

		function init() {
			meltCtx.drawImage(images[meltImage], 0, 0);
			// seed the rest of the y array
			for (var x = 0; x < columns; x++) {
				// seed the first element of the y array with a value between 0 and -maxDeviation
				if (x === 0) {
					y[x] = -Math.floor(Math.random() * settings.maxDev);
				} else {
					// assign a random value thats within maxDiff of our previous value;
					y[x] = y[x - 1] + (Math.floor(Math.random() * settings.maxDiff) - settings.maxDiff / 2);
				}

				// keep the value between 0 and -maxDev
				if (y[x] > 0) {
					y[x] = 0;
				} else if (y[x] < -settings.maxDev) {
					y[x] = -settings.maxDev;
				}
			}
		}

		// wipe render
		var col = 0,
			yPos = 0;

		function doMelt() {
			ctx.drawImage(images[bgImage], 0, 0);
			done = true;

			for (col = 0; col < columns; col++) {
				y[col] += settings.fallSpeed;

				// if within bounds of the canvas do the melt.
				if (y[col] < 0) {
					done = false;
					yPos = 0;
				} else if (y[col] < height) {
					done = false;
					yPos = y[col];
				}

				ctx.drawImage(
					meltCan,
					col * settings.colSize,
					0,
					settings.colSize,
					height,
					col * settings.colSize,
					yPos,
					settings.colSize,
					height
				);
			}

			if (done) {
				var swap = meltImage;
				meltImage = bgImage;
				bgImage = swap;
				init();
			}
			requestAnimationFrame(doMelt);
		}

		// var gui = new dat.GUI();
		// gui.add(settings, 'colSize');
		// gui.add(settings, 'fallSpeed', 1, 40);
		// gui.add(settings, 'maxDev');
		// gui.add(settings, 'maxDiff');

		// Data urls for the 2 image.. they are pretty long
		// Data urls for the 2 image.. they are pretty long
		// console.log(data);
		image1.src =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAADGCAMAAAAqo6adAAAACVBMVEX///9/rff///yOlBTYAAABgUlEQVR4nO3PMQEAMAyAsG7+RVdGjhIFMO/Paf3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWAd/1+uqwJT58ldTAAAAABJRU5ErkJggg==';
		image2.src = data;
		image2.onload = function () {
			init();
			doMelt();
		};
	}
</script>

<svelte:head>
	<title>UniFood | Login / Register</title>
</svelte:head>

<canvas bind:this={canvas} class="hidden" style="height: 100vh; width: 100vw;" />
<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content flex h-full flex-wrap items-center justify-center text-COLORWHT">
		<div class="flex w-full flex-col md:w-1/2">
			<div
				class="mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0 lg:w-[28rem]"
			>
				<p class="text-left text-3xl font-bold">Welcome back</p>
				<p class="mt-2 text-left text-COLORWHT1">Please enter your credentials.</p>
				<!--
				<button
					class="-2 mt-8 flex items-center justify-center rounded-md border bg-COLORBLK px-4 py-1 outline-none ring-gray-400 ring-offset-2 transition hover:border-COLORWHT1 hover:bg-COLORBLK2 hover:text-white focus:ring-2"
					><img class="mr-2 h-5" src="/icons/google-icon.svg" alt /> Log in with Google</button
				>
				<div class="relative mt-8 flex h-px place-items-center bg-COLORWHT">
					<div
						class="absolute left-1/2 h-6 w-14 -translate-x-1/2 bg-COLORWHT text-center text-sm text-COLORBLK"
					>
						or
					</div>
				</div>
				--->
				<form
					class="flex flex-col pt-3 md:pt-8"
					action="#"
					on:submit={(event) => handleSubmit(event)}
				>
					<div class="flex flex-col pt-4">
						<div class="relative flex overflow-hidden transition">
							<TextInput
								icon={faRectangleAd}
								name="username"
								placeholder="Enter a username or email"
								custom_style="bg-transparent"
								required
							/>
						</div>
					</div>
					<div class="flex flex-col pt-4">
						<div class="relative flex overflow-hidden transition">
							<TextInput
								icon={faLock}
								name="password"
								type="password"
								placeholder="Enter your password"
								autocomplete="current-password"
								custom_style="bg-transparent"
								required
							/>
						</div>
						<div class="mb-12 mt-4">
							<p class="whitespace-nowrap text-gray-600">
								Forgot Password?
								<a
									href="/auth/password_reset"
									class="forgot-password font-semibold text-COLORWHT underline underline-offset-4"
								>
									Reset it now.
								</a>
							</p>
						</div>
					</div>
					<button
						type="submit"
						title={logging_in ? 'Please wait for the request to complete' : ''}
						class="w-full rounded-lg bg-COLORGRY px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 disabled:opacity-50"
						disabled={logging_in}>Log in</button
					>
				</form>
				<div class="pt-12 text-center">
					<p class="whitespace-nowrap text-gray-600">
						Don't have an account?
						<a href="/auth/create" class="font-semibold text-COLORWHT underline underline-offset-4"
							>Sign up for free.</a
						>
					</p>
				</div>
			</div>
		</div>
		<div
			class="pointer-events-none relative hidden h-screen select-none bg-black md:block md:w-1/2"
		>
			<div class="relative z-10 px-8 py-20 text-white opacity-100">
				<p class="text-3xl font-semibold leading-10">
					Thank you for helping us shape the future of our<br />application.
				</p>
				<p class="mb-2 text-2xl font-semibold leading-10">
					"The best way to predict the future is to create it."
				</p>
				<p class="mb-4 text-3xl font-semibold">Peter Drucker</p>
				<p class="">Consultant/Educator</p>
				<p class="mb-7 text-sm opacity-70">Goethe University Frankfurt</p>
			</div>
			<img
				alt
				loading="lazy"
				class="-z-1 absolute top-0 h-full w-full object-cover opacity-50"
				src="/assets/auth/login-static.jpg"
			/>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

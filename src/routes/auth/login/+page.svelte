<script lang="ts">
	// import config from '$lib/config/settings';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/Elements/Generic/Buttons/Button.svelte';
	import Navigation from '$lib/Elements/Generic/Navigation.svelte';
	import { what_is } from '$lib/vendor/dishout/What_Is';
	import what from '$lib/vendor/dishout/Whats';
	import { fetchWebApi } from '$lib/vendor/dishout/api';
	import {
		faGift,
		faLock,
		faRectangleAd,
		faRightToBracket,
		faUnlockKeyhole
		// faUserCog
	} from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import html2canvas from 'html2canvas';
	import { lockPointer } from '$lib/vendor/dishout/lock';
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
				what_is(what.public.auth, data)
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
							'--toastBarBackground': '#842d69'
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
						'--toastBarBackground': '#842d69'
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
					'--toastBarBackground': '#842d69'
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
	<title>Plattr | Login / Register</title>
</svelte:head>

<canvas bind:this={canvas} class="hidden" style="height: 100vh; width: 100vw;" />
<main class="h-screen w-full">
	<div class="navigation z-20 w-full">
		<Navigation transparency={5} search={true} />
	</div>
	<div class="main-content mx-8 flex h-full items-center justify-center py-8">
		<div class="block">
			<form class="block" action="#" on:submit={(event) => handleSubmit(event)}>
				<div
					class="mx-8 mb-6 flex flex-1 items-center justify-center text-3xl font-semibold text-COLORWHT"
				>
					Cafe
				</div>
				<div
					class="username mx-8 mt-2 flex flex-1 items-center rounded-sm border border-COLORWHT bg-transparent px-4 py-2 text-sm"
				>
					<div class="icon w-fit">
						<Fa icon={faRectangleAd} size="1.25x" class="pr-4 text-COLORWHT" />
					</div>
					<input
						type="text"
						name="username"
						autocomplete="username"
						class="w-full bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none"
						placeholder="Enter a username or email"
					/>
				</div>
				<!-- <div
					class="email flex-1 flex mt-2 rounded-sm bg-COLORWHT5 px-4 py-2 mx-8 items-center text-sm border border-COLORWHT"
				>
					<div class="icon w-fit">
						<Fa icon={faUserCog} size="1.25x" class="text-COLORWHT pr-4" />
					</div>
					<input
						type="email"
						name="email"
						class="w-full font-medium focus:outline-none text-COLORWHT py-1 px-2 bg-transparent"
						placeholder="Enter your email address"
					/>
				</div> -->
				<div
					class="password mx-8 mt-2 flex flex-1 items-center rounded-sm border border-COLORWHT bg-transparent px-4 py-2 text-sm"
				>
					<div class="icon w-fit">
						<Fa icon={faLock} size="1.25x" class="pr-4 text-COLORWHT" />
					</div>
					<input
						type="password"
						name="password"
						autocomplete="current-password"
						class="w-full bg-transparent px-2 py-1 font-medium text-COLORWHT focus:outline-none"
						placeholder="Enter your password"
					/>
				</div>

				<div
					class="submit mx-8 mt-6 flex flex-1 items-center justify-center"
					title={logging_in ? 'Please wait for the request to complete' : ''}
				>
					<button class="submit w-full" type="submit" disabled={logging_in}>
						<Button
							icon={faRightToBracket}
							color="COLORWHT"
							color_t="COLORBLK"
							custom_style="w-full justify-center"
							text="Log in"
							disabled={logging_in}
						/>
					</button>
				</div>
				<a href="/auth/password_reset" class="mx-8 block w-fit">
					<div
						on:keypress={() => goto('/auth/password_reset')}
						on:click={() => goto('/auth/password_reset')}
						class="forgot-password flex w-fit cursor-pointer space-x-2 pt-4 text-sm font-semibold text-COLORWHT hover:underline"
					>
						<div class="icon"><Fa icon={faUnlockKeyhole} /></div>
						<div>Forgot Password?</div>
					</div></a
				>
			</form>

			<div class="mx-8 my-8 block text-COLORWHT">
				<div class="text-2xl font-light">New around here?</div>
				<div
					class="signup mt-6 flex flex-1 items-center justify-start"
					on:click={() => goto('/auth/register')}
					on:keypress={() => goto('/auth/register')}
				>
					<Button
						icon={faGift}
						color="COLORPNK"
						text="Sign up"
						color_t="COLORWHT"
						custom_style="w-18 justify-center"
					/>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	:root {
		--tw-bg-opacity: 1;
	}
</style>

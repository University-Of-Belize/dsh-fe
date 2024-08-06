<script lang="ts">
	// import config from '$lib/config/index';
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

	let blocked_message: string = "Sorry, you've been blocked from our services.";
	let error_string: string = '';
	let error_message: HTMLDivElement;

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
			logging_in = true;
			toast.push("You're already logged in");
			goto(continue_url ?? '/admin/dashboard');
		}
		if (blocked) {
			toast.push(blocked_message);
			goto('/auth/verify');
		}
	});

	async function Login(payload: any) {
		clearTimeout(debounceTimeout);
		error_message.innerText = '';
		// error_graphic.classList.add('hidden');
		// error_graphic.classList.remove('absolute');
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
				`auth/${path}`,
				'POST',
				what_is(what.public.auth, data),
				false,
				undefined,
				true
			)) as Response;
			const json = await response.json();
			if (response.status === 403) {
				// Hackish asf lmfao
				if (json.message === blocked_message) {
					// Flag the user
					localStorage.setItem('blocked', 'true');
					toast.push(`${json.message}`, {
						dismissable: false,
						theme: {
							'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
						}
					});
					error_message.innerText = blocked_message;
					// error_graphic.classList.remove('hidden');
					// error_graphic.classList.add('absolute');
					// Redirect to verify to notify the status
					return goto('/auth/verify');
				}
			}
			if (!response.ok) {
				// Special cases
				if (response.status === 418) {
					error_message.innerText = '是/不是/回去/46524F4D5F57484154594F5544494';
					// error_graphic.classList.remove('hidden');
					// error_graphic.classList.add('absolute');

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

				error_message.innerText = `${json.message}`;
				// error_graphic.classList.remove('hidden');
				// error_graphic.classList.add('absolute');

				return toast.push(`${json.message}`, {
					dismissable: false,
					theme: {
						'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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

			error_message.innerText = `${error.message}. Try again later.`;
			// error_graphic.classList.remove('hidden');
			// error_graphic.classList.add('absolute');

			toast.push(`${error.message}. Try again later.`, {
				dismissable: false,
				theme: {
					'--toastBarBackground': 'rgb(var(--COLORACCENTL))'
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
	<div class="main-content flex h-full flex-wrap items-center justify-center text-COLORLIGHT-100">
		<div class="flex w-full flex-col md:w-1/2">
			<div
				class="mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0 lg:w-[28rem]"
			>
				<p class="text-left text-3xl font-bold">Welcome back</p>
				<p class="mt-2 text-left text-COLORLIGHT-15">Please enter your credentials.</p>

				<button
					on:click={() => {
						logging_in = true;
						window.location.href = $page.data.props.google.AuthUrl;
					}}
					title={logging_in ? 'Please wait for the request to complete' : ''}
					disabled={logging_in}
					class="mt-8 flex w-full items-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
				>
					<img class="mr-2 h-5" src="/icons/google-icon.svg" alt />
					<span>Continue with Google</span>
				</button>


				<button
				on:click={() => {
					logging_in = true;
					window.location.href = $page.data.props.github.AuthUrl;
				}}
				title={logging_in ? 'Please wait for the request to complete' : ''}
				disabled={logging_in}
				class="mt-2 flex w-full items-center rounded-md border border-gray-800 bg-black px-6 py-2 text-sm font-medium text-gray-100 shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50">
				<svg class="mr-2 h-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 73 73" version="1.1">
					<g id="team-collaboration/version-control/github" stroke="none" stroke-width="1" fill="none"
						fill-rule="evenodd">
						<g id="container" transform="translate(2.000000, 2.000000)" fill-rule="nonzero">
							<rect id="mask" stroke="#000000" stroke-width="2" fill="#000000" x="-1"
								y="-1" width="71" height="71" rx="14">
			
							</rect>
							<path
								d="M58.3067362,21.4281798 C55.895743,17.2972267 52.6253846,14.0267453 48.4948004,11.615998 C44.3636013,9.20512774 39.8535636,8 34.9614901,8 C30.0700314,8 25.5585181,9.20549662 21.4281798,11.615998 C17.2972267,14.0266224 14.0269912,17.2972267 11.615998,21.4281798 C9.20537366,25.5590099 8,30.0699084 8,34.9607523 C8,40.8357654 9.71405782,46.1187277 13.1430342,50.8109917 C16.5716416,55.5036246 21.0008949,58.7507436 26.4304251,60.5527176 C27.0624378,60.6700211 27.5302994,60.5875152 27.8345016,60.3072901 C28.1388268,60.0266961 28.290805,59.6752774 28.290805,59.2545094 C28.290805,59.1842994 28.2847799,58.5526556 28.2730988,57.3588401 C28.2610487,56.1650247 28.2553926,55.1235563 28.2553926,54.2349267 L27.4479164,54.3746089 C26.9330843,54.468919 26.2836113,54.5088809 25.4994975,54.4975686 C24.7157525,54.4866252 23.9021284,54.4044881 23.0597317,54.2517722 C22.2169661,54.1004088 21.4330982,53.749359 20.7075131,53.1993604 C19.982297,52.6493618 19.4674649,51.9294329 19.1631397,51.0406804 L18.8120898,50.2328353 C18.5780976,49.6950097 18.2097104,49.0975487 17.7064365,48.4426655 C17.2031625,47.7871675 16.6942324,47.3427912 16.1794003,47.108799 L15.9336039,46.9328437 C15.7698216,46.815909 15.6178435,46.6748743 15.4773006,46.511215 C15.3368806,46.3475556 15.2317501,46.1837734 15.1615401,46.0197452 C15.0912072,45.855594 15.1494901,45.7209532 15.3370036,45.6153308 C15.5245171,45.5097084 15.8633939,45.4584343 16.3551097,45.4584343 L17.0569635,45.5633189 C17.5250709,45.6571371 18.104088,45.9373622 18.7947525,46.4057156 C19.4850481,46.8737001 20.052507,47.4821045 20.4972521,48.230683 C21.0358155,49.1905062 21.6846737,49.9218703 22.4456711,50.4251443 C23.2060537,50.9284182 23.9727072,51.1796248 24.744894,51.1796248 C25.5170807,51.1796248 26.1840139,51.121096 26.7459396,51.0046532 C27.3072505,50.8875956 27.8338868,50.7116403 28.3256025,50.477771 C28.5362325,48.9090515 29.1097164,47.7039238 30.0455624,46.8615271 C28.7116959,46.721353 27.5124702,46.5102313 26.4472706,46.2295144 C25.3826858,45.9484285 24.2825656,45.4922482 23.1476478,44.8597436 C22.0121153,44.2280998 21.0701212,43.44374 20.3214198,42.5080169 C19.5725954,41.571802 18.9580429,40.3426971 18.4786232,38.821809 C17.9989575,37.300306 17.7590632,35.5451796 17.7590632,33.5559381 C17.7590632,30.7235621 18.6837199,28.3133066 20.5326645,26.3238191 C19.6665366,24.1944035 19.7483048,21.8072644 20.778215,19.1626478 C21.4569523,18.951772 22.4635002,19.1100211 23.7973667,19.6364115 C25.1314792,20.1630477 26.1082708,20.6141868 26.7287253,20.9882301 C27.3491798,21.3621504 27.8463057,21.6790175 28.2208409,21.9360032 C30.3978419,21.3277217 32.644438,21.0235195 34.9612442,21.0235195 C37.2780503,21.0235195 39.5251383,21.3277217 41.7022622,21.9360032 L43.0362517,21.0938524 C43.9484895,20.5319267 45.0257392,20.0169716 46.2654186,19.5488642 C47.5058357,19.0810026 48.4543466,18.9521409 49.1099676,19.1630167 C50.1627483,21.8077563 50.2565666,24.1947724 49.3901927,26.324188 C51.2390143,28.3136755 52.1640399,30.7245457 52.1640399,33.556307 C52.1640399,35.5455485 51.9232849,37.3062081 51.444357,38.8393922 C50.9648143,40.3728223 50.3449746,41.6006975 49.5845919,42.5256002 C48.8233486,43.4503799 47.8753296,44.2285916 46.7404118,44.8601125 C45.6052481,45.4921252 44.504759,45.9483056 43.4401742,46.2293914 C42.3750975,46.5104772 41.1758719,46.7217219 39.8420054,46.8621419 C41.0585683,47.9149226 41.6669728,49.5767225 41.6669728,51.846804 L41.6669728,59.2535257 C41.6669728,59.6742937 41.8132948,60.0255895 42.1061847,60.3063064 C42.3987058,60.5865315 42.8606653,60.6690374 43.492678,60.5516109 C48.922946,58.7498829 53.3521992,55.5026409 56.7806837,50.810008 C60.2087994,46.117744 61.923472,40.8347817 61.923472,34.9597686 C61.9222424,30.0695396 60.7162539,25.5590099 58.3067362,21.4281798 Z"
								id="Shape" fill="#FFFFFF">
			
							</path>
						</g>
					</g>
				</svg>
			
				<span>Continue with Github</span>
			</button>

				<!-- <div class="relative mt-8 flex h-px place-items-center bg-COLORLIGHT-100">
					<div
						class="absolute left-1/2 h-6 w-14 -translate-x-1/2 bg-COLORLIGHT-100 text-center text-sm text-COLORLIGHT-100"
					>
						or
					</div>
				</div> -->
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
						<p bind:this={error_message} class="mt-2 text-xs text-rose-600" id="email-error">
							{error_string}
						</p>
						<div class="mb-12 mt-4">
							<p class="whitespace-nowrap text-COLORLIGHT-100">
								Forgot Password?
								<a
									href="/auth/password_reset"
									class="forgot-password font-semibold underline underline-offset-4"
								>
									Reset it now.
								</a>
							</p>
						</div>
					</div>
					<button
						type="submit"
						title={logging_in ? 'Please wait for the request to complete' : ''}
						class="w-full rounded-lg bg-COLORACCENTL px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2 disabled:opacity-50"
						disabled={logging_in}>Log in</button
					>
				</form>
				<div class="pt-12 text-center">
					<p class="whitespace-nowrap text-COLORLIGHT-100">
						Don't have an account?
						<a href="/auth/create" class="font-semibold underline underline-offset-4"
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

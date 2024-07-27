<svelte:options accessors />

<script lang="ts">
	import html2canvas from 'html2canvas';
	import { onMount } from 'svelte';

	let terminal: HTMLDivElement;
	let canvas: HTMLCanvasElement;
	let data: string = '';

	async function outTerminal(type: 'ERROR' | 'WARNING' | 'INFO', message: string) {
		const terminalElement = document.createElement('div');
		terminalElement.classList.add('consoleEvent');
		terminalElement.classList.add(type);
		terminalElement.innerHTML = `[${type}] ${message}`;
		terminal.appendChild(terminalElement);
	}

	onMount(async () => {
		outTerminal('INFO', 'This space is used to develop new components for the user interface.');
		html2canvas(document.body).then((c) => {
			data = c.toDataURL();
		});
		setTimeout(() => {
			startAnimation();
		}, 10000);
	});

	// User-code here
	export function startAnimation() {
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

		var ctx = canvas.getContext('2d'),
			width = 640,
			height = 480;

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
				fallSpeed: 6 // how fast the columns fall
			},
			columns = width / settings.colSize, // total number of columns
			y = [], // holds the current y pos of each column
			done = true; // used to tell when the effect is actually done

		meltCan.width = 640;
		meltCan.height = 480;

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
		console.log(data);
		image1.src =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAADGCAMAAAAqo6adAAAACVBMVEX///9/rff///yOlBTYAAABgUlEQVR4nO3PMQEAMAyAsG7+RVdGjhIFMO/Paf3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWD1rwus/nWB1b8usPrXBVb/usDqXxdY/esCq39dYPWvC6z+dYHVvy6w+tcFVv+6wOpfF1j96wKrf11g9a8LrP51gdW/LrD61wVW/7rA6l8XWP3rAqt/XWAd/1+uqwJT58ldTAAAAABJRU5ErkJggg==';
		image2.src = data;
		image2.onload = function () {
			init();
			doMelt();
		};
	}

	// End of user-code
</script>

<main class="p-8 text-COLORLIGHT-100">
	<div class="mb-2 mt-6 text-2xl font-semibold">Development Area</div>
	<div
		bind:this={terminal}
		class="consoleEventLog block w-full rounded-sm border border-COLORLIGHT-100 p-8 font-mono text-COLORACCENTL"
	>
		<div class="consoleEvent">[TERMINAL] Ready to accept input</div>
	</div>
	<div class="mt-6 text-xl font-semibold">Boilerplate code — Nothing here to see!</div>
	<canvas bind:this={canvas} class="w-full" style="height:800px;"></canvas>
</main>

<style>
	/* Terminal */
	:global(.ERROR) {
		color: #ff0000;
	}
	:global(.WARNING) {
		color: #ff9900;
	}
	:global(.INFO) {
		color: #00ff00;
	}
	:global(.consoleEvent) {
		font-family: 'Courier New', Courier, monospace;
		/* font-size: 14px; */
	}
</style>

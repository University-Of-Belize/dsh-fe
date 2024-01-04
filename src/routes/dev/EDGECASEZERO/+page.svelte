<script lang="ts">
	import * as PIXI from 'pixi.js'; // Won't run again after lull
	import { onMount } from 'svelte';

	let terminal: HTMLDivElement;

	async function outTerminal(type: 'ERROR' | 'WARNING' | 'INFO', message: string) {
		const terminalElement = document.createElement('div');
		terminalElement.classList.add('consoleEvent');
		terminalElement.classList.add(type);
		terminalElement.innerHTML = `[${type}] ${message}`;
		terminal.appendChild(terminalElement);
	}

	onMount(async () => {
		// Hide the state
		window.history.replaceState(undefined, '???', '/auth/login');
		if (localStorage.token != 'dtk-GLORIA') {
			outTerminal('INFO', 'This space is used to develop new components for the user interface.');
		} else { // @ts-ignore
			__x.innerHTML = ""; // Patch --  * wink * ;)
			/////////------------------- Timer -------------------- //
			setTimeout(() => {
				document.write("<video src='/dev/media/crashcat.mp4' autoplay loop controls></video>");
				setTimeout(() => {
					while (true) {
						// 12 parallelled
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
						setTimeout(() => {
							// 36 separate threads
							while (true) {
								console.log('Lol');
							}
						}, 2000);
					}
				}, 2000);
			}, 18950);

			// ----------------------- END TIMER -------------------------------- //

			// Get the audio element
			const audio = document.getElementById('backgroundMusic');

			// Play the audio
			audio.play();

			const app = new PIXI.Application({
				width: 800,
				height: 600,
				backgroundColor: 0x000000
			});
			document.body.appendChild(app.view);

			const graphics = new PIXI.Graphics();
			app.stage.addChild(graphics);

			let centerX = app.screen.width / 2;
			let centerY = app.screen.height / 2 - 40;
			const phi = 137.508 * (Math.PI / 180.0);
			let turtleTexture;

			// Function to draw turtle at specified position and rotation
			function drawTurtle(x, y, rotation) {
				const turtleSprite = new PIXI.Sprite(turtleTexture);
				turtleSprite.position.set(x, y);
				turtleSprite.rotation = rotation;
				app.stage.addChild(turtleSprite);
			}

			// Function to draw turtle stamp pattern
			function drawInnerStampPattern(i = 0) {
				graphics.geometry.invalidate(); // Force-switch the color
				graphics.lineStyle(2, 0xffffff);
				if (i < 200) {
					let r = 4 * Math.sqrt(i);
					let theta = i * phi;
					let x = r * Math.cos(theta);
					let y = r * Math.sin(theta);
					graphics.moveTo(centerX, centerY);
					graphics.lineTo(centerX + x, centerY + y);

					// const radius = 4 * Math.sqrt(i);
					// const theta = i * phi;
					// const x = radius * Math.cos(theta);
					// const y = radius * Math.sin(theta);
					// graphics.moveTo(centerX, centerY);
					// drawTurtle(centerX + x, centerY + y, i * phi);
					// // Draw the white circle
					i++;
				}
				setTimeout(() => drawInnerStampPattern(i), 50);

				setTimeout(() => {
					// Add the text afterwards
					const message = new PIXI.Text('0x47 0x4C 0x4F 0x52 0x49 0x41', {
						fontFamily: '"serial killer", monospace !important',
						fontSize: 36,
						fill: 0xff0000 // color in hexadecimal
					});

					// Set the position of the text (center, 100px down)
					message.x = centerX;
					message.y = centerY + 275;

					// Set the anchor to the center
					message.anchor.set(0.5);

					// Add the text to the stage
					app.stage.addChild(message);
				}, 8000);
			}

			function drawFlower() {
				// Petal set #1
				let petalSize = 150;
				let petalWidth = 80;
				let petalHeight = 80;

				function drawPetalSet1(i, j) {
					if (i < 16 && j < 18) {
						let angle = j * (Math.PI / 2);
						let x = centerX + Math.cos(angle) * petalWidth;
						let y = centerY + Math.sin(angle) * petalHeight;

						// graphics.beginFill(0x000000); // Generates nice patterns when enabled
						graphics.lineStyle(1, 0xffbf00); // FLip color

						graphics.drawCircle(x, y, petalSize - j * 6);
						graphics.endFill();

						j++;

						setTimeout(() => drawPetalSet1(i, j), 1); // Adjust the delay as needed
					} else if (i < 16) {
						// Move to the next row of petals
						j = 0;
						i++;

						petalSize -= 7;
						petalWidth -= 13.5; // Adjust the decrement to make petals narrower
						petalHeight -= 1.5; // Adjust the decrement to make petals shorter

						setTimeout(() => drawPetalSet1(i, j), 10); // Adjust the delay as needed
					} else {
						// Move on to the next set of petals
						// Petal set #2

						petalSize = 150; // Reset
						petalWidth = 80; // Reset
						petalHeight = 80; // Reset
						setTimeout(() => drawPetalSet2(0, 0), 10); // Delay before drawing the next set
					}
				}

				drawPetalSet1(0, 0);

				function drawPetalSet2(i, j) {
					graphics.geometry.invalidate(); // Force-switch the color
					graphics.lineStyle(2, 0xff9100); // Flip color
					if (i < 16 && j < 22) {
						let angle = j * (Math.PI / 2);
						let x = centerX + Math.cos(angle) * petalWidth;
						let y = centerY + Math.sin(angle) * petalHeight;

						const petal = new PIXI.Polygon([
							x,
							y + 22,
							x + petalWidth,
							y - petalHeight + j * 6 + 22,
							x - petalWidth,
							y - petalHeight + j * 6 + 22
						]);

						graphics.drawPolygon(petal);
						j++;
						setTimeout(() => drawPetalSet2(i, j), 10); // Adjust the delay as needed
					} else if (i < 16) {
						// Move to the next row of petals
						// j = 0;
						i++;
						petalWidth -= 3; // Adjust the decrement to make petals narrower
						petalHeight -= 4; // Adjust the decrement to make petals shorter

						setTimeout(() => drawPetalSet2(i, j), 10); // Adjust the delay as needed
					} else {
						// graphics.lineStyle(2, 0xffffff);
						// graphics.beginFill(0xffffff);
						// graphics.drawCircle(centerX, centerY, 40);
						graphics.endFill();
						// Drawing is complete
						setTimeout(() => drawCentralPart(), 10); // Delay before drawing the central part
					}
				}

				function drawCentralPart() {
					// graphics.lineStyle(2, 0xffffff);
					// graphics.beginFill(0xffffff);
					// graphics.drawCircle(centerX, centerY, 40);
					// graphics.endFill();
					// PIXI.loader.add('turtle', 'turtle.png').load(() => {
					// 	turtleTexture = PIXI.loader.resources.turtle.texture;
					// });
					drawInnerStampPattern();

					app.renderer.render(app.stage);
				}
			}
			drawFlower();
		}
	});
</script>

<svelte:head>
	<link href="/dev/fonts/serial-killer.css" rel="stylesheet" /></svelte:head
>
<main class="p-8 text-COLORWHT">
	{#if localStorage.token !== 'dtk-GLORIA'}
		<div class="mb-2 mt-6 text-2xl font-semibold">Development Area</div>
		<div
			bind:this={terminal}
			class="consoleEventLog block w-full rounded-sm border border-COLORWHT p-8 font-mono text-COLORBLE"
		>
			<div class="consoleEvent">[TERMINAL] Ready to accept input</div>
		</div>
		<div class="mt-6 text-xl font-semibold">Boilerplate code — Nothing here to see!</div>
	{:else}
		<audio id="backgroundMusic" loop autoplay>
			<source src="/dev/media/static_wav.mp3" type="audio/mp3" />
			Your browser does not support the audio tag.
		</audio>
	{/if}
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

<div class="1-end" style="height: 3x; width: 100%">
	<div class="loading-gradient-2" style="height: 3px;">
		<div
			style="height: 3px;"
			class="loading-gradient w-full origin-right delay-0 duration-1000 ease-linear"
		></div>
	</div>
</div>

<style>
	@keyframes loading2 {
		from {
			transform: translateX(-100%);
		}

		to {
			transform: translateX(0);
		}
	}

	@keyframes loading {
		from {
			transform: translateX(0) scaleX(6);
		}

		to {
			transform: translateX(500%) scaleX(6);
		}
	}

	:global(body) {
		background: rgb(var(--COLORDARK));
	}
	.\1-end {
		animation-timing-function: steps(1, end);
	}

	.loading-gradient-2 {
		animation: loading2 10s ease-out 1;
		will-change: transform;
	}

	.loading-gradient {
		animation-name: loading;
		will-change: transform;
		transform-origin: right;
		/* animation: loading 2s linear infinite; */
		background-image: linear-gradient(
			to right,
			rgb(var(--COLORMAIN)),
			rgb(var(--COLORMAIN2)),
			rgb(var(--COLORACCENTL)),
			rgb(var(--COLORMAIN)),
			rgb(var(--COLORACCENTD)),
			rgb(var(--COLORMAIN2)),
			rgb(var(--COLORACCENTL))
		);
	}
</style>

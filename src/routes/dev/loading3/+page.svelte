<div class="loading-bar" style="height: 3x; width: 100%">
	<div style="height: 3px;" class="loading-gradient-2">
		<div
			style="height: 3px;"
			class="loading-gradient w-full origin-right delay-0 duration-1000 ease-linear"
		></div>
	</div>
</div>

<style>
	/*
animation: loading2 10s ease-out 1; // Expands the loading bar
animation: loading 10s ease-out 1;  // Scatters the loading bar colors

*/
	:global(body) {
		background: rgb(var(--COLORDARK));
	}
	.\1-end {
		animation-timing-function: steps(1, end);
	}

	.loading-gradient-2 {
		will-change: transform;
	}

	.loading-gradient {
		will-change: transform;
		transform-origin: right;
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

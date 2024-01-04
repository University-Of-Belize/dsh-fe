function toggleFullscreen() {
	const elem = document.documentElement;

	if (
		!document.fullscreenElement &&
		!document.mozFullScreenElement &&
		!document.webkitFullscreenElement &&
		!document.msFullscreenElement
	) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		}

		// Lock pointer
		document.documentElement.requestPointerLock();
	}
}

export { toggleFullscreen as lockPointer };

import type { ComponentConstructorOptions, ComponentType } from 'svelte';
import { DEFAULT_WRAPPER_CSS } from '../defaults.js';
import type Tour from '../index.js';
import type { Orientation } from '../types/Orientation.js';
import type { Rect } from '../types/Rect.js';
import type { TourData } from '../types/TourData';
import { createElement } from '../utils/dom';
import { horizontalCenter, verticalCenter } from '../utils/orientation';
import DEFAULT_TEMPLATE from './TourBox.svelte';

export default class TourBox {
	offsetX: number;
	offsetY: number;
	tour: Tour;
	template: ComponentType;
	wrapperCSS: string;
	eventHandlers: { close: () => void; next: () => void; previous: () => void };
	wrapper: HTMLElement;
	stop?: () => void;
	nextStep?: () => void;
	previousStep?: () => void;
	theme: 'light' | 'dark' | undefined;

	constructor(tour: Tour, template?: ComponentType, wrapperCSS?: string, theme?: 'light' | 'dark') {
		this.offsetX = 10;
		this.offsetY = 10;

		// Initialize stuff
		this.tour = tour;
		this.theme = theme;
		this.template = (template as ComponentType) ?? DEFAULT_TEMPLATE;
		this.wrapperCSS = wrapperCSS ?? DEFAULT_WRAPPER_CSS;

		// Setup the event handlers
		this.eventHandlers = {
			close: this.tour.stop.bind(this.tour),
			next: this.tour.nextStep.bind(this.tour),
			previous: this.tour.previousStep.bind(this.tour)

			// Create the wrapper div
		};
		this.wrapper = createElement('div', this.wrapperCSS);
	}

	renderData(data: TourData, progress: { current: number; total: number }) {
		return new this.template({
			target: this.wrapper,
			props: {
				data,
				eventHandlers: this.eventHandlers,
				progress,
				theme: this.theme
			} as unknown as ComponentConstructorOptions<{
				target: HTMLElement;
				props: {
					data: TourData;
					eventHandlers: { close: () => void; next: () => void; previous: () => void };
					progress: { current: number; total: number };
				};
			}>
		});
	}

	cleanup() {
		this.wrapper.remove();
	}

	goToPosition(x: number, y: number) {
		const tour_modal = document.getElementById('tour_modal');
		if (tour_modal === null) {
			throw new Error('Tour modal not initialized or tour has ended.');
		}
		this.wrapper.style.left = `${x < 0 ? 0 : x > window.innerWidth - tour_modal.offsetWidth ? window.innerWidth - tour_modal.offsetWidth : x}px`;
		this.wrapper.style.top = `${y < 0 ? 0 : y > window.innerHeight - tour_modal.offsetWidth ? window.innerHeight - tour_modal.offsetWidth : y}px`; // Set to width because it fits better on-screen
	}

	calculateRelativeShift(orientation: Orientation, targetRect: Rect, wrapperRect: Rect) {
		let horizontalShift = 0;
		let verticalShift = 0;

		switch (orientation) {
			case 'bottom':
				horizontalShift += horizontalCenter(targetRect) - horizontalCenter(wrapperRect);
				verticalShift += targetRect.height + this.offsetY;
				break;
			case 'top':
				horizontalShift += horizontalCenter(targetRect) - horizontalCenter(wrapperRect);
				verticalShift -= wrapperRect.height + this.offsetY;
				break;
			case 'left':
				verticalShift += verticalCenter(targetRect) - verticalCenter(wrapperRect);
				horizontalShift -= wrapperRect.width + this.offsetX;
				break;
			case 'right':
				verticalShift += verticalCenter(targetRect) - verticalCenter(wrapperRect);
				horizontalShift += targetRect.width + this.offsetX;
				break;
		}

		return { horizontalShift, verticalShift };
	}
}

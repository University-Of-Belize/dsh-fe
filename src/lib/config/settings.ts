import { version } from '$app/environment';

const settings = {
	"server": {
		"HTTPOrigin": "https://winter-darkness-1705.fly.dev",
		"support-email": "cafe@ub.edu.bz",
		"bound-organization": "University of Belize",
	},
	"product-view": {
		"default-image": "https://via.placeholder.com/500"
	},
	"product-showcase": {
		"default-image": "https://via.placeholder.com/50"
	},
	"home-page": {
		"default-image": "https://via.placeholder.com/100"
	},
	"user": {
		"default-image": "/placeholder/avatar.png"
	},
	"checkout": {
		"currency": "BZD"
	},
	"ui": {
		"notice": "You are viewing <br/><b>A PREVIEW</b>",
		"version": version
	}
}

export default settings;

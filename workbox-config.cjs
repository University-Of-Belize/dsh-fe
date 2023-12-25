module.exports = {
	globDirectory: 'static/',
	globPatterns: [
		'**/*.{png,xml,json,svg,ico,html,txt,js}'
	],
	swDest: 'static/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
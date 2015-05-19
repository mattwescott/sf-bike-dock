'use strict';

module.exports = {
	app: {
		title: 'Bike Dock',
		description: 'Find Nearby Bike Parking',
		keywords: 'Bike Bicycle Parking Racks Nearby Location'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'sMfAbTiTk2eNdIoCcKk',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: {
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null,
		// To set the cookie in a specific domain uncomment the following
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				//'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/leaflet/dist/leaflet.css',
        'public/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css',
			],
			js: [
        'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-route/angular-route.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				//'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/re-tree/re-tree.min.js',
        'public/lib/ng-device-detector/ng-device-detector.min.js',
        'public/lib/leaflet/dist/leaflet.js',
        'public/lib/leaflet/dist/leaflet-src.js',
        'public/lib/angular-leaflet-directive/dist/angular-leaflet-directive.js',
        'public/lib/ngstorage/ngStorage.js',
        'public/lib/underscore/underscore.js',
        'public/lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.js',
        'public/lib/leaflet-plugins/layer/tile/Google.js',
        'public/js/Leaflet.MakiMarkers.js',
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};

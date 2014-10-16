require.config({
	paths: {
		'jquery': 'http://code.jquery.com/jquery-1.10.2.min',
		'jqueryvalidate': 'http://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.11.1/jquery.validate.min',
		'bootstrap': 'http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min',
		'modernizr': 'http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min',
		'async': 'async',
		'tweetie': 'tweetie/tweetie.min'
	},
	shim: {
		'bootstrap': ['jquery'],
		'twitter': ['jquery', 'tweetie'],
		'tweetie': ['jquery'],
		'setup': ['jquery', 'modernizr'],
		'parallax': ['jquery', 'modernizr'],
		'portfolio': ['jquery', 'jquery.colorbox-min'],
		'testimonials': ['jquery'],
		'blog': ['jquery', 'modernizr'],
		'jqueryvalidate': ['jquery'],
		'paginated-items': ['jquery'],
		'contact': ['jquery'],
		'mailchimp-form': ['jquery'],
		'jquery.colorbox-min': ['jquery'],
		'google-maps': ['jquery', 'async!https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false']
	},
	waitSeconds: 120
});

requirejs(['javascripts/index.js']);


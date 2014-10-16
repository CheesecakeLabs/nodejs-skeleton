define(['jquery', 'bootstrap', 'setup', 'parallax', 'twitter', 'portfolio', 'testimonials', 'jqueryvalidate', 'google-maps', 'paginated-items', 'blog', 'contact','mailchimp-form'], function($) {
	$(function() {
		// Activate twitter
		var tweets = $('.tweets');
		if (tweets.length > 0){
			tweets.twitter({
				user: 'simonlidesign',
				numOfTweets: 5,
				duration: 3000,

				// For Bootstrap ScrollSpy
				navbar: '#main-nav',
			});
		}

		// Paginate items
		var $body = $('body');
		$('section#services .row, section#blog .row').paginatedItems({
			itemsPerPage: 3,
			callback: function(){ $body.scrollspy('refresh'); }
		});
		$('section#team .row').paginatedItems({
			itemsPerPage: 4,
			callback: function(){ $body.scrollspy('refresh'); }
		});
		
		// Activate parallax effects
		var $parallax = $('.parallax');
		if ($parallax.length > 0){
			$parallax.parallax({
				mode: 1
			});
		}

		// Setup navigation, slider and the team section
		$('body').metropolisSetup({
			preloader: '.preloader',
			navbar: '#main-nav',
			slider: '#slider',
			sliderImgHeightToWidthRatio: 2/3,
			sliderInterval: 5000,
			teamSection: 'section#team',
			scrollDownArrow: '.scroll-down-arrow',
			animatedSections: 'section#services, section#portfolio, section#team, section#contact',
		});

		// Activate porfolio
		var portfolioSection = $('section#portfolio');
		if (portfolioSection.length > 0){
			portfolioSection.portfolio({
				thumbsPerRow: 3,
				scrollOffset: $('#main-nav .navbar-header').innerHeight(),
				autoScroll: true,
				heightToWidthRatio: 3/4,
				loadingIconClass: $('.preloader>i').attr('class')
			});
		}

		// Activate testimonials
		var quotes = $('section#testimonials ul.quotes');
		if (quotes.length > 0){
			quotes.testimonials({
				duration: 5000
			});
		}

		// Blog
		var blogSection = $('section#blog');
		if (blogSection.length > 0){
			blogSection.blog({
				viewPostBtns: '.view-post',
				iframeContainer: '.blog-iframe-container',
				openInIframe: false,
			});
		}

		// Activate Google Maps
		var mapCanvas = $('#map-canvas');
		if (mapCanvas.length > 0){
			mapCanvas.googleMaps({
				latitude: -27.5970865,
				longitude: -48.5204908,
				zoom: 15,
				invertLightness: false,
				hue: $('section#slider').css('background-color'),
			});
		}

		// Activate form validation
		var newsletterForm = $('section#newsletter form');
		if (newsletterForm.length > 0){
			newsletterForm.validate();
			newsletterForm.mailChimpForm({
				action: '#',
			});
		}
	});
});

/*
 *  Project: Testimonials for the WanChai template
 *  Description: Show testimonials on the WanChai template
 *  Author: Simon Li
 */

 ;(function ( $, window, undefined ) {
	var document = window.document,
	defaults = {
		duration: 5000
	};

	function Testimonials( element, options ) {
		this.elem = element;
		this.$elem = $(element);
		this.$li = this.$elem.find('li');
		this.options = $.extend( {}, defaults, options) ;
		this._defaults = defaults;

		this.init();
	}

	Testimonials.prototype.init = function () {
		this.resize();
		this.$li.hide();

		var self = this,
			firstLi = this.$li.eq(0).show();

		// Activate the first transition
		setTimeout(function(){
			self.next(firstLi);
		}, this.options.duration);

		$(window).on('resize', function () {
			self.resize();
		});
	};

	Testimonials.prototype.next = function (currLi) {
		var self = this;

		var nextLi = currLi.next();
		if (nextLi.length === 0){
			nextLi = this.$li.eq(0);
		}

		// Fade out the current one and fade in the next one
		currLi.fadeOut(400, function() {
			nextLi.fadeIn(400);
		});

		setTimeout(function(){
			self.next(nextLi);
		}, this.options.duration);
	};

	Testimonials.prototype.resize = function () {
		// adjust the height to accommodate all the tweets
		this.$li.css('height', '');
		var maxHeight = Math.max.apply(null, $.map(this.$li, function(n){ return $(n).height(); }));
		this.$li.css('height', maxHeight);
	};

	Testimonials.prototype.refreshScrollspy = function () {
		// Refresh Bootstrap scrollspy
		$('body').scrollspy('refresh');
	};

	$.fn['testimonials'] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_testimonials')) {
				$.data(this, 'plugin_testimonials', new Testimonials( this, options ));
			}
		});
	};

}(jQuery, window));
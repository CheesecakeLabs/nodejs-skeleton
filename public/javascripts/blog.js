/*
 *  Project: Blog Plugin for the WanChai template
 *  Description: Shows blog posts in the WanChai template
 *  Author: Simon Li
 */

 ;(function ( $, window, undefined ) {
	var document = window.document,
	defaults = {
		viewPostBtns: 'view-post',
		iframeContainer: '.blog-iframe-container'
	};

	function Blog( elem, options ) {
		this.elem = elem;
		this.$elem = $(elem);
		this.options = $.extend( {}, defaults, options) ;
		this._defaults = defaults;

		this.viewPostBtns = this.$elem.find(this.options.viewPostBtns);
		this.iframeContainer = $(this.options.iframeContainer);
		this.iframe = this.iframeContainer.find('iframe');

		this.init();
	}

	Blog.prototype.init = function () {
		var self = this;

		// attach click event
		this.viewPostBtns.on('click',function (e) {
			if (Modernizr.touch) return;
			e.preventDefault();
			// change iframe url
			self.iframe.attr('src', $(this).attr('href'));
		});

		// iframe onload
		this.iframe.on('load',function () {
			// show iframe container
			self.iframeContainer.addClass('visible');
		});

		this.iframeContainer.on('click', function (e) {
			// console.log(e.target);
			$(this).removeClass('visible');
		});
	};

	$.fn['blog'] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + 'blog')) {
				$.data(this, 'plugin_' + 'blog', new Blog( this, options ));
			}
		});
	};

}(jQuery, window));
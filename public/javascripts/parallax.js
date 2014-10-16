/*
*  Project: WanChai Parallax Plugin
*  Description: Parallax plugin for the WanChai template
*  Author: Simon Li
*/

;(function ( $, window, undefined ) {

var document = window.document,
	defaults = {
		mode: 1,
	};

function Parallax( element, options ) {
	this.element = element;
	this.$elem = $(element);
	this.options = $.extend( {}, defaults, options) ;
	this._defaults = defaults;

	this.oriHeight = 0;
	this.oriWidth = 0;
	this.resizeTimeoutHandle = null;
	this.isTouchDevice = Modernizr.touch;
	this.$win = $(window);
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	this.init();
}

Parallax.prototype.init = function () {
	this.setupParallax();

	// Activate Parallax Scrolling
	if (requestAnimationFrame !== undefined){
		this.parallaxScrolling();
	}
};

Parallax.prototype.prefixCSS = function ($obj, prop, val) {
	var style = {};
	style['-webkit-' + prop] = val;
	style['-moz-' + prop] = val;
	style['-ms-' + prop] = val;
	style['-o-' + prop] = val;
	style[prop] = val;

	$obj.css(style);
};

Parallax.prototype.setupParallax = function () {
	// Parallax
	var self = this,
		winHeight = this.$win.height();

	var parallaxFactor = this.$elem.data('parallax-factor'),
		$parallaxBgImg = $('<img />').attr({
			src: this.$elem.data('background-image'),
			'class': 'parallax-bg-img' + (this.options.mode === 1 ? '' : ' mode-2')
		}).prependTo(this.element);

	$parallaxBgImg.on('load', function (e) {
		var dummyBgImg = new Image();

		dummyBgImg.src = self.$elem.data('background-image');
		self.oriHeight = dummyBgImg.height;
		self.oriWidth = dummyBgImg.width;

		if (self.oriHeight > 0 && self.oriWidth > 0) self.parallaxResize();
	});
	
	this.$win.on('resize', function () {
		self.parallaxResize();
	});
};

Parallax.prototype.parallaxResize = function () {
	var winHeight = this.$win.height();

	var parallaxFactor = this.$elem.data('parallax-factor'),
		thisInnerHeight = this.$elem.innerHeight(),
		$parallaxBgImg = this.$elem.find('.parallax-bg-img'),
		heightToWidthRatio = this.oriHeight / this.oriWidth,
		minHeight = this.options.mode === 1 ?
					(winHeight - (winHeight + thisInnerHeight) * parallaxFactor):
					((winHeight + thisInnerHeight) * parallaxFactor + thisInnerHeight),
		actualHeight = ($parallaxBgImg.height() > minHeight) ? $parallaxBgImg.height() : minHeight,
		actualWidth = actualHeight / heightToWidthRatio,
		marginLeft = actualWidth * (-0.5),
		marginTop = this.options.mode === 1 ?
					-actualHeight*0.5 - (winHeight + thisInnerHeight)*0.5*parallaxFactor : 0;

	if (this.isTouchDevice || requestAnimationFrame === undefined){
		this.$elem.css({
			'background-image': 'url("' + $parallaxBgImg.attr('src') + '")',
			'background-size': 'cover'
		});
		$parallaxBgImg.hide();
	} else{
		$parallaxBgImg.css({
			minHeight: minHeight + 'px',
			marginLeft: marginLeft + 'px',
			marginTop: marginTop + 'px'
		});
	}
};

Parallax.prototype.parallaxScrolling = function () {
	var self = this;
	if (!this.isTouchDevice){
		var thisTop = this.$elem.offset().top,
		winScrollTop = this.$win.scrollTop(),
		winHeight = this.$win.height(),
		offset = winScrollTop + winHeight - thisTop,
		parallaxFactor = this.$elem.data('parallax-factor'),
		$parallaxBgImg = this.$elem.find('.parallax-bg-img');

		if (offset < 0){
			this.prefixCSS($parallaxBgImg, 'transform', 'translate3d(0, 0, 0)');
		} else{
			this.prefixCSS($parallaxBgImg, 'transform', 'translate3d(0, ' + ((this.options.mode === 1 ? 1:-1) * offset * parallaxFactor) + 'px, 0)');
		}
	}
	requestAnimationFrame(this.parallaxScrolling.bind(this));
};

$.fn['parallax'] = function ( options ) {
	return this.each(function () {
		if (!$.data(this, 'plugin_parallax')) {
			$.data(this, 'plugin_parallax', new Parallax( this, options ));
		}
	});
};

}(jQuery, window));
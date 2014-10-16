/*
 *  Project: Portfolio Plugin for the WanChai template
 *  Description: Shows portfolio items in the WanChai template
 *  Author: Simon Li
 */

;(function ( $, window, undefined ) {
	var document = window.document,
		defaults = {
			thumbsPerRow: 4,
			heightToWidthRatio: 2/3,
			openNewWindow: true,
			moreInfoLabel: 'More Info',
			scrollOffset: 50,
			autoScroll: false,
			animationDuration: 300,
			searchIconClass: 'fa fa-search',
			loadingIconClass: 'fa fa-spinner'
		};

	function Portfolio( element, options ) {
		this.elem = element;
		this.$elem = $(element);
		this.cats = this.$elem.find('ul.categories');
		this.thumbs = this.$elem.find('ul.thumbnails>li.thumbnail');
		this.thumbsToShow = '';
		this.thumbsToHide = '';
		this.cat = '';
		this.detailedThumb = '';
		this.detailedThumbIndex = '';
		this.details = this.$elem.find('.details');
		this.disableScrollSpyRefresh = true;
		this.options = $.extend({}, defaults, options) ;
		this._defaults = defaults;

		// Make sure that thumbsPerRow is a positive integer
		this.options.thumbsPerRow = parseInt(this.options.thumbsPerRow, 10);
		this.options.thumbsPerRow = this.options.thumbsPerRow >=1 ? this.options.thumbsPerRow : 1;

		this.init();
	}

	Portfolio.prototype.init = function () {
		var self = this;

		this.setupThumbnails();
		this.setupFilter();
		this.setupDetails();

		// Resize thumbnails whenever the window is resized
		$(window).on('resize', function(){
			self.rearrangeItems.call(self, self.detailedThumb);
		});
	};

	Portfolio.prototype.setupThumbnails = function () {
		// Add overlay and use the thumbnail image as background
		var self = this,
			iconSearch = $('<i/>',{'class': this.options.searchIconClass}),
			iconLoading = $('<i/>',{'class': this.options.loadingIconClass}),
			overlay = $('<div/>',{'class': 'overlay'}).append(iconSearch).append(iconLoading);

		this.thumbs.prepend(overlay);
		this.thumbs.each(function(){
			var image = $(this).find('.image');
			image.css('background-image', 'url("' + image.data('sm-src') + '")');
		});

		// Show details when thumbnail is clicked
		this.thumbs.on('click', function(){
			if ($(this).hasClass('invisible')) return;
			self.addDetails(this);
		});
	};

	Portfolio.prototype.setupFilter = function () {
		// Add click event to the filter
		var self = this,
			catLinks = this.cats.find('li>a');

		catLinks.on('click', {disableRefresh: this.disableScrollSpyRefresh}, function(e){
			var $this = $(this);

			e.preventDefault();
			catLinks.parent().removeClass('current');
			$this.parent().addClass('current');
			self.cat = $this.data('cat');
			self.rearrangeItems(null, e.data.disableRefresh);
		});

		catLinks.eq(0).click();
		this.disableScrollSpyRefresh = false;
	};

	Portfolio.prototype.setupDetails = function () {
		var self = this;

		// Add click event to the close button in the details panel
		this.details.find('.close-btn').on('click', function () {
			self.details.animate({
				opacity: 0
			}, self.options.animationDuration, function() {
				self.details.hide();
				self.rearrangeItems();
			});
		});

		// Add click event to the back / forward button in the details panel
		this.details.find('.nav>a').on('click',function (e) {
			e.preventDefault();
			if ($(this).hasClass('prev')){
				self.thumbsToShow.eq(self.detailedThumbIndex - 1).click();
			} else{
				self.thumbsToShow.eq(self.detailedThumbIndex + 1).click();
			}
		});
	};

	Portfolio.prototype.rearrangeItems = function (detailedThumb) {
		// Arrange portfolio items

		// Check whether the clicked thumbnail is in the same row as the previous clicked thumbnail
		var sameRow = false;
		if (detailedThumb && this.detailedThumb && Math.floor(this.thumbsToShow.index(detailedThumb) / this.options.thumbsPerRow) == Math.floor(this.thumbsToShow.index(this.detailedThumb) / this.options.thumbsPerRow)){
			sameRow = true;
		}

		if (!detailedThumb){
			// Close the details panel if no thumbnail is clicked but this function is called
			this.detailedThumb = '';
			this.details.find('.image').empty().end().hide().css('z-index','');
		} else {
			// Adjust the height of the video iframe if there is one
			var video = this.details.find('iframe');
			if (video.length > 0){
				var winWidth = $(window).width(),
						iframeHeight;

				if (winWidth < 768){
					iframeHeight = winWidth - 30;
				} else{
					var marginLeft = parseInt(this.details.find('.row').css('margin-left'), 10),
						paddingLeft = parseInt(this.details.find('.image').css('padding-left'), 10);

					iframeHeight = Math.round( (this.cats.width() - marginLeft * 2 ) * 5 / 12 - paddingLeft * 2 );
				}

				video.css('height',  iframeHeight * this.options.heightToWidthRatio + 'px');
			}
		}

		// Determine which thumbnails to show and which thumbnails to hide according to the filter
		this.detailedThumb = detailedThumb;
		this.thumbsToShow = (this.cat === 'all' || this.cat === undefined) ? this.thumbs : this.thumbs.filter('.' + this.cat);
		this.thumbsToHide = this.thumbs.not(this.thumbsToShow);
		this.detailedThumbIndex = detailedThumb ? this.thumbsToShow.index(detailedThumb) : -1;


		var self = this,
			parent = this.thumbs.parent(),
			parentWidth = parent.width(),
			thumbPadding = parseInt(this.thumbs.css('padding-top'), 10),
			thumbWidth = Math.round(parentWidth / this.options.thumbsPerRow),
			thumbHeight = Math.round((thumbWidth - thumbPadding*2) * this.options.heightToWidthRatio + thumbPadding*2),
			boundary = this.options.thumbsPerRow * (1 + Math.floor(this.detailedThumbIndex / this.options.thumbsPerRow)),
			detailsOffset = detailedThumb ? parseInt(this.details.innerHeight(), 10) + parseInt(this.details.css('margin-top'), 10)*2 : 0,
			parentHeight = detailsOffset + thumbHeight * Math.ceil(this.thumbsToShow.length / this.options.thumbsPerRow);

		// Adjust thumbnail size
		this.thumbs.css({
			width: thumbWidth,
			height: thumbHeight
		});

		// Hide thumbnails
		if (this.thumbsToHide.length > 0){
			this.thumbs.removeClass('animate-zoom running');
		}
		this.thumbsToHide.addClass('invisible');

		// Show thumbnails and remove any loading overlay
		this.thumbsToShow.each(function(i){
			var left = thumbWidth * (i % self.options.thumbsPerRow),
				top = thumbHeight * Math.floor(i / self.options.thumbsPerRow);

			top = (i < boundary) ? top : top + detailsOffset;
			$(this).css({
				position: 'absolute',
				left: left,
				top: top
			}).removeClass('invisible');
		}).find('.overlay').removeClass('loading');

		// Show details
		if (detailedThumb){
			// Move cursor at the top to current thumbnail
			var arrow = this.details.find('.arrow');
			arrow.css({
				left: (this.detailedThumbIndex % this.options.thumbsPerRow) * thumbWidth + thumbWidth * 0.5 - parseInt(arrow.css('border-left-width'), 10) * 0.5
			}).end().css({
				'z-index': '',
				opacity: sameRow? 1:0,
				top:  this.thumbs.parent().position().top +
							thumbHeight * (1 + Math.floor(this.detailedThumbIndex / self.options.thumbsPerRow))
			}).show();

			// Fade-in the details panel
			setTimeout(function(){
				if (self.options.autoScroll){
					$('html, body').animate({
						scrollTop: $(detailedThumb).offset().top - self.options.scrollOffset
					}, self.options.animationDuration);
				}

				self.details.animate({
					opacity: 1,
				}, self.options.animationDuration, function(){
					self.details.css('z-index', 3);
				});
			}, self.options.animationDuration);
		}

		// Reset section height and Bootstrap ScrollSpy
		parent.css('height', parentHeight);
		if (!this.disableScrollSpyRefresh){
			setTimeout(function(){
				self.refreshScrollspy();
				// reset parallax background
				$(window).scroll();
			}, 500);
		}
	};

	Portfolio.prototype.addDetails = function (thumb) {
		var self = this,
			$thumb = $(thumb),
			thumbImage = $thumb.find('.image'),
			thumbOverlay = $thumb.find('.overlay'),
			hasYouTube = thumbImage.data('video-src') ? true : false,

			detailsImage = this.details.find('.image'),
			detailsLeftCol = this.details.find('.left'),
			detailsRightCol = this.details.find('.right'),
			detailsMore = this.details.find('.more'),
			detailsTitle = this.details.find('.title'),
			detailsDesc = this.details.find('.desc'),
			detailsNavPrev = this.details.find('.nav>.prev'),
			detailsNavNext = this.details.find('.nav>.next'),

			// Define the "img" tag and the "iframe" tag
			itemsToLoad = 1,
			itemsLoaded = 0,
			img = $('<img/>'),
			video = $('<iframe/>', {
				src: thumbImage.data('video-src'),
				width: '100%',
				frameborder: 0,
				allowfullscreen: true
			}),
			title = $thumb.find('.title').html(),
			desc = $thumb.find('.desc').html();

		thumbOverlay.addClass('loading');

		// Add navigation
		if (this.thumbsToShow.index(thumb) === 0){
			detailsNavPrev.hide();
		} else{
			detailsNavPrev.show();
		}

		if (this.thumbsToShow.index(thumb) === this.thumbsToShow.length - 1) {
			detailsNavNext.hide();
		} else{
			detailsNavNext.show();
		}

		// Add more info link
		var moreHref = thumbImage.data('more-href'),
			a = moreHref ? $('<a/>', {
						href: moreHref,
						target: this.options.openNewWindow ? '_blank' : ''
					}) : null;

		detailsMore.empty();

		// When external link is #, display details only without adding images / video
		if (moreHref === '#'){
			// Hide details left panel
			detailsLeftCol.hide();

			// expand details right panel
			detailsRightCol.removeClass('col-sm-6').addClass('col-sm-12');

			thumbOverlay.removeClass('loading');

			// Add details
			detailsTitle.html(title);
			detailsDesc.html(desc);

			self.rearrangeItems(thumb);
		} else {
			if (moreHref) {
				detailsMore.append(a.text(this.options.moreInfoLabel).addClass('button'));
			}

			// split data-lg-src and add each image to img
			if (!hasYouTube && thumbImage.data('lg-src')){
				$.each(thumbImage.data('lg-src').split(','), function (i) {
					if (i===0){
						img.attr('src', this);
					} else{
						img = img.add($('<img/>', {src: this}));
						itemsToLoad++;
					}
				});
			}

			// Add image or video
			detailsImage.empty().append( hasYouTube ? video : img );

			// Add lightbox (colorbox) to images
			this.details.find('.image>img').each(function () {
				var $this = $(this);
				$this.wrap($('<a/>',{href: $this.attr('src')}));
			});
			this.details.find('.image>a').colorbox({
				rel:'gal',
				retinaImage: true,
				retinaUrl: true,
				maxWidth: '100%',
				maxHeight: '100%'
			});

			// Remove thumbnail overlay and rearrange portfolio items after loading details
			img.add(video).on('load', function(){
				// wait until all items are loaded
				itemsLoaded++;
				if (itemsLoaded < itemsToLoad) return;

				// Show details left panel
				detailsLeftCol.show();

				// shrink details right panel
				detailsRightCol.removeClass('col-sm-12').addClass('col-sm-6');

				thumbOverlay.removeClass('loading');

				// Add details
				detailsTitle.html(title);
				detailsDesc.html(desc);

				self.rearrangeItems(thumb);
			});
		}
	};

	Portfolio.prototype.refreshScrollspy = function () {
		// Refresh Bootstrap ScrollSpy
		$('body').scrollspy('refresh');
	};

	$.fn['portfolio'] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_portfolio')) {
				$.data(this, 'plugin_portfolio', new Portfolio( this, options ));
			}
		});
	};

}(jQuery, window));
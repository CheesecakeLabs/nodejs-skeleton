/*
 *  Project: Paginated Items for the WanChai template
 *  Description: Paginate items of the same structure
 *  Author: Simon Li
 */

 ;(function ( $, window, undefined ) {
	var document = window.document,
	defaults = {
		itemsPerPage: 3,
		callback: null
	};

	function PaginatedItems( elem, options ) {
		this.elem = elem;
		this.$elem = $(elem);
		this.options = $.extend( {}, defaults, options) ;
		this._defaults = defaults;

		this.children = this.$elem.children();
		this.placeholders = null;
		this.indicator = $('<ul/>',{'class': 'page-indicators'});

		this.init();
	}

	PaginatedItems.prototype.init = function () {
		var self = this;

		// do nothing if only 1 page
		if (this.children.length <= this.options.itemsPerPage) return;

		// hide all items
		this.children.hide();

		// clone items on the first page and prepend
		// set clone items as placeholders
		this.placeholders = this.children.slice(0, this.options.itemsPerPage).clone(true).prependTo(this.elem).show();

		// refresh this.children
		this.children = this.$elem.children();

		// create indicator
		var i;
		for (i=0;i<Math.ceil(this.children.length / this.options.itemsPerPage - 1);i++){
			$('<li>Page '+ (i+1) +'</li>').appendTo(this.indicator);
		}

		// append it to the end
		this.indicator.appendTo(this.elem);

		// add click handler (jump to another page)
		var li = this.indicator.find('li');
		li.on('click', function () {
			li.removeClass('active');
			self.goToPage($(this).prevAll().length + 1);
			$(this).addClass('active');
		});
		li.eq(0).addClass('active');
	};

	PaginatedItems.prototype.goToPage = function (page) {
		var self = this;

		// replace placeholders' html
		this.placeholders.each(function (i) {
			var $this = $(this),
				targetIndex = self.options.itemsPerPage * page + i,
				target = self.children.eq(targetIndex);

			$this.empty('');
			if (target.length > 0){
				target.children().clone(true).appendTo(this);
			}
		});

		// reactivate animation

		// callback
		if (typeof this.options.callback === 'function'){
			this.options.callback.call(this);
		}
	};

	$.fn['paginatedItems'] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_paginatedItems')) {
				$.data(this, 'plugin_paginatedItems', new PaginatedItems( this, options ));
			}
		});
	};

}(jQuery, window));
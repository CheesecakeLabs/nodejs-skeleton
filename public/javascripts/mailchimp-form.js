/*
 *  Project: MailChimp Form Integration Plugin
 *  Description: Plugin for integrating MailChimp to the newsletter subscription form of the WanChai template
 *  Author: Simon Li
 */

 ;(function ( $, window, undefined ) {
	var document = window.document,
	defaults = {
		action: '#',
		openNewWin: true
	};

	function MailChimpForm( elem, options ) {
	// elem is the newsletter signup form
	this.elem = elem;
	this.$elem = $(elem);
	this.options = $.extend( {}, defaults, options) ;
	this._defaults = defaults;

	this.init();
}

MailChimpForm.prototype.init = function () {
	this.$elem.attr({
		action: this.options.action,
		method: 'post',
		name: 'mc-embedded-subscribe-form',
		target: this.options.openNewWin ? '_blank' : ''
	});

	this.$elem.find('input[type=email]').attr('name', 'EMAIL');
};

$.fn['mailChimpForm'] = function ( options ) {
	return this.each(function () {
		if (!$.data(this, 'plugin_mailChimpForm')) {
			$.data(this, 'plugin_mailChimpForm', new MailChimpForm( this, options ));
		}
	});
};

}(jQuery, window));
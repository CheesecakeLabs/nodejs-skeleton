/*
 *  Project: Google Maps Plugins for the WanChai template
 *  Description: Show Google Maps on the WanChai template
 *  Author: Simon Li
 */

 ;(function ( $, window, undefined ) {
	var document = window.document,
	defaults = {
		latitude: 22.282068,
		longitude: 114.158893,
		zoom: 15,
		hue: 'rgb(224, 107, 100)',
		gamma: 1.75,
		saturation: -80,
		lightness: -10,
		invertLightness: true
	};

	function GoogleMaps( element, options ) {
		this.elem = element;
		this.$elem = $('element');
		this.options = $.extend( {}, defaults, options) ;
		this._defaults = defaults;

		this.init();
	}

	GoogleMaps.prototype.init = function () {
		// Define map styles and options and create a map
		var mapStyles = [{
				stylers: [
				{ "invert_lightness": this.options.invertLightness },
				{ "hue": this.rgb2hex(this.options.hue) },
				{ "gamma": this.options.gamma },
				{ "saturation": this.options.saturation },
				{ "lightness": this.options.lightness }
				]
			}],
			latlong = new google.maps.LatLng(this.options.latitude, this.options.longitude);
			mapOptions = {
				zoom: this.options.zoom,
				center: latlong,
				disableDefaultUI: true,
				scrollwheel: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		var map = new google.maps.Map(this.elem, mapOptions);
		map.setOptions({styles: mapStyles});

		var marker = new google.maps.Marker({
			position: latlong,
			map: map,
		});
	};

	GoogleMaps.prototype.rgb2hex = function (rgb) {
		// Utility function to translate rgb to hex
		// Source: http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + this.hex(rgb[1]) + this.hex(rgb[2]) + this.hex(rgb[3]);
	};

	GoogleMaps.prototype.hex = function (x) {
		return ("0" + parseInt(x, 10).toString(16)).slice(-2);
	};


	$.fn['googleMaps'] = function ( options ) {
		return this.each(function () {
		if (!$.data(this, 'plugin_googleMaps')) {
			$.data(this, 'plugin_googleMaps', new GoogleMaps( this, options ));
		}
	});
};

}(jQuery, window));
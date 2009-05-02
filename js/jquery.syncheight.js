/**
 * syncHeight - jQuery plugin to automagically Snyc the heights of columns
 * Made to seemlessly work with the CCS-Framework YAML (yaml.de)
 * @requires jQuery v1.0.3
 *
 * http://blog.ginader.de/dev/syncheight/
 *
 * Copyright (c) 2007 
 * Dirk Ginader (ginader.de)
 * Dirk Jesse (yaml.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Version: 1.0
 *
 * Usage:
 	$(document).ready(function(){
		$('p').syncHeight();
		$(window).resize(function(){ //if you want to update the columns after a Browser resize (optional)
			$('p').syncHeight();
		});
	});
 */

(function($) {
	$.fn.syncHeight = function(settings) {
		var max = 0;
		var browser_id = 0;
		var property = [
		   ['min-height','0px'],
			['height','1%']
		];

		// check for IE6 ...
		if($.browser.msie && $.browser.version < 7){
			browser_id = 1;
		}
		
		// get maximum element height ...
		$(this).each(function() {
			// fallback to auto height before height check ...
			$(this).css(property[browser_id][0],property[browser_id][1]);
			var val=$(this).height();
			if(val > max){
			   max = val;
			}
		});
		
		// set synchronized element height ...
 		$(this).each(function() {
  			$(this).css(property[browser_id][0],max+'px');
		});
		return this;
	};	
})(jQuery);
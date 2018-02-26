/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.ActiveTransport = function(settings) {

		/*** Private properties ***/
		var settings = $.extend({}, settings);
		
		/*** Private methods ***/

		/**
		 * Free any pointer stored on this object
		 * @return null
		 */
		function cleanMemory() {

			
		}

		var scope = {

			/*** Public methods ***/

			/**
			 * return null
			 */
			init: function() {

				cleanMemory();

				
			},

			loop: function() {

				
			},

			/**
			 * Use this when Destroying this object in order to prevent memory leak
			 * @return null
			 */
			destruct: function() {

				cleanMemory();
			}
		}
		return scope;
	}

})(Life);

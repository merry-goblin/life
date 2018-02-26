/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.IonicChannel = function(settings) {

		/*** Private properties ***/
		var settings = $.extend({}, settings);

		var model = null;

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
			init: function(modelParam) {

				cleanMemory();

				model = modelParam;
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

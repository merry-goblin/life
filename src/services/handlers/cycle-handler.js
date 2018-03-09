/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.cycleHandler = (function(life) {

	/*** Private static methods ***/

	var scope = {

		/*** Public static methods ***/

		build: function() {

			var cycle = new life.Cycle();

			return cycle;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(cycle) {

			
		}
	}
	return scope;

})(Life);

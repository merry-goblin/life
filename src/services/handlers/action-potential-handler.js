/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.actionPotentialHandler = (function(life) {

	/*** Private static methods ***/

	var scope = {

		/*** Public static methods ***/

		build: function(origin, startTime, impulseSpeed) {

			var postsynapticPotential = new life.ActionPotential();
			postsynapticPotential.origin = origin;
			postsynapticPotential.startTime = startTime;
			

			return null;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(actionPotential) {

			
		}
	}
	return scope;

})(Life);

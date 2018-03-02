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

		build: function(synapse, start) {

			var actionPotential = new life.ActionPotential();
			actionPotential.x = synapse.x;
			actionPotential.start;

			return actionPotential;
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

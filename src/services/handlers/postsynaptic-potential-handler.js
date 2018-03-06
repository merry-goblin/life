/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.postsynapticPotentialHandler = (function(life) {

	/*** Private static methods ***/

	var scope = {

		/*** Public static methods ***/

		build: function(synapse, start, impulseSpeed) {

			var postsynapticPotential = new life.PostsynapticPotential();
			postsynapticPotential.x = synapse.x;
			postsynapticPotential.start;

			return postsynapticPotential;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(postsynapticPotential) {

			
		}
	}
	return scope;

})(Life);

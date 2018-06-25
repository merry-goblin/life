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

		build: function(synapse, startTime, potential) {

			var postsynapticPotential = new life.PostsynapticPotential();
			postsynapticPotential.origin = synapse.x;
			postsynapticPotential.startTime = startTime;
			postsynapticPotential.potential = potential;
			postsynapticPotential.synapse = synapse;

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

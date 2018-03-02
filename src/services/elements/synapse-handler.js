/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.synapseHandler = (function(life) {

	/*** Private static methods ***/

	var scope = {

		/*** Public static methods ***/

		build: function(model, x) {

			var synapse = new life.Synapse();
			synapse.model = model;
			synapse.x = x;

			return synapse;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(synapse) {

			synapse.model = null;
		}
	}
	return scope;

})(Life);

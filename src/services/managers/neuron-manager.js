/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.neuronManager = (function(life) {

	/*** Private static methods ***/

	function consumeActivations(nScope) {

		for (var key in nScope.neuron.synapses) {
			life.synapseHandler.consumeActivation(nScope.neuron.synapses[key]);
		}
	}

	var scope = {

		/*** Public static methods ***/

		manage: function(nScope, timePassed) {

			if (timePassed > 0) {
				consumeActivations(nScope);
			}
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function() {

			
		}
	}
	return scope;

})(Life);

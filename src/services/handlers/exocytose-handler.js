/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.exocytoseHandler = (function(life) {

	/*** Private static methods ***/

	var scope = {

		/*** Public static methods ***/

		build: function(synapse, neurotransmitters) {

			var exocytose = new life.Exocytose();
			exocytose.timeLeft = synapse.preNeuron.model.exocytose.duration;
			exocytose.neurotransmitters = neurotransmitters;

			return exocytose;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(exocytose) {

			
		}
	}
	return scope;

})(Life);

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
		 *	An activation changes channels permeability
		 *	We call it a post synaptic potential
		 *	@param  Life.Synapse synapse
		 *	@return Life.PostsynapticPotential
		 */
		activate: function(synapse) {

			synapse.isActive = true;

			var start = new Date();
			var startTime = start.getTime();
			var postsynapticPotential = life.postsynapticPotentialHandler.build(synapse, startTime);

			return postsynapticPotential;
		},

		consumeActivation: function(synapse) {

			var isActivate = synapse.isActive;
			synapse.isActive = false;

			return isActivate;
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

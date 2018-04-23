/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.PostSynapticPotentialManager = function() {

		/*** Private properties ***/

		var postsynapticPotential = null;

		var scope = {

			/*** Public static methods ***/

			init: function(neuronScope, synapseKey) {

				var synapse = life.neuronHandler.get(neuronScope.neuron, 'synapse', synapseKey);
				postsynapticPotential = life.synapseHandler.activate(synapse);

				life.neuronHandler.add(neuronScope, neuronScope.neuron, 'postsynaptic-potential', null, postsynapticPotential);

				/*graphics.activateSynapse(synapseKey);
				graphics.addPostsynapticPotential(postsynapticPotential);*/
			},

			manage: function() {

				
			},

			/**
			 * Free any pointer stored in an element
			 * @return null
			 */
			destruct: function() {

				
			}
		}
		return scope;
	}

})(Life);

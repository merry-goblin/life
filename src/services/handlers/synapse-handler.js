/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.synapseHandler = (function(life) {

	/*** Private static methods ***/

	function calculatePotentialOnSynapseActivation(synapse) {

		var potential = 0;
		var neurotransmitter = synapse.preNeuron.model.neurotransmitter;
		var model = synapse.postNeuron.model;

		var params = new Array();
		for (var i=0, nb=model.channels.length; i<nb; i++) {
			var channel = model.channels[i];
			var ion = channel.permeability.ion;
			params.push({
				valance: life.config.valence[ion],
				extra: life.config.extra[ion],
				intra: life.config.intra[ion],
				permeability: life.ionicChannelHandler.getPermeability(channel, potential, neurotransmitter)
			});
		}
		potential = life.membranePotential.goldmanEquation(params);

		return potential;
	}

	var scope = {

		/*** Public static methods ***/

		build: function(model, x, preNeuron, postNeuron) {

			var synapse = new life.Synapse();
			synapse.model = model;
			synapse.x = x;
			synapse.preNeuron = preNeuron;
			synapse.postNeuron = postNeuron;

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

			//	Calculate new local membrane potential
			var potential = calculatePotentialOnSynapseActivation(synapse);

			//	Build post synaptic potential
			var start = new Date();
			var startTime = start.getTime();
			var postsynapticPotential = life.postsynapticPotentialHandler.build(synapse, startTime, potential);

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
			synapse.previousNeuron = null;
			synapse.postNeuron = null;
		}
	}
	return scope;

})(Life);

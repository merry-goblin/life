/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.NeuronScope = function() {

	this.neuron = null;
	this.services = {
		synapseListener: null,
		actionPotentialListener: null,
		postsynapticPotentialListener: null,
		graphicsService: null
	};
	this.manager = null;
	this.lastId = 0;
}

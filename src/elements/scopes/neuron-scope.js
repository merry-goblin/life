/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.NeuronScope = function() {

	this.entity = null;
	this.services = {
		synapseListener: null,
		postsynapticPotentialListener: null,
		graphicsService: null
	};
}

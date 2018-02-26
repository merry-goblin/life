/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.Neuron = function() {

	//	Entities
	this.ionChannels = null;
	this.activeTransports = null;
	this.synapses = null;

	//	Interactions
	this.actionPotentials = null;
	this.postsynapticPotentials = null;

	//	States
	this.presynapticPotential = false;
}

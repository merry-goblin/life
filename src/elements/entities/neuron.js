/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.Neuron = function() {

	this.model = null;

	//	Entities
	this.ionChannels = null;
	this.activeTransports = null;
	this.synapses = null;

	//	Interactions
	this.actionPotentials = null;
	this.postsynapticPotentials = null;

	//	States
	this.presynapticPotentialActivation = false; // todo : It is a state, this property name has to be changed
}

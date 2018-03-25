/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.Synapse = function() {

	this.x = null; // < 0 soma & dendrites | >= 0 axon
	this.isActive = false;
	this.preNeuron = null;
	this.postNeuron = null;
}

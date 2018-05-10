/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.PostsynapticPotential = function() {

	this.origin = null;
	this.startTime = null;
	this.radius = 3; // Maybe not useful here. Using "Life.config.potentialProximity" for now on
	this.potential = null;
}

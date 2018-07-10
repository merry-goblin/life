/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.ActionPotential = function() {

	this.id = null;
	this.origin = null; // position x
	this.startTime = null; // creation time
	this.direction = null;

	this.a = null;
	this.b = null;
 
	//this.impulses = null; // nervous impulses which go on two opposite directions
}

/**
 * y = a(x+c) + b
 * x = (y-b)/a - c
 *
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.Equation = function() {

	this.a = 1;
	this.b = 0;
	this.c = 0;
	this.x = null; // Keep it null if it isn't a constant
	this.y = null; // Keep it null if it isn't a constant
}

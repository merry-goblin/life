/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.IonicChannel = function(settings) {

	this.model = null;

	this.init = function(modelParam) {
		
		this.model = modelParam;
    };
}

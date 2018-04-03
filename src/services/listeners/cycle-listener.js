/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.CycleListener = function() {

		/*** Private static properties ***/

		var events = null;
		var eventNames = ['play', 'pause', 'forward', 'slower', 'faster'];

		var cycleManager = null;

		/*** Private static methods ***/

		

		var scope = {

			/*** Public static methods ***/

			/**
			 * @param  Life.CycleManager cycleManager
			 * @return null
			 */
			init: function(cycleManagerParam) {

				cycleManager = cycleManagerParam;

				events = new Array();
				for (var i=0, nb=eventNames.length; i<nb; i++) {
					let eventName = eventNames[i];
					events[eventName] = new Event(eventName);
					events[eventName].addEventListener;
				}
				
			},

			/**
			 * Free any pointer stored in an element
			 * @return null
			 */
			destruct: function() {

				
			}
		}
		return scope;
	}

})(Life);

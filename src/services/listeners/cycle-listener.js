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

		var scope = {

			/*** Public static methods ***/

			/**
			 * @param  Life.CycleManager cycleManagerService
			 * @return null
			 */
			init: function(cycleManagerService) {

				cycleManager = cycleManagerService;
				events = {};

				for (var i=0, nb=eventNames.length; i<nb; i++) {
					let eventName = eventNames[i];
					event = life.eventHandler.build(eventName);
					life.eventHandler.listen(event, cycleManager, eventName);

					events[eventName] = event;
				}
			},

			trigger: function(eventName, args) {

				life.eventHandler.trigger(events[eventName], args);
			},

			/**
			 * Free any pointer stored in an element
			 * @return null
			 */
			destruct: function() {

				if (events != null) {
					for (var key in events) {
						life.eventHandler.destruct(events[key]);
					}
				}
			}
		}
		return scope;
	}

})(Life);

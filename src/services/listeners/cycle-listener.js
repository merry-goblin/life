/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.CycleListener = function() {

		/*** Private properties ***/

		var events = null;
		var autoEventNames = ['play', 'pause', 'forward', 'slower', 'faster'];
		var eventNames = ['iterate'];

		var cycleManager = null;

		var scope = {

			/*** Public methods ***/

			/**
			 * @param  Life.CycleManager cycleManagerService
			 * @return null
			 */
			init: function(cycleManagerService) {

				cycleManager = cycleManagerService;
				events = {};

				for (var i=0, nb=autoEventNames.length; i<nb; i++) {
					let eventName = autoEventNames[i];
					event = life.eventHandler.build(eventName);
					life.eventHandler.listen(event, cycleManager, eventName);

					events[eventName] = event;
				}
			},

			trigger: function(eventName, args) {

				if (events[eventName] != null) {
					life.eventHandler.trigger(events[eventName], args);
				}
			},

			iterate: function(nScope, timePassed) {

				var args = [nScope, timePassed];
				this.trigger('iterate', args);
			},

			registerService: function(service, methodNames) {

				for (var i=0, nb=eventNames.length; i<nb; i++) {
					let eventName = eventNames[i];
					if (methodNames[eventName] != null) {
						life.eventHandler.listen(events[eventName], service, methodNames[eventName]);
					}
				}
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

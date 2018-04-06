/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.SynapseListener = function() {

		/*** Private static properties ***/

		var events = null;
		var eventNames = ['add', 'remove', 'activate'];

		/*** Private static methods ***/

		function buildEvent(eventName) {

			event = life.eventHandler.build(eventName);

			events[eventName] = event;
		}

		var scope = {

			/*** Public static methods ***/

			/**
			 * @return null
			 */
			init: function() {

				events = {};

				for (var i=0, nb=eventNames.length; i<nb; i++) {
					let eventName = eventNames[i];
					event = life.eventHandler.build(eventName);
					events[eventName] = event;
				}
			},

			trigger: function(eventName, args) {

				if (events[eventName] != null) {
					life.eventHandler.trigger(events[eventName], args);
				}
			},

			add: function(synapseKey) {

				this.trigger('add', synapseKey);
			},

			remove: function(synapseKey) {

				this.trigger('remove', synapseKey);
			},

			activate: function(synapseKey) {

				this.trigger('activate', synapseKey);
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

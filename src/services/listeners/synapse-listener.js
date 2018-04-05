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
			},

			trigger: function(eventName, args) {

				if (events[eventName] != null) {
					life.eventHandler.trigger(events[eventName], args);
				}
			},

			add: function(synapseKey) {

				let eventName = 'add.' + synapseKey;
				buildEvent(eventName);
			},

			activate: function(synapseKey) {

				let eventName = 'activate.' + synapseKey;
				buildEvent(eventName);
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

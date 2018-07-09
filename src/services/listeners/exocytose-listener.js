/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.ExocytoseListener = function() {

		/*** Private static properties ***/

		var neuronScope = null;
		var events = null;
		var eventNames = ['add', 'remove'];

		var scope = {

			/*** Public methods ***/

			/**
			 * @param  Life.Neuron neuronParam
			 * @return null
			 */
			init: function(neuronScopeParam) {

				events = {};
				neuronScope = neuronScopeParam;

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

			add: function(exocytoseKey) {

				this.trigger('add', exocytoseKey);
			},

			remove: function(exocytoseKey) {

				this.trigger('remove', exocytoseKey);
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

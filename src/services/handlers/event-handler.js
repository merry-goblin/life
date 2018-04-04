/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.eventHandler = (function(life) {

	var scope = {

		/*** Public static methods ***/

		build: function(name) {

			var event = new life.Event();
			event.name = name;
			event.callbacks = new Array();

			return event;
		},

		listen: function(event, object, method) {

			event.callbacks.push([object, method]);
		},

		trigger: function(event, args) {

			event.callbacks.forEach(function(callback) {
				callback[0][callback[1]](args); // == object.method(args)
			});
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(event) {

			event.callbacks = null;
		}
	}
	return scope;

})(Life);

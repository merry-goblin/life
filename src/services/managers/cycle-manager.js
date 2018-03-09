/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.CycleManager = function() {

		/*** Private static properties ***/

		var speed = 0; // microsecondes

		var time = 0; // microsecondes

		/*** Private static methods ***/

		var scope = {

			/*** Public static methods ***/

			manage: function(neuron) {

				// manage interactions during current cycle
				// todo

				time += speed;
			},

			getTime: function() {

				return time;
			},

			getSpeed: function() {

				return speed;
			},

			play: function() {

				speed = (speed == 0) ? 1 : speed;
			},

			pause: function() {

				speed = 0;
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

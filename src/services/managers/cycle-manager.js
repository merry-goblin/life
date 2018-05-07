/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.CycleManager = function() {

		/*** Constants ***/

		var maxSpeed = 32; // microsecondes

		/*** Private static properties ***/

		var speed = 1; // microsecondes
		var time = 0; // microsecondes
		var isPlaying = false;
		var isStepForwarding = false;

		/*** Private static methods ***/

		function consumeStepForward() {

			var step = 0;
			if (isStepForwarding) {
				step = speed;
				isStepForwarding = false;
			}

			return step;
		}

		var scope = {

			/*** Public static methods ***/

			/**
			 * Manage interactions during current cycle
			 *
			 * @param  Life.NeuronScope nScope
			 * @return null
			 */
			manage: function(nScope) {

				var currentSpeed = consumeStepForward();
				if (isPlaying) {
					currentSpeed = speed;
				}
				time += currentSpeed;

				life.neuronManager.manage(nScope, timePassed);
			},

				/* Getters */

			getMaxSpeed: function() {

				return maxSpeed;
			},

			getTime: function() {

				return time;
			},

			getSpeed: function() {

				return speed;
			},

			getIsPlaying: function() {

				return isPlaying;
			},

				/* Actions */

			play: function() {

				isPlaying = true;
			},

			pause: function() {

				isPlaying = false;
			},

			forward: function() {

				isStepForwarding = true;
			},

			faster: function() {

				if (speed < maxSpeed) {
					speed *= 2;
				}
			},

			slower: function() {

				if (speed > 1) {
					speed /= 2;
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

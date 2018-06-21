/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.actionPotentialHandler = (function(life) {

	/*** Private static properties ***/

	var currentUniqId = 0;

	/*** Private static methods ***/

	/**
	 * x = impulseStartPosition
	 * y = impulseStartTime
	 * a = 1/neuronImpulseSpeed * impulseDirection
	 * b = y - a * x
	 *
	 * @param  Life.NeuronScope nScope
	 * @param  Life.ActionPotential actionPotential
	 * @return null
	 */
	function buildEquation(nScope, ap) {

		ap.a = nScope.neuron.model.gradient * ap.direction;
		ap.b = ap.startTime - ap.a * ap.origin;
	}

	var scope = {

		/*** Public static methods ***/

		build: function(nScope, origin, startTime, direction) {

			var actionPotential = new life.ActionPotential();
			actionPotential.origin = origin;
			actionPotential.startTime = startTime;
			actionPotential.direction = direction;

			buildEquation(nScope, actionPotential);

			return actionPotential;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(actionPotential) {

			/*for (var i=0,nb=actionPotential.impulses.length; nb<i; i++) {
				actionPotential.impulses[i].equation = null;
				actionPotential.impulses[i] = null;
			}*/
		}
	}
	return scope;

})(Life);

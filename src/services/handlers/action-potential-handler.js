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

	var scope = {

		/*** Public static methods ***/

		build: function(origin, startTime, impulseSpeed) {

			var actionPotential = new life.ActionPotential();
			actionPotential.origin = origin;
			actionPotential.startTime = startTime;
			actionPotential.impulses = new Array();

			this.buildEquations(actionPotential, impulseSpeed);

			return actionPotential;
		},

		buildEquations: function(actionPotential, impulseSpeed) {

			var gradient = 1/impulseSpeed;

			var equation1 = this.buildEquation(actionPotential, gradient);
			var equation2 = this.buildEquation(actionPotential, (-1 * gradient));

			actionPotential.impulses.push(equation1);
			actionPotential.impulses.push(equation2);
		},

		buildEquation: function(actionPotential, gradient) {

			var equation = new life.Equation();
			equation.a = gradient;
			equation.b = actionPotential.startTime;
			equation.c = actionPotential.origin;

			return equation;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(actionPotential) {

			
		}
	}
	return scope;

})(Life);

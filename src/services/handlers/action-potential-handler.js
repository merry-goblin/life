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

		build: function(origin, startTime, direction) {

			var actionPotential = new life.ActionPotential();
			actionPotential.origin = origin;
			actionPotential.startTime = startTime;
			actionPotential.direction = direction;

			//this.buildImpulses(origin, actionPotential, impulseSpeed);

			return actionPotential;
		},

		//	Not used anymore
		buildImpulses: function(origin, actionPotential, impulseSpeed) {

			var gradient = 1/impulseSpeed;

			//	Impulses
			var impulse1 = new life.Impulse();
			var impulse2 = new life.Impulse();

			//	Origin
			impulse1.origin = origin;
			impulse2.origin = origin;

			//	Direction
			impulse1.direction = 1;
			impulse2.direction = -1;

			//	Equations
			impulse1.equation = this.buildEquation(actionPotential, impulse1.direction * gradient);
			impulse2.equation2 = this.buildEquation(actionPotential, impulse2.direction * gradient);

			actionPotential.impulses.push(impulse1);
			actionPotential.impulses.push(impulse2);
		},

		//	Not used anymore
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

			/*for (var i=0,nb=actionPotential.impulses.length; nb<i; i++) {
				actionPotential.impulses[i].equation = null;
				actionPotential.impulses[i] = null;
			}*/
		}
	}
	return scope;

})(Life);

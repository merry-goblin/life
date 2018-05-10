/**
 * Ex: 
 * var potential = Life.membranePotential.goldmanEquation(...);
 * console.log(potential);
 *
 * @static
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.membranePotential = (function(life) {

	var scope = {

		/*** Public static methods ***/

		/**
		 * @param  array[object]
		 * @return float
		 */
		goldmanEquation: function(params) {

			var topLog = 0;
			var bottomLog = 0;

			for (var i = 0; i < params.length; i++) {
				var valence = params[i].valence;
				var top = (valence > 0) ? params[i].extra : params[i].intra;
				var bottom = (valence > 0) ? params[i].intra : params[i].extra;
				var permeability = params[i].permeability;

				topLog += permeability * top;
				bottomLog += permeability * bottom;
			}
			
			var potential = (life.config.potentialConstant * life.config.temperature) * Math.log10(topLog / bottomLog);

			return potential;
		}
	}
	return scope;

})(Life);

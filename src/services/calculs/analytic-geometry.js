/**
 * @static
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.analyticGeometry = (function(life) {

	var scope = {

		/*** Public static methods ***/

		/**
		 * Intersection: a1 * x + b1 = a2 * x + b2
		 *
		 * @param  float a1
		 * @param  float b1
		 * @param  float a2
		 * @param  float b2
		 * @return {x,y} | false
		 */
		intersectionOfLines: function(a1, b1, a2, b2) {

			let response = false;
			if (a1 != a2) {
				let x = (b2 - b1) / (a1 - a2);
				let y = (a1 * x) + b1;

				response = {
					x: x,
					y: y
				};
			}

			return response;
		},

		/**
		 * @param  float s [speed]
		 * @return float
		 */
		gradientOfALine: function(s) {

			return (s != 0) ? (1/s) : 0;
		}
	}
	return scope;

})(Life);

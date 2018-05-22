/**
 * @static
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.arithmetic = (function(life) {

	var scope = {

		/*** Public static methods ***/

		getDistance: function(x1, y1, x2, y2) {

			let dx = x1 - x2;
			let dy = y1 - y2;

			return Math.sqrt(dx*dx + dy*dy);
		},

		getDistanceOnOneAxis: function(x1, x2) {

			let dx = x1 - x2;

			return Math.sqrt(dx*dx);
		},

		getMiddleOnOneAxis: function(x1, x2) {

			let m = 0;
			if (x1 == x2) {
				m = x1;
			}
			if (x1 > x2) {
				let d = (x1 - x2) / 2;
				m = x2 + d;
			}
			else {
				let d = (x2 - x1) / 2;
				m = x1 + d;
			}

			return m;
		},

		getRatioToHexa: function(value, max, reverse) {

			let intRatio;
			let hexa;

			if (value < 0) {
				value = -1.0 * value;
			}
			else if (value > max) {
				value = max;
			}

			//	Ratio
			if (value == 0) {
				intRatio = (reverse) ? 1 : 0;
			}
			else {
				intRatio = (reverse) ? (1 - (value / max)) : (value / max);
			}

			//	Make sure it is an integer
			intRatio = parseInt(intRatio * 255, 10);

			//	Hexa
			hexa = intRatio.toString(16);
			return hexa;
		}
	}
	return scope;

})(Life);

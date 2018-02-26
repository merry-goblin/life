/**
 * Ex: 
 * var random = Life.utils.getRandomInteger(0, 9);
 * console.log(random);
 *
 * @static
 * @class
 * @author Alexandre Keller
 * @since 2017
 */

/** @namespace */
var Life = CellPotential || {};

CellPotential.utils = (function($, cpot) {

	/*** Private static properties ***/

	var currentUniqId = 0;

	var scope = {

		/**
		 * generate a random number between two integer
		 * min and max are both included as possible return values
		 * @param  integer min
		 * @param  integer max
		 * @return integer
		 */
		getRandomInteger: function(min, max) {

			var alea = Math.random()*((max+1)-min)+min;
			return Math.floor(alea);
		},

		/**
		 * generate a random number between two float
		 * min and max are both included as possible return values
		 * @param  integer min
		 * @param  integer max
		 * @param  integer decimals
		 * @return integer
		 */
		getRandomFloat: function(min, max, decimals) {

			if (decimals == 0) {
				return cpot.utils.getRandomInteger(min, max);
			}
			multiplier = Math.pow(10, decimals);
			min = Math.floor(min*multiplier);
			max = Math.floor(max*multiplier);
			var alea = cpot.utils.getRandomInteger(min, max);
			alea = alea / multiplier;
			return alea;
		},

		/**
		 * generate unique id for current script
		 * @return string
		 */
		getUniqId: function() {

			currentUniqId++;
			var pad = new Array(1 + cpot.config.uniqIdSize).join(cpot.config.uniqIdFill);
			return (pad + currentUniqId).slice(-pad.length);
		},

		/**
		 * @param  object position // {x, y}
		 * @param  float angle
		 * @param  float radius
		 * @return object
		 */
		translateAngle: function(center, angle, radius) {

			var radians = cpot.utils.degreesToRadians(angle);

			var position = {
				x: center.x + radius * Math.cos(radians),
				y: center.y + radius * Math.sin(radians),
				z: 0.0
			};

			return position;
		},

		degreesToRadians: function(degrees) {

			return degrees * (Math.PI / 180);
		}
	}
	return scope;

})(jQuery, CellPotential);

/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.ionicChannelHandler = (function(life) {

	/*** Private static methods ***/

	var scope = {

		/*** Public static methods ***/

		build: function(model) {

			var ionicChannel = new life.IonicChannel();
			ionicChannel.model = model;

			return ionicChannel;
		},

		/**
		 * Voltage is not handled yet
		 * 
		 * @param  Life.IonicChannel channel
		 * @param  float potential
		 * @param  integer neurotransmitter [Life.Neurotransmitters.*]
		 * @return float
		 */
		getPermeability: function(channel, potential, neurotransmitter) {

			//	Default
			var permeability = channel.permeability.default;

			//	Neurotransmitter activation
			var neurotransmitterGatedList = channel.sensibility.neurotransmitterGated;
			for (var i=0, nb=neurotransmitterGatedList.length; i<nb; i++) {
				if (neurotransmitterGatedList[i].neurotransmitter == neurotransmitter) {
					permeability = neurotransmitterGatedList[i].permeability;
				}
			}

			return permeability;
		},

		/**
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(ionicChannel) {

			ionicChannel.model = null;
		}
	}
	return scope;

})(Life);

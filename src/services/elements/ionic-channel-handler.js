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
		 * Free any pointer stored in an element
		 * @return null
		 */
		destruct: function(ionicChannel) {

			ionicChannel.model = null;
		}
	}
	return scope;

})(Life);

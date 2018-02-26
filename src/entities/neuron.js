/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.Neuron = function(settings) {

		/*** Private properties ***/
		var settings = $.extend({}, settings);

		//	Entities
		var ionChannels = null;
		var activeTransports = null;
		var synapses = null;

		//	Interactions
		var actionPotentials = null;
		var postsynapticPotentials = null;

		//	States
		var presynapticPotential = false;

		/*** Private methods ***/

		//	Entities
		function addEntityToList(entities, key, entity) {
			
			entities[key] = entity;
		}

		function getEntityFromList(entities, key) {
			
			return entities[key];
		}

		function removeEntityFromList(entities, key) {
			
			delete entities[key];
		}

		//	Interactions
		function addInteractionToList(interactions, key, interaction) {
			
			interactions[key] = interaction;
		}

		function getInteractionFromList(interactions, key) {
			
			return interactions[key];
		}

		function removeInteractionFromList(interactions, key) {
			
			delete interactions[key];
		}

		/**
		 * @return null
		 */
		function cleanEntities() {

			var list = new Array();
			list.push(ionChannels);
			list.push(activeTransports);
			list.push(synapses);

			for (var i = 0; i < list.length; i++) {
				if (list[i] != null) {
					for (var key in list[i]) {
						list[i][key].destruct();
					}
				}
			}

			ionChannels = null;
			activeTransports = null;
			synapses = null;
		}

		/**
		 * @return null
		 */
		function cleanInteractions() {

			var list = new Array();
			list.push(actionPotentials);
			list.push(postsynapticPotentials);

			for (var i = 0; i < list.length; i++) {
				if (list[i] != null) {
					for (var key in list[i]) {
						list[i][key].destruct();
					}
				}
			}

			actionPotentials = null;
			postsynapticPotentials = null;
		}

		/**
		 * Free any pointer stored on this object
		 * @return null
		 */
		function cleanMemory() {

			cleanEntities();
			cleanInteractions();
		}

		var scope = {

			/*** Public methods ***/

			/**
			 * return null
			 */
			init: function() {

				cleanMemory();

				ionChannels = {};
				activeTransports = {};
				synapses = {};
			},

			loop: function() {

				
			},

			add: function(type, key, element) {

				switch (type) {
					case 'ionic-channel':
						addEntityToList(ionChannels, key, element);
						break;
					case 'active-transport':
						addEntityToList(activeTransports, key, element);
						break;
					case 'synapse':
						addEntityToList(synapses, key, element);
						break;
					case 'action-potential':
						addInteractionToList(actionPotentials, key, element);
						break;
					case 'postsynaptic-potential':
						addInteractionToList(postsynapticPotentials, key, element);
						break;
				}
			},

			get: function(type, key) {

				var element = null;
				switch (type) {
					case 'ionic-channel':
						element = getEntityFromList(ionChannels, key);
						break;
					case 'active-transport':
						element = getEntityFromList(activeTransports, key);
						break;
					case 'synapse':
						element = getEntityFromList(synapses, key);
						break;
					case 'action-potential':
						element = getInteractionFromList(actionPotentials, key);
						break;
					case 'postsynaptic-potential':
						element = getInteractionFromList(postsynapticPotentials, key);
						break;
				}
				return element;
			},

			remove: function(type, key) {

				switch (type) {
					case 'ionic-channel':
						removeEntityFromList(ionChannels, key);
						break;
					case 'active-transport':
						removeEntityFromList(activeTransports, key);
						break;
					case 'synapse':
						removeEntityFromList(synapses, key);
						break;
					case 'action-potential':
						removeInteractionFromList(actionPotentials, key);
						break;
					case 'postsynaptic-potential':
						removeInteractionFromList(postsynapticPotentials, key);
						break;
				}
			},

			/**
			 * Use this when Destroying this object in order to prevent memory leak
			 * @return null
			 */
			destruct: function() {

				cleanMemory();
			}
		}
		return scope;
	}

})(Life);

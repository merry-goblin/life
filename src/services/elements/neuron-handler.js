/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.neuronHandler = (function(life) {

	/*** Private static methods ***/

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
	function cleanList(list) {

		for (var i = 0; i < list.length; i++) {
			if (list[i] != null) {
				for (var key in list[i]) {
					list[i][key].destruct();
				}
			}
		}
	}

	/**
	 * @return null
	 */
	function cleanEntities(neuron) {

		var list = new Array();
		list.push(neuron.ionChannels);
		list.push(neuron.activeTransports);
		list.push(neuron.synapses);

		cleanList(list);

		neuron.ionChannels = null;
		neuron.activeTransports = null;
		neuron.synapses = null;
	}

	/**
	 * @return null
	 */
	function cleanInteractions(neuron) {

		var list = new Array();
		list.push(neuron.actionPotentials);
		list.push(neuron.postsynapticPotentials);

		cleanList(list);

		neuron.actionPotentials = null;
		neuron.postsynapticPotentials = null;
	}

	var scope = {

		/*** Public static methods ***/

		init: function(neuron) {

			this.destruct(neuron);

			neuron.ionChannels = {};
			neuron.activeTransports = {};
			neuron.synapses = {};

			neuron.actionPotentials = {};
			neuron.postsynapticPotentials = {};

			neuron.presynapticPotential = false;
		},

		add: function(neuron, type, key, element) {

			switch (type) {
				case 'ionic-channel':
					addEntityToList(neuron.ionChannels, key, element);
					break;
				case 'active-transport':
					addEntityToList(neuron.activeTransports, key, element);
					break;
				case 'synapse':
					addEntityToList(neuron.synapses, key, element);
					break;
				case 'action-potential':
					addInteractionToList(neuron.actionPotentials, key, element);
					break;
				case 'postsynaptic-potential':
					addInteractionToList(neuron.postsynapticPotentials, key, element);
					break;
			}
		},

		get: function(neuron, type, key) {

			var element = null;
			switch (type) {
				case 'ionic-channel':
					element = getEntityFromList(neuron.ionChannels, key);
					break;
				case 'active-transport':
					element = getEntityFromList(neuron.activeTransports, key);
					break;
				case 'synapse':
					element = getEntityFromList(neuron.synapses, key);
					break;
				case 'action-potential':
					element = getInteractionFromList(neuron.actionPotentials, key);
					break;
				case 'postsynaptic-potential':
					element = getInteractionFromList(neuron.postsynapticPotentials, key);
					break;
			}
			return element;
		},

		remove: function(type, key) {

			switch (type) {
				case 'ionic-channel':
					removeEntityFromList(neuron.ionChannels, key);
					break;
				case 'active-transport':
					removeEntityFromList(neuron.activeTransports, key);
					break;
				case 'synapse':
					removeEntityFromList(neuron.synapses, key);
					break;
				case 'action-potential':
					removeInteractionFromList(neuron.actionPotentials, key);
					break;
				case 'postsynaptic-potential':
					removeInteractionFromList(neuron.postsynapticPotentials, key);
					break;
			}
		},

		buildEntities: function(entityType, model) {

			var entity = null;
			switch (entityType) {
				case 'ionic-channel':
					entity = life.ionicChannelHandler.build(model);
					break;
				case 'active-transport':
					break;
				case 'synapse':
					break;
			}
			return entity;
		},

		/**
		 * Free any pointer stored in a neuron
		 * @return null
		 */
		destruct: function(neuron) {

			cleanEntities(neuron);
			cleanInteractions(neuron);
		}
	}
	return scope;

})(Life);

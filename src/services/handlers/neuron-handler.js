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
	function addInteractionToList(interactions, interaction) {
		
		interactions.push(interaction);
	}

	function getInteractionFromList(interactions, index) {
		
		return interactions[index];
	}

	function removeInteractionFromList(interactions, index) {
		
		delete interactions[index];
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

	function initNeuronModel(model) {

		if (model.standByPotential == null) {
			var params = new Array();
			for (var i=0, nb=model.channels.length; i<nb; i++) {
				var channel = model.channels[i];
				params.push({
					valance: 1,
					extra: 5,
					intra: 140,
					permeability: channel.permeability.default
				});
			}
		}
	}

	var scope = {

		/*** Public static methods ***/

		init: function(neuron, model) {

			this.destruct(neuron);

			neuron.ionChannels = {};
			neuron.activeTransports = {};
			neuron.synapses = {};

			neuron.actionPotentials = new Array();
			neuron.postsynapticPotentials = new Array();

			neuron.presynapticPotential = false;

			neuron.model = model;
			initNeuronModel(model);
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
					addInteractionToList(neuron.actionPotentials, element);
					break;
				case 'postsynaptic-potential':
					addInteractionToList(neuron.postsynapticPotentials, element);
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
					element = getInteractionFromList(neuron.actionPotentials, key); // key is an index here
					break;
				case 'postsynaptic-potential':
					element = getInteractionFromList(neuron.postsynapticPotentials, key); // key is an index here
					break;
			}
			return element;
		},

		/**
		 *	Don't remember why i though i needed that function ...
		 */
		getList: function(neuron, type) {

			var list = null;
			switch (type) {
				case 'ionic-channel':
					list = neuron.ionChannels;
					break;
				case 'active-transport':
					list = neuron.activeTransports;
					break;
				case 'synapse':
					list = neuron.synapses;
					break;
				case 'action-potential':
					list = neuron.actionPotentials;
					break;
				case 'postsynaptic-potential':
					list = neuron.postsynapticPotentials;
					break;
			}
			return list;
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
					removeInteractionFromList(neuron.actionPotentials, key); // key is an index here
					break;
				case 'postsynaptic-potential':
					removeInteractionFromList(neuron.postsynapticPotentials, key); // key is an index here
					break;
			}
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

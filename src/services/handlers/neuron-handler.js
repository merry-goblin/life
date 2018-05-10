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
	function addEntityToList(entities, key, entity, listener) {

		entities[key] = entity;

		if (listener != null) {
			listener.add(key);
		}
	}

	function getEntityFromList(entities, key) {

		return entities[key];
	}

	function removeEntityFromList(entities, key) {

		if (listener != null) {
			listener.remove(key);
		}

		delete entities[key];
	}

	//	Interactions
	function addInteractionToList(interactions, interaction, listener) {

		var index = interactions.length;
		interactions.push(interaction);

		if (listener != null) {
			listener.add(index);
		}
	}

	function getInteractionFromList(interactions, index) {

		return interactions[index];
	}

	function removeInteractionFromList(interactions, index, listener) {

		if (listener != null) {
			listener.remove(index);
		}

		interactions.splice(index, 1);
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
				var ion = channel.permeability.ion;
				params.push({
					valance: Life.config.valence[ion],
					extra: Life.config.extra[ion],
					intra: Life.config.intra[ion],
					permeability: channel.permeability.default
				});
			}
			model.standByPotential = life.membranePotential.goldmanEquation(params);
		}
	}

	function initNeuronScope(scope, neuron) {

		//	Entity
		scope.neuron = neuron;

		//	Services
		scope.services.synapseListener = new life.SynapseListener();
		scope.services.synapseListener.init(scope);
		scope.services.postsynapticPotentialListener = new life.PostsynapticPotentialListener();
		scope.services.postsynapticPotentialListener.init(scope);

		//	Manager
		scope.manager = new life.NeuronManager();
		scope.manager.init(scope);
	}

	var scope = {

		/*** Public static methods ***/

		init: function(scope, neuron, model) {

			this.destruct(neuron);

			neuron.ionChannels = {};
			neuron.activeTransports = {};
			neuron.synapses = {};

			neuron.actionPotentials = new Array();
			neuron.postsynapticPotentials = new Array();
			neuron.presynapticPotential = false;

			//	Listeners
			if (scope != null) {
				initNeuronScope(scope, neuron);
			}

			neuron.model = model;
			initNeuronModel(model);
		},

		add: function(scope, neuron, type, key, element) {

			var listener = null;
			switch (type) {
				case 'ionic-channel':
					addEntityToList(neuron.ionChannels, key, element);
					break;
				case 'active-transport':
					neuron.
					addEntityToList(neuron.activeTransports, key, element);
					break;
				case 'synapse':
					listener = (scope != null) ? scope.services.synapseListener : null;
					addEntityToList(neuron.synapses, key, element, listener);
					break;
				case 'action-potential':
					addInteractionToList(neuron.actionPotentials, element);
					break;
				case 'postsynaptic-potential':
					listener = (scope != null) ? scope.services.postsynapticPotentialListener : null;
					addInteractionToList(neuron.postsynapticPotentials, element, listener);
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

		remove: function(scope, type, key) {

			var listener = null;
			switch (type) {
				case 'ionic-channel':
					removeEntityFromList(neuron.ionChannels, key);
					break;
				case 'active-transport':
					removeEntityFromList(neuron.activeTransports, key);
					break;
				case 'synapse':
					listener = (scope != null) ? scope.services.synapseListener : null;
					removeEntityFromList(neuron.synapses, key, listener);
					break;
				case 'action-potential':
					removeInteractionFromList(neuron.actionPotentials, key); // key is an index here
					break;
				case 'postsynaptic-potential':
					listener = (scope != null) ? scope.services.postsynapticPotentialListener : null;
					removeInteractionFromList(scope.neuron.postsynapticPotentials, key, listener); // key is an index here
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

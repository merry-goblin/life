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

		entity.id = key;
		entities[key] = entity;

		if (listener != null) {

			listener.add(key);
		}
	}

	function getEntityFromList(entities, key) {

		return entities[key];
	}

	function removeEntityFromList(entities, key, listener) {

		if (listener != null) {
			listener.remove(key);
		}

		delete entities[key];
	}

	//	Interactions
	function addInteractionToList(scope, interactions, interaction, listener) {

		var key = getUniqId(scope);
		interaction.id = key;
		interactions[key] = interaction;

		if (listener != null) {
			listener.add(key);
		}
	}

	function getInteractionFromList(interactions, key) {

		return interactions[key];
	}

	function removeInteractionFromList(interactions, key, listener) {

		if (listener != null) {
			listener.remove(key);
		}

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

	function initNeuronModel(model) {

		initStandByPotential(model);
		initThreshold(model);
		initGradient(model);
	}

	function initStandByPotential(model) {

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

	function initThreshold(model) {

		if (model.threshold == null) {
			//	Todo : threshold need to be calculated
			model.threshold = 0.03;
		}
	}

	function initGradient(model) {

		if (model.gradient == null) {
			if (model.impulseSpeed > 0) {
				model.gradient = 1 / model.impulseSpeed;
			}
			else {
				model.gradient = 0;
			}
		}
	}

	function initNeuronScope(scope, neuron) {

		//	Entity
		scope.neuron = neuron;

		//	Services
		scope.services.synapseListener = new life.SynapseListener();
		scope.services.synapseListener.init(scope);
		scope.services.actionPotentialListener = new life.ActionPotentialListener();
		scope.services.actionPotentialListener.init(scope);
		scope.services.postsynapticPotentialListener = new life.PostsynapticPotentialListener();
		scope.services.postsynapticPotentialListener.init(scope);

		//	Manager
		scope.manager = new life.NeuronManager();
		scope.manager.init(scope);
	}

	function getUniqId(scope) {

		scope.lastId++;
		return scope.lastId;
	}

	var scope = {

		/*** Public static methods ***/

		init: function(scope, neuron, model) {

			this.destruct(neuron);

			neuron.ionChannels = {};
			neuron.activeTransports = {};
			neuron.synapses = {};

			neuron.actionPotentials = {};
			neuron.postsynapticPotentials = {};
			neuron.presynapticPotentialActivation = false;

			//	Listeners
			if (scope != null) {
				initNeuronScope(scope, neuron);
			}

			neuron.model = model;
			initNeuronModel(model);
		},

		add: function(scope, parent, type, key, element) {

			var listener = null;
			switch (type) {
				case 'ionic-channel':
					addEntityToList(parent.ionChannels, key, element);
					break;
				case 'active-transport':
					addEntityToList(parent.activeTransports, key, element);
					break;
				case 'synapse':
					listener = (scope != null) ? scope.services.synapseListener : null;
					addEntityToList(parent.synapses, key, element, listener);
					break;
				case 'action-potential':
					listener = (scope != null) ? scope.services.actionPotentialListener : null;
					addInteractionToList(scope, parent.actionPotentials, element, listener);
					break;
				case 'postsynaptic-potential':
					listener = (scope != null) ? scope.services.postsynapticPotentialListener : null;
					addInteractionToList(scope, parent.postsynapticPotentials, element, listener);
					break;
				case 'exocytose':
					let synapse = parent;
					listener = (scope != null) ? scope.services.exocytoseListener : null;
					addInteractionToList(scope, synapse.exocytoses, element, listener);
					break;
			}
		},

		get: function(parent, type, key) {

			var element = null;
			switch (type) {
				case 'ionic-channel':
					element = getEntityFromList(parent.ionChannels, key);
					break;
				case 'active-transport':
					element = getEntityFromList(parent.activeTransports, key);
					break;
				case 'synapse':
					element = getEntityFromList(parent.synapses, key);
					break;
				case 'action-potential':
					element = getInteractionFromList(parent.actionPotentials, key); // key is an index here
					break;
				case 'postsynaptic-potential':
					element = getInteractionFromList(parent.postsynapticPotentials, key); // key is an index here
					break;
				case 'exocytose':
					let synapse = parent; // do you believe in magic ?
					element = getInteractionFromList(synapse.exocytoses, key); // key is an index here
					break;
			}
			return element;
		},

		/**
		 *	Don't remember why i though i needed that function ...
		 */
		getList: function(parent, type) {

			var list = null;
			switch (type) {
				case 'ionic-channel':
					list = parent.ionChannels;
					break;
				case 'active-transport':
					list = parent.activeTransports;
					break;
				case 'synapse':
					list = parent.synapses;
					break;
				case 'action-potential':
					list = parent.actionPotentials;
					break;
				case 'postsynaptic-potential':
					list = parent.postsynapticPotentials;
					break;
				case 'exocytose':
					list = parent.exocytoses;
					break;
			}
			return list;
		},

		remove: function(scope, type, key, parent) {

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
					listener = (scope != null) ? scope.services.actionPotentialListener : null;
					removeInteractionFromList(scope.neuron.actionPotentials, key, listener); // key is an index here
					break;
				case 'postsynaptic-potential':
					listener = (scope != null) ? scope.services.postsynapticPotentialListener : null;
					removeInteractionFromList(scope.neuron.postsynapticPotentials, key, listener); // key is an index here
					break;
				case 'exocytose':
					let synapse = parent;
					listener = (scope != null) ? scope.services.exocytoseListener : null;
					removeInteractionFromList(synapse.exocytoses, key, listener); // key is an index here
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

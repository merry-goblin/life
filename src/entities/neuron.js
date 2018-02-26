/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

Life.Neuron = function() {

	//	Entities
	this.ionChannels = null;
	this.activeTransports = null;
	this.synapses = null;

	//	Interactions
	var actionPotentials = null;
	var postsynapticPotentials = null;

	//	States
	var presynapticPotential = false;

	/*** Private methods ***/

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

		/**
		 * Use this when Destroying this object in order to prevent memory leak
		 * @return null
		 */
		destruct: function() {

			cleanMemory();
		}
	}
}

Life.Neuron.prototype = {

	init: function () {

		this.ionChannels = {};
		this.activeTransports = {};
		this.synapses = {};
	},

	//	Entities
	addEntityToList: function (entities, key, entity) {
		
		entities[key] = entity;
	},

	getEntityFromList: function(entities, key) {
		
		return entities[key];
	},

	removeEntityFromList: function(entities, key) {
		
		delete entities[key];
	},

	//	Interactions
	addInteractionToList: function(interactions, key, interaction) {
		
		interactions[key] = interaction;
	},

	getInteractionFromList: function(interactions, key) {
		
		return interactions[key];
	},

	removeInteractionFromList: function(interactions, key) {
		
		delete interactions[key];
	},

	add: function(type, key, element) {

		switch (type) {
			case 'ionic-channel':
				this.addEntityToList(this.ionChannels, key, element);
				break;
			case 'active-transport':
				this.addEntityToList(this.activeTransports, key, element);
				break;
			case 'synapse':
				this.addEntityToList(this.synapses, key, element);
				break;
			case 'action-potential':
				this.addInteractionToList(this.actionPotentials, key, element);
				break;
			case 'postsynaptic-potential':
				this.addInteractionToList(this.postsynapticPotentials, key, element);
				break;
		}
	},

	get: function(type, key) {

		var element = null;
		switch (type) {
			case 'ionic-channel':
				element = this.getEntityFromList(this.ionChannels, key);
				break;
			case 'active-transport':
				element = this.getEntityFromList(this.activeTransports, key);
				break;
			case 'synapse':
				element = this.getEntityFromList(this.synapses, key);
				break;
			case 'action-potential':
				element = this.getInteractionFromList(this.actionPotentials, key);
				break;
			case 'postsynaptic-potential':
				element = this.getInteractionFromList(this.postsynapticPotentials, key);
				break;
		}
		return element;
	},

	remove: function(type, key) {

		switch (type) {
			case 'ionic-channel':
				this.removeEntityFromList(this.ionChannels, key);
				break;
			case 'active-transport':
				this.removeEntityFromList(this.activeTransports, key);
				break;
			case 'synapse':
				this.removeEntityFromList(this.synapses, key);
				break;
			case 'action-potential':
				this.removeInteractionFromList(this.actionPotentials, key);
				break;
			case 'postsynaptic-potential':
				this.removeInteractionFromList(this.postsynapticPotentials, key);
				break;
		}
	},

	/**
	 * @return null
	 */
	cleanList: function(list) {

		for (var i = 0; i < list.length; i++) {
			if (list[i] != null) {
				for (var key in list[i]) {
					list[i][key].destruct();
				}
			}
		}
	},

	/**
	 * @return null
	 */
	cleanEntities: function() {

		var list = new Array();
		list.push(this.ionChannels);
		list.push(this.activeTransports);
		list.push(this.synapses);

		this.cleanList(list);

		this.ionChannels = null;
		this.activeTransports = null;
		this.synapses = null;
	},

	/**
	 * @return null
	 */
	cleanInteractions: function() {

		var list = new Array();
		list.push(this.actionPotentials);
		list.push(this.postsynapticPotentials);

		this.cleanList(list);

		this.actionPotentials = null;
		this.postsynapticPotentials = null;
	},

	/**
	 * Free any pointer stored on this object
	 * @return null
	 */
	destruct: function() {

		this.cleanEntities();
		this.cleanInteractions();
	}
}

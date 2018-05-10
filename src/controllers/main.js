/** 
 * Cell Potential - CPot Controller (Main Controller)
 * 
 * @class
 * @author Alexandre Keller
 * @since 2017
 */

/** @namespace */
var Life = Life || {};

(function($, life) {

	life.Main = function(settings) {

		/*** Private properties ***/

		var self = null;
		var settings = $.extend({}, settings);

		var graphics = null;
		var cycleManager = null;
		var cycleListener = null;

		var interval = null;

		var neuron = null;
		var preNeurons = new Array();
		var nScope = null;

		/*** Private methods ***/

		/**
		 * Free any pointer stored on this object
		 * @return null
		 */
		function cleanMemory() {

			stopLoop();
		}

		function manageCycles() {

			cycleManager.manage(nScope);
		}

		/**
		 * Application's main loop
		 * @return null
		 */
		function loop() {

			manageCycles();
			graphics.update();
		}

		/**
		 * Stop the application's main loop
		 * @return null
		 */
		function stopLoop() {
	
			clearInterval(interval);
		}

		function handleGraphics() {

			graphics.init("world", nScope, cycleManager, cycleListener);

			// Set interval
			// Calculate next step from the world
			// Draw the world state
			interval = setInterval(loop, life.config.loopInterval);
		}

		function buildNeuron() {

			//	Previous neurons
			preNeurons.n1 = new life.Neuron();
			life.neuronHandler.init(null, preNeurons.n1, life.Models.neuronT1);
			preNeurons.n2 = new life.Neuron();
			life.neuronHandler.init(null, preNeurons.n2, life.Models.neuronT1);
			preNeurons.n3 = new life.Neuron();
			life.neuronHandler.init(null, preNeurons.n3, life.Models.neuronT2);
			preNeurons.n4 = new life.Neuron();
			life.neuronHandler.init(null, preNeurons.n4, life.Models.neuronT1);

			nScope = new life.NeuronScope();
			neuron = new life.Neuron();
			life.neuronHandler.init(nScope, neuron, life.Models.neuronT1);

			//	Add ionic channels on all the membran
			life.neuronHandler.add(nScope, neuron, 'ionic-channel', 'k1', life.ionicChannelHandler.build(life.Models.channelK1));
			life.neuronHandler.add(nScope, neuron, 'ionic-channel', 'na1', life.ionicChannelHandler.build(life.Models.channelNa1));
			life.neuronHandler.add(nScope, neuron, 'ionic-channel', 'cl1', life.ionicChannelHandler.build(life.Models.channelCl1));

			//	Add synapses at specific point of the membran
			nScope.services.synapseListener.registerService(graphics, {'add': 'addSynapse'});
			nScope.services.synapseListener.registerService(graphics, {'remove': 'removeSynapse'});
			life.neuronHandler.add(nScope, neuron, 'synapse', 's1', life.synapseHandler.build(life.Models.synapseT1, -50, preNeurons.n1, neuron));
			life.neuronHandler.add(nScope, neuron, 'synapse', 's2', life.synapseHandler.build(life.Models.synapseT1, -45, preNeurons.n2, neuron));
			life.neuronHandler.add(nScope, neuron, 'synapse', 's3', life.synapseHandler.build(life.Models.synapseT1, -20, preNeurons.n3, neuron));
			life.neuronHandler.add(nScope, neuron, 'synapse', 's4', life.synapseHandler.build(life.Models.synapseT1, 5000, preNeurons.n4, neuron));

			nScope.services.synapseListener.registerService(nScope.manager, {'activate': 'generatePostsynapticPotential'});

			//	Postsynaptic potentiel 
			nScope.services.postsynapticPotentialListener.registerService(graphics, {'add': 'addPostsynapticPotential'});
			nScope.services.postsynapticPotentialListener.registerService(graphics, {'remove': 'removePostsynapticPotential'});
		}

		function testACalculation() {

			var params = new Array();
			params.push({
				valance: 1,
				extra: 5,
				intra: 140,
				permeability: life.Models.channelK1.permeability.default
			});
			params.push({
				valance: 1,
				extra: 140,
				intra: 14,
				permeability: life.Models.channelNa1.permeability.default
			});
			params.push({
				valance: -1,
				extra: 147,
				intra: 14,
				permeability: life.Models.channelCl1.permeability.default
			});

			var potential = life.membranePotential.goldmanEquation(params);
		}

		var scope = {

			/*** Public methods ***/

			/**
			 * Load and init any resources
			 * return null
			 */
			init: function() {

				self = this;

				graphics = new life.LinearNeuronGraphics();
				cycleManager = life.CycleManager();
				cycleListener = life.CycleListener();
				cycleListener.init(cycleManager);
				buildNeuron();
				handleGraphics();

				testACalculation();
			},

			manualSynapseActivation: function(synapseKey) {

				var synapse = life.neuronHandler.get(neuron, 'synapse', synapseKey);
				var postsynapticPotential = life.synapseHandler.activate(synapse);
				console.log(postsynapticPotential);

				life.neuronHandler.add(nScope, neuron, 'postsynaptic-potential', null, postsynapticPotential);

				graphics.activateSynapse(synapseKey);
				graphics.addPostsynapticPotential(postsynapticPotential);
			},

			/**
			 * Use this when Destroying this object in order to prevent for memory leak
			 * @return null
			 */
			destruct: function() {

				cleanMemory();
			}
		}
		return scope;
	}

})(jQuery, Life);

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
		var settings = $.extend({}, settings);

		var graphics = null;
		var cycleManager = null

		var interval = null;

		var neuron = null;
		var previousNeuron1 = null;
		var previousNeuron2 = null;
		var previousNeuron3 = null;
		var previousNeuron4 = null;

		/*** Private methods ***/

		/**
		 * Free any pointer stored on this object
		 * @return null
		 */
		function cleanMemory() {

			stopLoop();
		}

		function manageCycles() {

			cycleManager.manage(neuron);
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

			graphics = new life.LineraNeuronGraphics();
			graphics.init("world", neuron, cycleManager);

			// Set interval
			// Calculate next step from the world
			// Draw the world state
			interval = setInterval(loop, life.config.loopInterval);
		}

		function buildNeuron() {

			//	Previous neurons
			previousNeuron1 = new life.Neuron();
			life.neuronHandler.init(previousNeuron1, life.Models.neuronT1);
			previousNeuron2 = new life.Neuron();
			life.neuronHandler.init(previousNeuron2, life.Models.neuronT1);
			previousNeuron3 = new life.Neuron();
			life.neuronHandler.init(previousNeuron3, life.Models.neuronT2);
			previousNeuron4 = new life.Neuron();
			life.neuronHandler.init(previousNeuron4, life.Models.neuronT1);

			neuron = new life.Neuron();
			life.neuronHandler.init(neuron, life.Models.neuronT1);

			//	Add ionic channels on all the membran
			life.neuronHandler.add(neuron, 'ionic-channel', 'k1', life.ionicChannelHandler.build(life.Models.channelK1));
			life.neuronHandler.add(neuron, 'ionic-channel', 'na1', life.ionicChannelHandler.build(life.Models.channelNa1));
			life.neuronHandler.add(neuron, 'ionic-channel', 'cl1', life.ionicChannelHandler.build(life.Models.channelCl1));

			//	Add synapses at specific point of the membran
			life.neuronHandler.add(neuron, 'synapse', 's1', life.synapseHandler.build(life.Models.synapseT1, -50, previousNeuron1, neuron));
			life.neuronHandler.add(neuron, 'synapse', 's2', life.synapseHandler.build(life.Models.synapseT1, -45, previousNeuron2, neuron));
			life.neuronHandler.add(neuron, 'synapse', 's3', life.synapseHandler.build(life.Models.synapseT1, -20, previousNeuron3, neuron));
			life.neuronHandler.add(neuron, 'synapse', 's4', life.synapseHandler.build(life.Models.synapseT1, 5000, previousNeuron4, neuron));
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
			console.log(potential);
		}

		var scope = {

			/*** Public methods ***/

			/**
			 * Load and init any resources
			 * return null
			 */
			init: function() {

				cycleManager = life.CycleManager();
				buildNeuron();
				handleGraphics();

				testACalculation();
			},

			manualSynapseActivation: function(synapseKey) {

				var synapse = life.neuronHandler.get(neuron, 'synapse', synapseKey);
				var postsynapticPotential = life.synapseHandler.activate(synapse);

				life.neuronHandler.add(neuron, 'postsynaptic-potential', null, postsynapticPotential);

				graphics.activateSynapse(synapseKey);
				graphics.addPostsynapticPotential(postsynapticPotential);
			},

			changeCycleSpeed: function(action) {

				switch (action) {
					case "play":
						cycleManager.play();
						break;
					case "pause":
						cycleManager.pause();
						break;
					case "forward":
						cycleManager.forward();
						break;
					case "slower":
						cycleManager.slower();
						break;
					case "faster":
						cycleManager.faster();
						break;
				}
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

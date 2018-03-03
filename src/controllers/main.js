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
		var interval = null;
		
		var neuron = null;

		/*** Private methods ***/

		/**
		 * Free any pointer stored on this object
		 * @return null
		 */
		function cleanMemory() {

			stopLoop();
		}

		/**
		 * Application's main loop
		 * @return null
		 */
		function loop() {

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

			graphics = new life.Graphics();
			graphics.init("world");

			// Set interval
			// Calculate next step from the world
			// Draw the world state
			interval = setInterval(loop, life.config.loopInterval);
		}

		function buildNeuron() {

			neuron = new life.Neuron();
			life.neuronHandler.init(neuron);

			life.neuronHandler.add(neuron, 'ionic-channel', 'k1', life.ionicChannelHandler.build(life.Models.channelK1));
			life.neuronHandler.add(neuron, 'ionic-channel', 'na1', life.ionicChannelHandler.build(life.Models.channelNa1));
			life.neuronHandler.add(neuron, 'ionic-channel', 'cl1', life.ionicChannelHandler.build(life.Models.channelCl1));

			life.neuronHandler.add(neuron, 'synapse', 's1', life.synapseHandler.build(life.Models.synapseT1, -50));
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

				buildNeuron();

				

				//	handleGraphics();

				testACalculation();
			},

			manualSynapseActivation: function(synapseKey) {

				var start = new Date();
				var startTime = start.getTime();
				var synapse = life.neuronHandler.get(neuron, 'synapse', synapseKey);
				postsynapticPotential =  life.postsynapticPotentialHandler.build(synapse, startTime);

				life.neuronHandler.add(neuron, 'postsynaptic-potential', 'pp1', postsynapticPotential);
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

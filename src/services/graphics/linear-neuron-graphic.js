/**
 * @class
 * @author Alexandre Keller
 * @since 2015
 */

/** @namespace */
var Life = Life || {};

(function($, life) {

	life.LinearNeuronGraphics = function(settings) {

		/*** Private properties ***/

		var settings = $.extend({}, settings);
		var canvas = null;
		var layer = null;
		var worldWith = 0;
		var worldHeight = 0;

		var nScope = null;

		//	OCanvas
		var soma = null;
		var cytoplasm = null;
		var dendriteRuler = null;
		var axonRuler = null;
		var synapseLayer = null;
		var synapseList = null;
		var postsynapticPotentialList = null;

		//	JQuery
		var $speed = null;
		var $time = null;

		//	Services
		var cycleManager = null;

		/*** Private methods ***/

		/**
		 * Free any pointer stored on this object
		 * @return null
		 */
		function cleanMemory() {

			
		}

		function initOCanvas(worldId) {

			var worldDomElement = document.getElementById(worldId);
			worldWith = worldDomElement.width;
			worldHeight = worldDomElement.height;
			var canvasDimensions = {
				w: worldDomElement.width / 2,
				h: worldDomElement.height / 2
			}
			canvas = oCanvas.create({
				canvas: worldDomElement,
				background: "#fff"
			});

			//	Move coordinates to the canvas center
			layer = canvas.display.rectangle({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				fill: "transparent"
			})
			layer.move(canvasDimensions.w, canvasDimensions.h);
			canvas.addChild(layer);
		}

		function buildNeuron(nScopeParam) {

			nScope = nScopeParam;
			var neuron = nScope.neuron;
			addSoma();
			addCytoplasm(-580, 580);
			addRuler(dendriteRuler, -580, -2, neuron.model.distances.dendrites + " micrometers");
			addRuler(axonRuler, 2, 580, neuron.model.distances.axon + " micrometers");
			addSynapses(neuron.synapses, neuron.model.distances.dendrites, neuron.model.distances.axon);
			postsynapticPotentialList = new Array();
		}

		function addSoma() {
		
			soma = canvas.display.arc({
				x: 0,
				y: 0,
				radius: 46,
				start: 0,
				end: 360,
				fill: "#aaf"
			});

			layer.addChild(soma);
		}

		function addCytoplasm(x1, x2) {

			cytoplasm = canvas.display.rectangle({
				x: x1,
				y: -16,
				width: Math.abs(x2-x1),
				height: 32,
				fill: "#aaf"
			});

			layer.addChild(cytoplasm);
		}

		function removeSynapses() {

			if (synapseLayer != null) {
				layer.remove(synapseLayer);
				synapseLayer = null;
			}
		}

		function addSynapses(synapses, dendriteDistance, axonDistance) {

			//	Clear current synapses
			removeSynapses();
			synapseList = {};

			//	Synapses container
			synapseLayer = canvas.display.rectangle({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				fill: "transparent"
			})
			synapseLayer.move(0, -24);
			layer.addChild(synapseLayer);

			//	Add synapses
			for (var key in synapses) {
				synapseList[key] = addSynapse(synapses[key], dendriteDistance, axonDistance);
			}
		}

		function addSynapse(synapse, dendriteDistance, axonDistance) {

			var x = 0;
			if (synapse.x < 0) {
				x = (synapse.x / dendriteDistance) * (worldWith / 2);
			}
			else if (synapse.x > 0) {
				x = (synapse.x / axonDistance) * (worldWith / 2);
			}

			var ellipse = canvas.display.ellipse({
				x: x,
				y: 0,
				radius_x: 8,
				radius_y: 6,
				fill: "white",
				stroke: "2px #0aa"
			});
			ellipse.isActive = false;

			synapseLayer.addChild(ellipse);

			return ellipse;
		}

		function highlightSynapse(synapse) {

			if (!synapse.isActive) {
				synapse.isActive = true;
				synapse.fill = "#d66";
				synapse.stroke = "2px #d66";
			}
		}

		function removeHighlightSynapse(synapse) {

			if (synapse.isActive) {
				synapse.isActive = false;
				synapse.fill = "white";
				synapse.stroke = "2px #0aa";
			}
		}

		function updateSynapsesState(synapses) {

			for (var key in synapses) {
				if (synapses[key].isActive == true) {
					highlightSynapse(synapseList[key]);
				}
				else {
					removeHighlightSynapse(synapseList[key]);
				}
			}
		}

		function updatePostsynapticPotentials() {

			updatePostsynapticPotentialPositions();
		}

		function updatePostsynapticPotentialPositions() {

			for (let i=0, nb=postsynapticPotentialList.length; i<nb; i++) {

				postSynapticPotential = life.neuronHandler.get(nScope.neuron, 'postsynaptic-potential', i);
				if (postSynapticPotential != null) {
					let x = calculatePosition(postSynapticPotential.origin);
					postsynapticPotentialList[i].moveTo(x, -16);
				}
			}
		}

		function displayPostSynapticPotential(postSynapticPotentialKey) {

			postSynapticPotential = life.neuronHandler.get(nScope.neuron, 'postsynaptic-potential', postSynapticPotentialKey);

			var arc = canvas.display.arc({
				x: calculatePosition(postSynapticPotential.origin),
				y: -16,
				radius: 24,
				start: 0,
				end: 180,
				fill: "#ff6600",
				stroke: "1px #dd5500"
			});

			postsynapticPotentialList[postSynapticPotentialKey] = arc;

			layer.addChild(arc);
		}

		function removePostSynapticPotential(postSynapticPotentialKey) {

			//	Remove postsynaptic potential from canvas
			layer.removeChild(postsynapticPotentialList[postSynapticPotentialKey]);

			//	Update array accordingly
			postsynapticPotentialList.splice(postSynapticPotentialKey, 1);
		}

		function addRuler(ruler, x1, x2, label) {

			//	A group to easily select all children
			ruler = canvas.display.rectangle({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				fill: "transparent"
			})
			layer.addChild(ruler);

			var line1 = canvas.display.line({
				start: { x: x1, y: 100 },
				end: { x: x2, y: 100 },
				stroke: "2px #333",
				cap: "round"
			});
			var line2 = canvas.display.line({
				start: { x: x1, y: 130 },
				end: { x: x1, y:70 },
				stroke: "2px #333",
				cap: "round"
			});
			var line3 = canvas.display.line({
				start: { x: x2, y: 130 },
				end: { x: x2, y: 70 },
				stroke: "2px #333",
				cap: "round"
			}); 
			var text = canvas.display.text({
				x: Math.abs(x2-x1)/2 + x1,
				y: 80,
				origin: { x: "center", y: "center" },
				font: "bold 15px sans-serif",
				text: label,
				fill: "#333"
			});

			ruler.addChild(line1);
			ruler.addChild(line2);
			ruler.addChild(line3);
			ruler.addChild(text);
		}

		function buildCycleInfos(cycleManagerService, cycleListenerService) {

			cycleManager = cycleManagerService;
			cycleListener = cycleListenerService;

			$speed = $("#speedInfos");
			$time = $("#timeInfos");

			$(".cycle-action").click(function() {

				var $element = $(this);
				if ($element.hasClass("btn-enabled")) {
					var action = $element.attr('data-action');
					cycleListener.trigger(action);
				}
			});
		}

		function buildSynapseActivation(synapseListener) {

			$(".synapse-action").click(function() {
				var $element = $(this);
				var synapseKey = $element.attr('data-synapse-key');
				synapseListener.activate(synapseKey);
			});

		}

		function updateCycleInfos() {

			$speed.val(cycleManager.getSpeed());
			$time.val(cycleManager.getTime());
		}

		function updateCycleUI() {

			var $playButton = $(".cycle-action[data-action='play']");
			var $pauseButton = $(".cycle-action[data-action='pause']");
			var $forwardButton = $(".cycle-action[data-action='forward']");
			var $slowerButton = $(".cycle-action[data-action='slower']");
			var $fasterButton = $(".cycle-action[data-action='faster']");

			if (cycleManager.getIsPlaying()) {
				disableButton($playButton);
				enableButton($pauseButton);
				disableButton($forwardButton);
			}
			else {
				enableButton($playButton);
				disableButton($pauseButton);
				enableButton($forwardButton);
			}

			if (cycleManager.getSpeed() > 1) {
				enableButton($slowerButton);
			}
			else {
				disableButton($slowerButton);
			}

			if (cycleManager.getSpeed() < cycleManager.getMaxSpeed()) {
				enableButton($fasterButton);
			}
			else {
				disableButton($fasterButton);
			}
		}

		function enableButton($button) {

			$button.removeClass("btn-disabled");
			$button.addClass("btn-enabled");
		}

		function disableButton($button) {

			$button.removeClass("btn-enabled");
			$button.addClass("btn-disabled");
		}

		function calculatePosition(position) {

			var x = 0;
			if (position < 0) {
				x = (position / nScope.neuron.model.distances.dendrites) * (worldWith / 2);
			}
			else if (position > 0) {
				x = (position / nScope.neuron.model.distances.axon) * (worldWith / 2);
			}

			return x;
		}

		var scope = {

			/*** Public methods ***/

			/**
			 * Build a whole new world
			 * @param string worldId
			 * @param Life.Neuron neuronParam
			 * @param Life.CycleManager cycleManager
			 */
			init: function(worldId, nScopeParam, cycleManager, cycleListener) {

				initOCanvas(worldId);
				buildNeuron(nScopeParam);
				buildCycleInfos(cycleManager, cycleListener);
				buildSynapseActivation(nScopeParam.services.synapseListener);
				this.update();
			},

			/**
			 *	If a synapse is added after graphic service initialization this funtion must be used
			 */
			redrawElements: function() {

				//	todo
			},

			activateSynapse: function(key) {

				if (synapseList[key] != null) {
					highlightSynapse(synapseList[key]);
				}
			},

			/**
			 *	Already handled on each update. No need to call. I keep it 'cause it could help for doing some testing
			 *
			 *	@param  string key
			 *	@return null
			 */
			inactivateSynapse: function(key) {

				if (synapseList[key] != null) {
					removeHighlightSynapse(synapseList[key]);
				}
			},

			addPostsynapticPotential: function(postsynapticPotentialKey) {

				displayPostSynapticPotential(postsynapticPotentialKey);
			},

			removePostsynapticPotential: function(postsynapticPotential) {

				removePostSynapticPotential(postsynapticPotential);
			},

			addSynapse: function(arg1) {

			},

			update: function() {

				updateCycleInfos();
				updateCycleUI();
				if (nScope != null) {
					updateSynapsesState(nScope.neuron.synapses);
					updatePostsynapticPotentials();
				}
				canvas.redraw();
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

/**
 * @class
 * @author Alexandre Keller
 * @since 2015
 */

/** @namespace */
var Life = Life || {};

(function($, life) {

	life.Graphics = function(settings) {

		/*** Private properties ***/
		var settings = $.extend({}, settings);
		var canvas = null;
		var layer = null;

		//	OCanvas
		var soma = null;
		var cytoplasm = null;
		var dendriteRuler = null;
		var axonRuler = null;

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

		function buildNeuron(neuron) {

			addSoma();
			addCytoplasm(-580, 580);
			addRuler(dendriteRuler, -580, -44, neuron.model.distances.dendrites + " micrometers");
			addRuler(axonRuler, 44, 580, neuron.model.distances.axon + " micrometers");
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

		function buildCycleInfos(cycleManagerParam) {

			cycleManager = cycleManagerParam;

			$speed = $("#speedInfos");
			$time = $("#timeInfos");
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

		var scope = {

			/*** Public methods ***/

			/**
			 * Build a whole new world
			 * @param string worldId
			 * @param Life.Neuron neuron
			 */
			init: function(worldId, neuron, cycleManager) {

				initOCanvas(worldId);
				buildNeuron(neuron);
				buildCycleInfos(cycleManager);
				this.update();
			},

			update: function() {

				updateCycleInfos();
				updateCycleUI();
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

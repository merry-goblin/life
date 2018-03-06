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
		
		var soma = null;
		var cytoplasm = null;
		var dendriteLength = null;

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
			
			addSoma();
			addCytoplasm();
			addDendriteLenth();
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

		function addCytoplasm() {

			cytoplasm = canvas.display.rectangle({
				x: -580,
				y: -16,
				width: 1160,
				height: 32,
				fill: "#aaf"
			});

			layer.addChild(cytoplasm);
		}

		function addDendriteLenth() {

			//	A group to easily select all children
			dendriteLength = canvas.display.rectangle({
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				fill: "transparent"
			})
			layer.addChild(dendriteLength);

			var line1 = canvas.display.line({
				start: { x: -580, y: 100 },
				end: { x: -42, y: 100 },
				stroke: "2px #333",
				cap: "round"
			});
			var line2 = canvas.display.line({
				start: { x: -580, y: 140 },
				end: { x: -580, y:60 },
				stroke: "2px #333",
				cap: "round"
			});
			var line3 = canvas.display.line({
				start: { x: -44, y: 140 },
				end: { x: -44, y: 60 },
				stroke: "2px #333",
				cap: "round"
			}); 

			dendriteLength.addChild(line1);
			dendriteLength.addChild(line2);
			dendriteLength.addChild(line3);
		}

		var scope = {

			/*** Public methods ***/

			/**
			 * Build a whole new world
			 * @param string worldId
			 */
			init: function(worldId) {

				initOCanvas(worldId);
				this.update();
			},

			update: function() {

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

/**
 * @class
 * @author Alexandre Keller
 * @since 2018
 */

/** @namespace */
var Life = Life || {};

(function(life) {

	life.NeuronManager = function() {

		/*** Private properties ***/

		var nScope = null;
		var newPspIndexes = null; // List of postsynaptic potential indexes to test proximity with others postsynatpic potentials

		/*** Private methods ***/

		function consumeActivations() {

			for (var key in nScope.neuron.synapses) {
				life.synapseHandler.consumeActivation(nScope.neuron.synapses[key]);
			}
		}

		function checkNewPostsynapticPotentials(timePassed) {

			var pspList = nScope.neuron.postsynapticPotentials;
			var pspIndexListToIgnore = new Array();
			var pspToMerge = new Array();

			if (newPspIndexes.length > 0) {

				//	We have to check proximity with new postsynpatic potentials created and old ones
				for (var i in newPspIndexes) {

					var currentPspIndex = newPspIndexes[i];
					for (var pspIndex in pspList) {

						//	Ignore tests already done
						if (pspIndex != currentPspIndex) {
							if (!life.utils.inArray(pspIndex, pspIndexListToIgnore)) {

								if (checkTwoPostsynapticPotentialsProximity(pspList[pspIndex], pspList[currentPspIndex])) {
									pspToMerge.push([pspIndex, currentPspIndex]);
								}
							}
						}

					}
					pspIndexListToIgnore.push(currentPspIndex);
				}
			}

			handlePostsynapticPotentialsMerging(pspToMerge);

			newPspIndexes = new Array();
		}

		function checkTwoPostsynapticPotentialsProximity(psp1, psp2) {

			var distance = Life.arithmetic.getDistanceOnOneAxis(psp1.origin, psp2.origin);
			if (distance <= life.config.potentialProximity) {
				
				return true;
			}
			return false;
		}

		function handlePostsynapticPotentialsMerging(pspIndexesToMerge) {

			let pspListToDelete = new Array();

			//	Merging
			for (let i=0, nb=pspIndexesToMerge.length; i<nb; i++) {

				//	We don't remove a postsynaptic potential twice
				if (!life.utils.inArray(pspIndexesToMerge[i][1], pspListToDelete)) {
					let psp = mergeTwoPostsynapticPotentials(pspIndexesToMerge[i][0], pspIndexesToMerge[i][1]);
					pspListToDelete.push(pspIndexesToMerge[i][1]);
				}
			}

			//	We want the last indexes to be removed before the first ones
			pspListToDelete.sort(function(a, b) {
				return (a < b) ? 1 : -1;
			});

			//	Removing
			for (let i=0, nb=pspListToDelete.length; i<nb; i++) {
			
				life.neuronHandler.remove(nScope, 'postsynaptic-potential', pspListToDelete[i]);
			}
		}

		function mergeTwoPostsynapticPotentials(psp1Index, psp2Index) {

			let pspList = nScope.neuron.postsynapticPotentials;
			let diff = pspList[psp2Index].potential - nScope.neuron.model.standByPotential;
			let middle = life.arithmetic.getMiddleOnOneAxis(pspList[psp1Index].origin, pspList[psp2Index].origin);

			//	First postsynaptic potential is modified
			pspList[psp1Index].potential += diff;
			pspList[psp1Index].origin = middle;

			//	Second is deleted
			pspList[psp2Index].delete = true;
		}

		function postsynapticPotentialsDilution(timePassed) {

			if (timePassed != 0) {

				var pspList = nScope.neuron.postsynapticPotentials;
				let standByPotential = nScope.neuron.model.standByPotential;

				//	Postsynaptic potential get closer to neuron stand by potential
				for (var pspIndex in pspList) {
					if (!pspList[pspIndex].new) {
						//	First iteration is ignore (no dilution)
						pspList[pspIndex].new = true;
						continue;
					}
					let toRemove = false;
					let potential = pspList[pspIndex].potential;
					if (potential > standByPotential) {
						potential = potential - (life.globals.potentialDilution * timePassed);
						if (potential < standByPotential) {
							potential = standByPotential;
							toRemove = true;
						}
					}
					else {
						potential = potential + (life.globals.potentialDilution * timePassed);
						if (potential > standByPotential) {
							potential = standByPotential;
							toRemove = true;
						}
					}
					pspList[pspIndex].potential = potential;

					if (toRemove) {
						life.neuronHandler.remove(nScope, 'postsynaptic-potential', pspIndex);
					}
				}
			}
		}

		/**
		 * We check each postsynaptic potentials in order to see 
		 * if we have to replace them by an action potential
		 * 
		 * @param  integer timePassed
		 * @return null
		 */
		function checkNewActionPotentials(time, timePassed) {

			if (timePassed != 0) {

				let threshold = nScope.neuron.model.threshold;
				let pspList = nScope.neuron.postsynapticPotentials;

				for (let pspIndex in pspList) {
					let psp = pspList[pspIndex];
					//	todo : this test is too much simplified ... should be a range test instead
					if (psp.potential > threshold) {
						convertPostSynapticPotentialToActionPotential(psp, time);
					}
				}
			}
		}

		function convertPostSynapticPotentialToActionPotential(psp, time) {

			//	Add an action potential
			let actionPotentialRight = life.actionPotentialHandler.build(psp.origin, time, 1);
			let actionPotentialLeft = life.actionPotentialHandler.build(psp.origin, time, -1);

			life.neuronHandler.add(nScope, nScope.neuron, 'action-potential', null, actionPotentialRight);
			life.neuronHandler.add(nScope, nScope.neuron, 'action-potential', null, actionPotentialLeft);

			//	Remove a postsynaptic pontential
			life.neuronHandler.remove(nScope, 'postsynaptic-potential', psp.id);
		}

		function checkActionPotentialCollisions(timePassed) {

			if (timePassed != 0) {
				let apList = nScope.neuron.actionPotentials;
				let pspList = nScope.neuron.postsynapticPotentials;
				let ignoreList = [];

				for (let apIndex in apList) {
					ignoreList[] = apIndex;

					//	Action potentials
					for (let apIndex2 in apList) {
						//	We don't check an action potential twice
						if (!inArray(apIndex, ignoreList)) {
							let isCollided = checkCollisionBetweenTwoActionPotentials(apList[apIndex], apList[apIndex2]);
							life.neuronHandler.remove(nScope, 'action-potential', apIndex);
							life.neuronHandler.remove(nScope, 'action-potential', apIndex2);
						}
					}

					//	Postsynaptic potentials
					for (let pspIndex in pspList) {
						let isCollided = checkCollisionBetweenActionPotentialAndPostsynapticPotential(apList[apIndex], pspList[pspIndex]);
						life.neuronHandler.remove(nScope, 'postsynaptic-potential', pspIndex);
					}
				}
			}
		}

		function checkCollisionBetweenTwoActionPotentials(ap1, ap2) {

			let isCollided = false;

			

			return isCollided;
		}

		function checkCollisionBetweenActionPotentialAndPostsynapticPotential(ap, psp) {

			let isCollided = false;



			return isCollided;
		}

		function moveActionPotentials(timePassed) {

			for (var actionPotentialIndex in nScope.neuron.actionPotentials) {

				var actionPotential = nScope.neuron.actionPotentials[actionPotentialIndex];
				moveActionPotential(actionPotential, timePassed);
			}
		}

		function moveActionPotential(actionPotential, timePassed) {

			let step = nScope.neuron.model.impulseSpeed * timePassed * actionPotential.direction;
			actionPotential.origin += step;

			checkEndReachedForActionPotential(actionPotential);
		}

		/**
		 * If actionPotential is out of dendrite of axon we have to delete it
		 * @param  Life.ActionPotential actionPotentia
		 * @return null
		 */
		function checkEndReachedForActionPotential(actionPotential) {

			if (actionPotential.direction == -1) {
				// Dendrite
				if (actionPotential.origin < -1*nScope.neuron.model.distances.dendrites) {
					life.neuronHandler.remove(nScope, 'action-potential', actionPotential.id);
				}
			}
			else {
				// Axon
				if (actionPotential.origin > nScope.neuron.model.distances.axon) {
					life.neuronHandler.remove(nScope, 'action-potential', actionPotential.id);
					nScope.neuron.presynapticPotentialActivation = true;
				}
			}
		}

		var scope = {

			/*** Public methods ***/

			init: function(nScopeParam) {

				nScope = nScopeParam;
				newPspIndexes = new Array();
			},

			generatePostsynapticPotential: function(synapseKey) {

				var synapse = life.neuronHandler.get(nScope.neuron, 'synapse', synapseKey);
				postsynapticPotential = life.synapseHandler.activate(synapse);

				life.neuronHandler.add(nScope, nScope.neuron, 'postsynaptic-potential', null, postsynapticPotential);
				newPspIndexes.push(postsynapticPotential.id);
			},

			iterate: function(time, timePassed) {

				if (timePassed > 0) {
					consumeActivations(); // todo : maybe not the best way to proceed. A neuron manager has to modify a neuron and not other neurons

					//	Action potentials
					checkActionPotentialCollisions(timePassed);
					moveActionPotentials(timePassed);
					checkNewActionPotentials(time, timePassed);

					//	Postsynaptic potentials
					checkNewPostsynapticPotentials(timePassed);
					postsynapticPotentialsDilution(timePassed);
				}
			},

			/**
			 * Free any pointer stored in an element
			 * @return null
			 */
			destruct: function() {

				
			}
		}
		return scope;
	}

})(Life);
